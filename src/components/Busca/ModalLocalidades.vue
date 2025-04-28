<template>
    <ModalDialog id="dialog-localidades">        

        <div v-for="cidade in Cidades">

            <ul class="categorias" v-for="zona in cidade.zonas">
                <li>
                    <label>
                        <input type="checkbox" name="zona[]" :value="zona.slug" :id="`zona-${zona.slug}`" />
                        {{cidade.Cidade}} - {{zona.titulo}}
                    </label>
                    <ul class="categorias">

                        <li v-for="bairro in zona.bairros">
                            <label>
                                <input type="checkbox" name="bairro[]" :value="bairro.slug"
                                    v-model="bairros"
                                    :id="`bairro-${bairro.slug}`" />
                                {{bairro.Bairro}}
                            </label>
                        </li>

                    </ul>
                </li>
            </ul>


            <ul class="categorias">

                <li v-if="cidade.zonas.length === 0">
                    <label>
                        <input type="checkbox" name="cidade[]" :value="cidade.slug" :id="`cidade-${cidade.slug}`" />
                        {{cidade.Cidade}}
                    </label>
                    <ul class="categorias">

                        <li v-for="bairro in cidade.bairros">
                            <label>
                                <input type="checkbox" name="bairro[]" :value="bairro.slug"
                                    v-model="bairros"
                                    :id="`bairro-${bairro.slug}`" />
                                {{bairro.Bairro}}
                            </label>
                        </li>

                    </ul>
                </li>

            </ul>
        </div>
        <template #footer>
            <div>
                <a role="button" class="raleway" @click="limpar">Limpar</a>
            </div>
            <div>
                <a @click="aplicar" role="button" class="raleway btn-primary">Aplicar</a>
            </div>
            <div>
                <a role="button">&nbsp;</a>
            </div>

        </template>
    </ModalDialog>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Cidade } from '../../api/cidades';
import ModalDialog from './ModalDialog.vue';


interface Props {
    cidade: Cidade | null
    bairros_selecionados: string[]
}

const props = defineProps<Props>()
const emits = defineEmits<{
    (e: 'update:bairros_selecionados', value: string[]): void
}>()

const bairros = ref<string[]>(props.bairros_selecionados||[])

const Cidades = computed(() => {
    if (!props.cidade) {
        return []
    }
    return [props.cidade]
})

const url_close = computed(() => {
    const url = new URL(location.href)
    url.hash = '#none'
    
    return url.toString()
})

const limpar = () => {
    bairros.value = []
}

const aplicar = () => {
    console.table(bairros.value)
    emits('update:bairros_selecionados', [...bairros.value])
    location.href=url_close.value
}

if (location.hash === '#dialog-localidades') {
    const orig = location.href
    location.href = url_close.value
    setTimeout(() => { 
        location.href = orig

    }, 0)
}

</script>

<style lang="less">
.header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 1.5em;

    div {
        display: flex;
        align-items: center;
        justify-content: space-between;

        h3 {
            margin: 0;
            padding: 0;
            color: dimgray;
            font-weight: 600;
        }

        input {
            padding: 1.25em 0.75em;
            width: 60%;
            background-color: #efefef;
            border: none;
            border-radius: 0.25em;
            color: #626262;
            font-weight: 500;
            outline: none;

            &::placeholder {
                color: inherit;
                font-weight: inherit;
            }
        }
    }

    select {
        background-color: dimgray;
        color: white;
        padding: 1.25em 0.75em;
        min-width: 25%;
        outline: none;
        border-radius: 0.25em;
    }
}

@media (max-width: 24em) {
    .header {
        flex-direction: column;
        padding-bottom: 1em;

        div {
            flex-direction: column;
            align-items: flex-start;

            h3 {
                margin-bottom: 0.25em;
            }

            input {
                width: 100%;
                margin-bottom: 1em;
            }
        }
    }
}

ul.categorias {
    display: grid;
    width: 55em;

    @media (max-width: 55em) {
        width: 100%;
    }

    grid-template-columns: repeat(auto-fit, minmax(12em, 1fr));
    grid-gap: 0.5rem 0.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 0.9em;

    li {
        label {
            display: flex;
            align-items: center;
            padding: 0.35em;

            &:first-child {
                font-weight: 500;
                background-color: dimgray;
                color: white;
                gap: 0.5em;
                border-radius: 0.2em;
            }
        }

        ul {
            li {
                label {
                    &:first-child {
                        background-color: unset;
                        color: unset;
                        font-weight: unset;
                    }
                }
            }

            margin-bottom: 1em;
        }
    }
}
</style>