import { computed, ref, watch } from "vue"

export const cidade = ref<string>('')
export const tipos = ref<string[]>([])
export const bairros = ref<string[]>([])
export const finalidade = ref<string>('')
export const codigos = ref<string[]>([])
export const valor_de = ref<number>(0.0)
export const valor_ate = ref<number>(0.0)
export const dormitorios = ref<number>(0)
export const suites = ref<number>(0)
export const vagas = ref<number>(0)
export const condominio = ref<string>('')

const parse = () => {
    const url = new URL(window.location.href)
    cidade.value = url.searchParams.get('cidade') || 'porto-alegre-rs'
    condominio.value = url.searchParams.get('condominio') || ''
    tipos.value = url.searchParams.getAll('categorias[]') || []
    bairros.value = url.searchParams.getAll('bairro[]') || []
    finalidade.value = url.searchParams.get('finalidade') || ''

    codigos.value = (url.searchParams.get('codigo') || '').replace(/[,\t]+/igm, " ").split(/\s+/igm).map(t => t.trim()).filter(t => t !== '') || []
    
    valor_de.value = Number(url.searchParams.get('valor_de')?.replace(/\D+/igm, '') || '0') || 0
    valor_ate.value = Number(url.searchParams.get('valor_ate')?.replace(/\D+/igm, '') || '0') || 0
    dormitorios.value = Number(url.searchParams.get('dormitorios') || '0') || 0
    suites.value = Number(url.searchParams.get('suites') || '0') || 0
    vagas.value = Number(url.searchParams.get('vagas') || '0') || 0
}
parse()

export const url = computed(() => {

    const url = new URL(`${location.origin}${location.pathname}`)
    url.pathname = '/busca'

    url.searchParams.set('cidade', cidade.value)

    for (let tipo of tipos.value) {
        url.searchParams.append('categorias[]', tipo)
    }
    for (let bairro of bairros.value) {
        url.searchParams.append('bairro[]', bairro)
    }
    if (finalidade.value !== '') {
        url.searchParams.set('finalidade', finalidade.value)
    }
    if (condominio.value !== '') {
        url.searchParams.set('condominio', condominio.value)
    }
    url.searchParams.set('codigo', codigos.value.join(','))
    url.searchParams.set('valor_de', `${valor_de.value.toFixed(0)}`)
    url.searchParams.set('valor_ate', `${valor_ate.value.toFixed(0)}`)
    url.searchParams.set('dormitorios', `${dormitorios.value.toFixed(0)}`)
    url.searchParams.set('suites', `${suites.value.toFixed(0)}`)
    url.searchParams.set('vagas', `${vagas.value.toFixed(0)}`)
    return url.toString()
})

watch(url, () => {    
    history.pushState({}, '', url.value)
})