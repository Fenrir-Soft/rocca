<template>
    <b>
        {{ visualizacoes }}
    </b>
</template>
<script setup lang="ts">
import { ref } from 'vue';


interface Props {
    codigo: string
}

const props = defineProps<Props>()

const visualizacoes = ref<number | ''>('')

const load = async () => {
    try {
        const response = await fetch(`https://www.roccaimob.com.br/imovel/views/${props.codigo}`)
        if (!response.ok) {
            throw new Error("Não foi possível carregar as visualizações")
        }
        const { views }: { views: number } = await response.json()
        visualizacoes.value = views

    } catch (error) {
        visualizacoes.value = 0
    }
}

load()

</script>
<style scoped>
b {
    font-weight: inherit;
}
</style>