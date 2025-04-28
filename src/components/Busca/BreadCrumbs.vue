<template>
    <ul class="bread-crumbs">
        <li v-for="item in items">{{ item }}</li>
    </ul>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { bairros as bairros_slugs, tipos as categorias_slugs, finalidade } from '../../store/search-params'
import type { Bairro } from '../../api/bairros'
import type { Categoria } from '../../api/categorias'

interface Props {
    bairros: Bairro[],
    categorias: Categoria[]
}

const props = defineProps<Props>()

const items = computed(() => {
    let rows: string[] = ['Início']
    if (finalidade.value === 'comprar') {
        rows.push('Comprar')
    } else if (finalidade.value === 'alugar') {
        rows.push('Alugar')
    } else if (finalidade.value === 'condominios') {
        rows.push('Condomínios')
    }

    if (bairros_slugs.value.length > 0) {
        let [bairro_slug] = bairros_slugs.value
        
        const bairro = props.bairros.find(bairro => {
            return bairro.slug === bairro_slug
        })
        if (bairro) {
            rows.push(bairro.Bairro)
            rows.push(bairro.Cidade)
            rows.push(bairro.UF)
        }
    }
    
    if (categorias_slugs.value.length > 0) {
        let [categoria_slug] = categorias_slugs.value
        const categoria = props.categorias.find(categoria => {
            return categoria.slug === categoria_slug
        })
        
        if (categoria) {
            rows.push(categoria.Categoria)
        }
    }

    return rows
})

</script>
<style lang="less" scoped>
ul.bread-crumbs {
    list-style: none;
    margin: 0;
    padding: 0;
    padding-top: 1em;
    padding-bottom: 1em;

    li {
        display: inline;

        &::after {
            content: ">";
            margin-left: 1em;
            margin-right: 1em;
        }

        &:last-child {
            &::after {
                content: "";
                margin: 0;
            }

            font-weight: 500;
        }
    }
}
</style>