<template>
    <a class="imovel" :href="`imovel/${imovel.slug_status}/${imovel.codigo}/${imovel.slug}`">
        <picture v-if="foto">            

            <img 
                :src="`${cdn_endpoint}/${foto.image_cdn.bucket}/${foto.image_cdn.hash}/${foto.image_cdn.id}_w400.webp`"
                loading="lazy" 
                :alt="`${imovel.codigo}`" 
                :width="foto.image_cdn.width" 
                class="foto-destaque"
                decoding="async" />
        </picture>
        <div class="imovel-content">
            <div class="content-body">
                <small>Cod {{ imovel.codigo }}</small>
                <p>
                    <b>{{ imovel.categoria }}</b>&nbsp;
                    <!--
                        <b v-if="imovel.venda && imovel.locacao">à venda ou locação</b>
                        <b v-else-if="imovel.venda">à venda</b>
                        <b v-else-if="imovel.locacao">para alugar</b>
                        -->
                </p>
                <p>
                    Rua {{ imovel.endereco }}<br />
                    {{ imovel.bairro }}, {{ imovel.cidade }}
                    <!--Rua Doutor Diário de Bittencourt<br />Agronomia. Porto Alegre-->
                </p>
                <p v-if="imovel.condominio"><b>{{ imovel.condominio}}</b></p>
                <p v-else-if="imovel.bairro_comercial"><b>{{ imovel.bairro_comercial}}</b></p>
                <p v-else-if="imovel.bairro"><b>{{ imovel.bairro}}</b></p>
                <ul>
                    <li v-if="imovel.dormitorios > 0"><b>{{ imovel.dormitorios }}</b> quarto(s)</li>
                    <li v-if="imovel.area_privativa > 0"><b>{{ imovel.area_privativa.toFixed(0) }}</b>m²</li>
                    <li v-if="imovel.vagas > 0"><b>{{ imovel.vagas }}</b> vaga(s)</li>
                </ul>

            </div>
            <div class="footer">
                <p class="valor" v-if="imovel.venda && imovel.valor_venda > 0">
                    <small>Venda<br /></small>
                    <small>R$</small>
                    <b>{{ imovel.valor_venda.toLocaleString('pt-BR', { maximumFractionDigits: 0}) }}</b>
                </p>
                <p class="valor" v-if="imovel.locacao && imovel.valor_locacao > 0">
                    <small>Locação<br /></small>
                    <small>R$</small>
                    <b>{{ imovel.valor_locacao.toLocaleString('pt-BR', { maximumFractionDigits: 0}) }}</b>
                </p>
                <button>Ver mais</button>
            </div>
        </div>
    </a>
</template>
<script setup lang="ts">

import type { InferEntrySchema } from 'astro:content';

interface Props {
    imovel: InferEntrySchema<'imoveis'>,
    foto?: InferEntrySchema<'fotos'>
}

const props = defineProps<Props>()

const cdn_endpoint = import.meta.env.PUBLIC_CDN_API_ENDPOINT

</script>
<style lang="less" scoped>
    
    .imovel {
        color: black;
        border-radius: 1em;
        overflow: hidden;
        
        min-width: 276px;
        max-width: 400px;
        
        
        box-shadow: 0 0 10px -2px #cccccc;
        display: flex;
        flex-direction: column;
        //flex: 1 1;
        .imovel-content {
            padding: 1em;
            display: flex;
            flex-direction: column;                                
            flex-grow: 1;
            justify-content: space-between;
            .footer {
                            
                justify-self: flex-end;
            }            
        }

        button {
            border: 0;
            border-radius: 10px;
            background-color: #000c39;
            color: white;
            padding: 6px 12px;
            cursor: pointer;
        }

        ul {
            list-style: none;
            display: flex;
            justify-content: space-between;
            margin: 0;
            padding: 0;
           
        }
        .valor {
            font-weight: 600;
            small {
                margin-right: 0.5em;
                font-size: 14px;
            }
            b {
                font-weight: 600;
                font-size: 24px;
            }
        }
        
        .foto-destaque {
            object-fit: cover;
            aspect-ratio: 4/3;
            width: 100%;
        }
    }
</style>
