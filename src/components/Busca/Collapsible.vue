<template>
    <div class="collapsible">
        <label>
            <input type="checkbox" class="collapsible-toggle" />
            <h5>
                <span>{{ titulo }}</span>

                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor"
                    class="bi bi-chevron-down" viewBox="0 0 16 16">
                    <path fill-rule="evenodd"
                        d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708">
                    </path>
                </svg>

                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor"
                    class="bi bi-chevron-up" viewBox="0 0 16 16">
                    <path fill-rule="evenodd"
                        d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z" />
                </svg>


            </h5>
        </label>
        <div class="collapsible-content">
            <slot></slot>
        </div>

    </div>
</template>
<script setup lang="ts">

interface Props {
    titulo: string
}

const props = defineProps<Props>()

</script>
<style lang="less">
.collapsible {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    h5 {
        margin: 0;
        display: flex;
        justify-content: space-between;
        font-size: 1em;
        cursor: pointer;
    }

    .collapsible-content {
        padding-top: 1em;
        //display: none;
        overflow: hidden;
        max-height: 0;
        transition: max-height ease-in-out 0.5s;
        .title {
            margin-bottom: 4px;
        }
    }

    .collapsible-toggle {
        display: none;
    }

    .bi-chevron-up {
        display: none;
    }

    label:has(.collapsible-toggle:checked) {

        .bi-chevron-down {
            display: none;
        }
        .bi-chevron-up {
            display: block;
        }

        &+.collapsible-content {
            display: block;
            max-height: 500px;
        }
    }
}
</style>