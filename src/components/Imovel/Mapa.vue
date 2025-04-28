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

const markers = computed(() => {
    let markers = props.pois.filter(({ tags }) => {
        {
            let resp = tags.filter(tag => tags_selecionadas.value.includes(tag.id))
            return resp.length > 0
        }
    }).map(place => {
        return L.marker(new L.LatLng(place.lat, place.lng), {
            title: place.name
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
    margin-top: 2em;
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