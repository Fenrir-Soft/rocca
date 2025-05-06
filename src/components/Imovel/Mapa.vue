<template>
    <div class="map-container">
        <ul>
            <li v-for="tag in tags" :class="{ ativo: tags_selecionadas.includes(tag.id) }">
                <span>
                    <label>
                        {{ tag.title }}
                        <input type="checkbox" :value="tag.id" v-model="tags_selecionadas" />
                    </label>
                </span>
            </li>
        </ul>
        <div ref="map_container" class="mapa"></div>
    </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css';
import type { Poi, Tag } from '../../lib/proximity-search';

interface Props {
    latitude: string,
    longitude: string,
    pois: Poi[]
}

const props = defineProps<Props>()

const map_container = ref<HTMLElement>()
let map: L.Map
const tags_selecionadas = ref<string[]>([])

const tags = computed(() => {

    let tags: Map<string, Tag> = new Map()
    for (let poi of props.pois) {
        for (let tag of poi.tags) {
            tags.set(tag.id, tag)
        }
    }

    let resp = Array.from(tags.values())
    resp.sort((a, b) => a.title < b.title ? -1 : 1)
    return resp
})
const icon = L.icon({
    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII='
})
const markers = computed(() => {
    let markers = props.pois.filter(({ tags }) => {
        {
            let resp = tags.filter(tag => tags_selecionadas.value.includes(tag.id))
            return resp.length > 0
        }
    }).map(place => {
        return L.marker(new L.LatLng(place.lat, place.lng), {
            title: place.name,
            icon
        })
    })
    return markers
})

const feature_group = computed(() => {

    return L.featureGroup([...markers.value, circle.value])
})

const center = computed(() => {
    return new L.LatLng(Number(props.latitude), Number(props.longitude))
})

const circle = computed(() => {
    return L.circle(center.value, {
        radius: 500,
        color: 'black',
        fillColor: 'black',
        fillOpacity: 0.5
    })
})

onMounted(() => {
    if (!map_container.value) {
        return
    }
    map = L.map(map_container.value).setView(center.value, 17)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    circle.value.addTo(map)
    map.fitBounds(circle.value.getBounds())
})

watch(feature_group, (novo, antigo) => {
    if (map) {
        if (antigo) {
            map.removeLayer(antigo)
        }
        novo.addTo(map)
        map.fitBounds(novo.getBounds())
    }
})

onUnmounted(() => {
    if (map) {
        map.remove()
    }
})

</script>
<style lang="less" scoped>
.map-container {
    margin-top: 6em;
    margin-bottom: 2em;

}

.mapa {
    width: 100%;
    height: 450px;
    margin-top: 1em;
}

ul {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
        margin-right: 0.2em;
        display: inline-block;
        
        [type=checkbox] {
            display: none;
        }
        
        user-select: none;
                
        label {
            display: block;
            cursor: pointer;
            padding: .5rem .8rem;
            font-size: .8rem;
            background-color: #c4c4c4;
            border-radius: 4px;
            margin-bottom: 3px;
            color: dimgray;
        }

        &.ativo {
            label {
                background-color: black;
                color: white;
            }
        }
}

}
</style>