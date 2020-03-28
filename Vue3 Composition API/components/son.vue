<template>
    <div>{{data}}</div>
</template>

<script>
import { inject } from "@vue/composition-api";
export default {
    setup() {
        const data = inject("father");
        return {
            data
        };
    }
};
</script>