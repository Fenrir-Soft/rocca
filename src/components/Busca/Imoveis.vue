<template>
    <Imovel :imovel="imovel" :foto="fotos.get(imovel.codigo)" v-for="imovel in results" />
</template>
<script setup lang="ts">
import type { InferEntrySchema } from 'astro:content';
import Imovel from './Imovel.vue'
import { computed, ref } from 'vue';
import { bairros, codigos, finalidade, tipos, dormitorios, suites, vagas, valor_de, valor_ate, condominio } from '../../store/search-params';
import slugify from 'slugify';

interface Props {
    imoveis: InferEntrySchema<'imoveis'>[],
    fotos: InferEntrySchema<'fotos'>[]
}

const props = defineProps<Props>()

const results = computed(() => {
    return props.imoveis.filter((imovel) => {
        if (condominio.value != '' && imovel.condominio != condominio.value) {
            return false
        }
        if (bairros.value.length > 0) {
            let bairro_slug = slugify(`${imovel.bairro} ${imovel.cidade} ${imovel.uf}`.replace(/\//igm, ' '), {
                lower: true
            })
            let bairro_comercial_slug = slugify(`${imovel.bairro_comercial || imovel.bairro} ${imovel.cidade} ${imovel.uf}`.replace(/\//igm, ' '), {
                lower: true
            })
            
            if (!bairros.value.includes(bairro_slug) && !bairros.value.includes(bairro_comercial_slug)) {
                return false
            }
        }

        if (dormitorios.value > 0) {
            if (imovel.dormitorios < dormitorios.value) {
                return false
            }
        }

        if (suites.value > 0) {
            if (imovel.suites < suites.value) {
                return false
            }
        }        
        
        if (vagas.value > 0) {
            if (imovel.vagas < vagas.value) {
                return false
            }
        }        

        let pass_venda = true
        let pass_locacao = true

        if (valor_de.value > 0) {
            pass_venda = (imovel.valor_venda > valor_de.value) && imovel.venda && imovel.valor_venda > 0
            pass_locacao = (imovel.valor_locacao > valor_de.value) && imovel.locacao && imovel.valor_locacao > 0
        }
        if (valor_ate.value > 0) {
            pass_venda = (imovel.valor_venda < valor_ate.value) && imovel.venda && imovel.valor_venda > 0 && pass_venda
            pass_locacao = (imovel.valor_locacao < valor_ate.value) && imovel.locacao && imovel.valor_locacao > 0 && pass_locacao
        }

        if (finalidade.value === 'comprar' && !pass_venda) {
            return false
        } else if (finalidade.value === 'alugar' && !pass_locacao) {
            return false
        } else if (!pass_venda && !pass_locacao) {
            return false
        }
        



        if (tipos.value.length > 0) {
            let tipo_slug = slugify(imovel.categoria.replace(/\//igm, ' '), {
                lower: true,                   
            })
            
            if (!tipos.value.includes(tipo_slug)) {
                return false
            }
        }

        if (finalidade.value.length > 0) {
            if (finalidade.value === 'comprar' && !imovel.venda) {
                return false
            }
            if (finalidade.value === 'alugar' && !imovel.locacao) {
                return false
            }
            if (finalidade.value === 'condominios' && !['Casa em Condomínio'].includes(imovel.categoria)) {                
                return false
            }
        }
        
        if (codigos.value.length > 0) {
            if (!codigos.value.includes(`${imovel.codigo}`)) {
                return false
            }
        }

        return true
    })
})


const fotos = computed<Map<string, InferEntrySchema<'fotos'>>>(() => {
    const map: Map<string, InferEntrySchema<'fotos'>> = new Map()

    for (let foto of props.fotos) {
        map.set(foto.Codigo, foto)
    }

    return map
})

</script>