<template>
    <dialog class="dialog-modal" :id="id">
        <a class="backdrop" :href="close_url"></a>
        <div class="dialog-content">
            <div class="dialog-body raleway">
                <slot></slot>
            </div>
            <div class="dialog-footer">
                <slot name="footer"></slot>
            </div>
        </div>
    </dialog>
</template>
<script setup lang="ts">
import { computed } from 'vue';


interface Props {
    id: string
}

const props = defineProps<Props>()
const close_url = computed(() => {
    const url = new URL(location.href)
    url.hash = 'none';
    return url.toString()
})

</script>
<style lang="less">
dialog.dialog-modal {
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    border: 0;
    margin: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;

    .backdrop {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }

    .dialog-content {
        position: relative;
        background-color: white;
        width: auto;
        min-width: 22em;
        max-height: 80vh;

        max-width: 90vw;
        border-radius: 1em;
        display: grid;
        grid-template-rows: 1fr 3em;
        overflow: hidden;

        @media (max-width: 25em) {}
    }

    .dialog-body {
        padding: 1.5em;
        overflow-y: auto;
    }

    .dialog-footer {
        padding: 1em;
        background-color: #efefef;
        border-bottom-left-radius: 1em;
        border-bottom-right-radius: 1em;
        display: flex;
        justify-content: space-between;

        div {
            width: 100%;
            text-align: center;

            &:first-child {
                text-align: left;
            }

            a[role="button"] {
                padding: 0.5em 1em;
                text-transform: uppercase;
                font-weight: 700;
                border-radius: 0.4em;
                padding: 0.75em 2.5em;
                font-size: 0.75em;
                color: #959595;

                text-align: center;

                &.btn-primary {
                    font-size: 0.85em;
                    background-color: #041335;
                    color: white;
                    font-weight: 500;
                    flex-grow: 0;
                }
            }
        }
    }

    &:not(:target):not([open]) {
        display: none;
    }
}
</style>