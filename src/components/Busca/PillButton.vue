<template>
    <label class="pill">
        <slot></slot>
        <input type="checkbox" :value="value" v-model="selecao" >
    </label>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';


interface Props {
    value: string | number,
    modelValue: (string | number)[]
}

const props = defineProps<Props>()
const emits = defineEmits<{
    (e: 'update:modelValue', value: (string | number)[]): void
}>()

const selecao = ref<(string | number)[]>([...new Set(props.modelValue)])


watch(selecao, () => {
    
 
    emits('update:modelValue', [...new Set(selecao.value)])
})

watch(() => props.modelValue, () => {
    if (JSON.stringify(props.modelValue) != JSON.stringify(selecao.value)) {
        selecao.value = [...new Set(props.modelValue)]

    }
})

</script>
<style lang="less">
.pill {
    display: inline-block;
    border: 1px solid #000c39;
    margin-right: 4px;
    margin-bottom: 5px;
    color: #000c39;
    border-radius: 0.5em;
    padding: 0.25em 0.5em;
    cursor: pointer;
    font-weight: 500;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &:has(:checked) {
        background-color: #000c39;
        color: white;
    }

    input[type=checkbox] {
        display: none;
    }
}
</style>