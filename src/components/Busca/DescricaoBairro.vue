<template>
    <div>
        <h5 class="">Comprar Imóvel Residencial em Jardim Europa, Porto Alegre, RS</h5>
    </div>
</template>
<script setup lang="ts">
import type { Bairro } from '../../api/bairros';


interface Props {
    bairros: Bairro[]
}

</script>
<style lang="less" scoped>
    h5 {
        font-weight: bold;
    }
</style>