<template>
    <div>
        <button class="btn-mais-filtros" @click.prevent.stop="toggleDrawer">
            <span>
                Mais Filtros
            </span>
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M0.72998 11.125C0.72998 10.7108 1.06577 10.375 1.47998 10.375H11.605C12.0192 10.375 12.355 10.7108 12.355 11.125C12.355 11.5392 12.0192 11.875 11.605 11.875H1.47998C1.06577 11.875 0.72998 11.5392 0.72998 11.125Z"
                    fill="white" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M14.605 11.125C14.605 10.7108 14.9408 10.375 15.355 10.375H17.98C18.3942 10.375 18.73 10.7108 18.73 11.125C18.73 11.5392 18.3942 11.875 17.98 11.875H15.355C14.9408 11.875 14.605 11.5392 14.605 11.125Z"
                    fill="white" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M13.48 10C12.8587 10 12.355 10.5037 12.355 11.125C12.355 11.7463 12.8587 12.25 13.48 12.25C14.1013 12.25 14.605 11.7463 14.605 11.125C14.605 10.5037 14.1013 10 13.48 10ZM10.855 11.125C10.855 9.67525 12.0303 8.5 13.48 8.5C14.9297 8.5 16.105 9.67525 16.105 11.125C16.105 12.5747 14.9297 13.75 13.48 13.75C12.0303 13.75 10.855 12.5747 10.855 11.125Z"
                    fill="white" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M0.72998 2.875C0.72998 2.46079 1.06577 2.125 1.47998 2.125H5.60498C6.01919 2.125 6.35498 2.46079 6.35498 2.875C6.35498 3.28921 6.01919 3.625 5.60498 3.625H1.47998C1.06577 3.625 0.72998 3.28921 0.72998 2.875Z"
                    fill="white" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M8.60498 2.875C8.60498 2.46079 8.94077 2.125 9.35498 2.125H17.98C18.3942 2.125 18.73 2.46079 18.73 2.875C18.73 3.28921 18.3942 3.625 17.98 3.625H9.35498C8.94077 3.625 8.60498 3.28921 8.60498 2.875Z"
                    fill="white" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M7.47998 1.75C6.85866 1.75 6.35498 2.25368 6.35498 2.875C6.35498 3.49632 6.85866 4 7.47998 4C8.1013 4 8.60498 3.49632 8.60498 2.875C8.60498 2.25368 8.1013 1.75 7.47998 1.75ZM4.85498 2.875C4.85498 1.42525 6.03023 0.25 7.47998 0.25C8.92973 0.25 10.105 1.42525 10.105 2.875C10.105 4.32475 8.92973 5.5 7.47998 5.5C6.03023 5.5 4.85498 4.32475 4.85498 2.875Z"
                    fill="white" />
            </svg>
        </button>
        <nav class="drawer raleway" v-if="show_drawer">
            <div class="backdrop" @click="toggleDrawer"></div>
            <form action="busca">
                <input type="hidden" name="finalidade" v-model="finalidade">
                <div class="drawer-content">
                    <h3>
                        <span> Filtros </span>
                        <button class="btn-close" @click.prevent.stop="toggleDrawer">X</button>
                    </h3>
                    <ul>
                        <li>
                            <PillButton v-model="finalidades" value="comprar">
                                Comprar
                            </PillButton>
                            <PillButton v-model="finalidades" value="alugar">
                                Alugar
                            </PillButton>
                            <PillButton v-model="finalidades" value="condominios">
                                Condomínios
                            </PillButton>
                            
                        </li>
                        <li>
                            <Collapsible titulo="Tipos">
                                <div v-for="tipo in tipos">
                                    <div class="title">
                                        {{ tipo.titulo }}
                                    </div>
                                    <div>
                                        <PillButton v-model="categorias_selecionadas" :value="categoria.slug"
                                            v-for="categoria in tipo.tipos.map(categoria_id => categorias_map.get(categoria_id)).filter((c) => c !== undefined)">
                                            {{ categoria.Categoria }}
                                        </PillButton>

                                    </div>
                                    <br />

                                </div>
                            </Collapsible>

                            <input type="hidden" name="categorias[]" :value="categoria"
                                v-for="categoria in categorias_selecionadas" />
                        </li>
                        <li>
                            <Collapsible titulo="Localização">
                                <label>Selecione uma Cidade:</label>
                                <select name="cidade" v-model="cidade_selecionada">
                                    <option :value="cidade.slug" v-for="cidade in cidades">{{ cidade.Cidade }}</option>
                                </select>
                                <br />
                                <br />

                                <a :href="url_modal_localidades" role="button" class="raleway" type="button">
                                    <span v-if="bairros_selecionados.length > 0">
                                        {{ bairros_selecionados.length }}

                                        bairro(s) selecionado(s)
                                    </span>
                                    <span v-else>
                                        Selecione um bairro
                                    </span>
                                </a>

                            </Collapsible>
                        </li>
                        <li>
                            <Collapsible titulo="Cômodos">
                                <div class="dormitorios">
                                    <span>Dormitórios</span>
                                    <div>
                                        <PillButton v-model="dormitorios_selecionados" :value="`${d}`" v-for="d in 4">{{
                                            d
                                            }}+</PillButton>
                                    </div>
                                </div>
                                <div class="dormitorios">
                                    <span>Suítes</span>
                                    <div>
                                        <PillButton v-model="suites_selecionadas" :value="`${d}`" v-for="d in 4">{{ d
                                            }}+
                                        </PillButton>
                                    </div>
                                </div>
                                <input type="hidden" name="dormitorios" :value="DormitoriosSelecionados"
                                    v-if="DormitoriosSelecionados > 0" />
                                <input type="hidden" name="suites" :value="SuitesSelecionadas"
                                    v-if="SuitesSelecionadas > 0" />
                            </Collapsible>
                        </li>
                        <li>
                            <Collapsible titulo="Vagas">
                                <div class="vagas">
                                    <PillButton v-model="vagas_selecionadas" :value="`${d}`" v-for="d in 4">{{ d }}+
                                    </PillButton>
                                </div>

                                <input type="hidden" name="vagas" :value="VagasSelecionadas"
                                    v-if="VagasSelecionadas > 0" />
                            </Collapsible>
                        </li>
                        <li>
                            <Collapsible titulo="Valores">
                                <div class="valores">
                                    <input type="text" v-model="valor_de" placeholder="Valor De" />
                                    <input type="text" v-model="valor_ate" placeholder="Valor Até" />
                                </div>
                                <input type="hidden" name="valor_de" :value="ValorDe" />
                                <input type="hidden" name="valor_ate" :value="ValorAte" />
                            </Collapsible>
                        </li>
                        <li>
                            <div class="codigos">

                                <input type="text" placeholder="Código" name="codigo" v-model="codigos">
                            </div>
                        </li>
                    </ul>
                    <div class="buttons">
                        
                        <button type="submit">Ver Imóveis</button>
                    </div>
                </div>
                <ModalLocalidades @update:bairros_selecionados="updateBairrosSelecionados" :cidade="CidadeSelecionada"
                    :bairros_selecionados="bairros_selecionados"></ModalLocalidades>
            </form>
        </nav>
    </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Categoria } from '../../api/categorias';
import type { CategoriaTipo } from '../../api/categorias-tipos';
import PillButton from './PillButton.vue';
import { finalidade as finalidade_query ,tipos as tipos_query, codigos as codigos_query, cidade as cidade_query, bairros as bairros_query, dormitorios, suites, vagas, valor_de as valor_de_query, valor_ate as valor_ate_query } from '../../store/search-params';
import Collapsible from './Collapsible.vue';
import type { Cidade } from '../../api/cidades';
import type { Bairro } from '../../api/bairros';
import ModalLocalidades from './ModalLocalidades.vue';


interface Props {
    categorias: Categoria[],
    tipos: CategoriaTipo[],
    cidades: Cidade[],
    bairros: Bairro[]
}

const props = defineProps<Props>()

const show_drawer = ref<boolean>(false)

const categorias_map = computed(() => {
    const records: Map<string, Categoria> = new Map();
    for (let categoria of props.categorias) {
        records.set(categoria.slug, categoria);
    }
    return records
})

const toggleDrawer = () => [
    show_drawer.value = !show_drawer.value
]

const finalidades = ref<string[]>([finalidade_query.value])
watch(finalidades, (value, old_value) => {
    if (value.length === 0) {
        finalidades.value = [...old_value]
        return
    }
    let [v] = value.filter(v => !old_value.includes(v))
    if (v) {

        
        finalidades.value = [v]
    }
})

const finalidade = computed(() => {
    let [finalidade] = finalidades.value
    return finalidade
})

const categorias_selecionadas = ref<string[]>([...new Set(tipos_query.value || [])])
const bairros_selecionados = ref<string[]>(bairros_query.value || [])
const cidade_selecionada = ref<string>(cidade_query.value)
const dormitorios_selecionados = ref<string[]>([`${dormitorios.value}`])
const suites_selecionadas = ref<string[]>([`${suites.value}`])
const vagas_selecionadas = ref<string[]>([`${vagas.value}`])

const valor_de = ref<string>(valor_de_query.value !== 0 ? `${valor_de_query.value}`.replace(/\D+/igm, '') : '')
const valor_ate = ref<string>(valor_ate_query.value !== 0 ? `${valor_ate_query.value}`.replace(/\D+/igm, '') : '')

const codigos = ref<string>(codigos_query.value.join(', '))

const ValorDe = computed(() => {
    return valor_de.value.replace(/\D+/igm, '')
})

const ValorAte = computed(() => {
    return valor_ate.value.replace(/\D+/igm, '')
})

const DormitoriosSelecionados = computed(() => {
    if (dormitorios_selecionados.value.length === 0) {
        return 0
    }
    let [v] = dormitorios_selecionados.value
    return Number(v)
})

const SuitesSelecionadas = computed(() => {
    if (suites_selecionadas.value.length === 0) {
        return 0
    }
    let [v] = suites_selecionadas.value
    return Number(v)
})

const VagasSelecionadas = computed(() => {
    if (vagas_selecionadas.value.length === 0) {
        return 0
    }
    let [v] = vagas_selecionadas.value
    return Number(v)
})

const CidadeSelecionada = computed(() => {
    return props.cidades.find(cidade => cidade.slug === cidade_selecionada.value) || null
})

const url_modal_localidades = computed(() => {
    const url = new URL(location.href)
    url.hash = 'dialog-localidades'
    return url.toString()
})

const updateBairrosSelecionados = (bairros: string[]) => {
    bairros_selecionados.value = [...new Set(bairros)]
}

watch(dormitorios_selecionados, () => {
    let values = [...dormitorios_selecionados.value].map(item => Number(item))
    if (values.length > 1) {
        values.reverse()
        let [v] = values
        dormitorios_selecionados.value = [`${v}`]
    }

})

watch(suites_selecionadas, () => {
    let values = [...suites_selecionadas.value].map(item => Number(item))
    if (values.length > 1) {
        values.reverse()
        let [v] = values
        suites_selecionadas.value = [`${v}`]
    }

})

watch(vagas_selecionadas, () => {
    let values = [...vagas_selecionadas.value].map(item => Number(item))
    if (values.length > 1) {
        values.reverse()
        let [v] = values
        vagas_selecionadas.value = [`${v}`]
    }

})

watch(valor_de, () => {
    let valor: number | string = `${valor_de.value}`.replace(/\D+/igm, '')
    if (valor === '') {
        valor_de.value = ''
        return
    }
    valor = Number(valor)
    if (0 === valor) {
        valor_de.value = ''
        return
    }
    valor = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
    valor_de.value = valor
})

watch(valor_ate, () => {
    let valor: number | string = `${valor_ate.value}`.replace(/\D+/igm, '')
    if (valor === '') {
        valor_ate.value = ''
        return
    }
    valor = Number(valor)
    if (0 === valor) {
        valor_ate.value = ''
        return
    }
    valor = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
    valor_ate.value = valor
})


</script>
<style lang="less">
.drawer {
    z-index: 99999;
    position: fixed;
    top: 0;
    left: 0;
    width: 400px;
    max-width: 100%;
    height: 100vh;
    background-color: #000c39;

    .drawer-content {
        padding-left: 1em;
        padding-right: 1em;
        position: absolute;
        background-color: white;
        width: 100%;
        height: 100%;
        overflow-y: scroll;

        h3 {
            display: flex;
            justify-content: space-between;

            .btn-close {
                background-color: transparent;
                border: none;
                padding: 0.5em 0.75em;
                cursor: pointer;
            }

            margin: 0.5rem 0;
        }

        ul {
            list-style: none;
            margin: 0;
            padding: 0;

            li {
                border-top: 1px solid rgba(0, 0, 0, 0.15);
                padding: 0.5rem 0;
                font-size: 0.75rem;

                select {
                    width: 100%;
                    padding: 0.5em;
                    border-radius: 0.5em;
                    background-color: white;
                    margin-top: 0.5em;
                }

                .dormitorios {
                    display: flex;
                    justify-content: space-between;
                }

                .vagas {
                    display: flex;

                    .pill {
                        width: 100%;
                        text-align: center;
                    }
                }

                .valores {
                    display: flex;
                    gap: 1em;

                    input {
                        width: 50%;
                        padding: 0.5em 1em;
                        border-radius: 0.5em;
                    }
                }
                .codigos {
                    input {
                        width: 100%;
                        padding: 0.5em 0em;
                        //border-radius: 0.5em;
                        border: none;
                        margin-top: 1em;
                        outline: none;
                    }
                }
            }
        }
    }

    &::before {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .buttons {
        display: flex;
        justify-content: space-between;
        gap: 1em;
        padding: 1em 0;

        button {
            padding: 1em;
            cursor: pointer;
        }

        button[type=submit] {
            background-color: #000c39;
            color: white;
            border-radius: 0.35em;
            width: 100%;
        }

        button[type=button] {
            background-color: transparent;
            border: none;
            font-weight: bold;
        }
    }

    .backdrop {
        position: fixed;        
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
}
.btn-mais-filtros {
    color: white;
    border: 0;
    background-color: #000c39;
    padding: 1em 2em;
    border-radius: 0.75em;
    margin-bottom: 2em;
    display: flex;
    gap: 1em;
    cursor: pointer;
}
</style>