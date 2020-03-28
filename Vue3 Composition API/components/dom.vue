<template>
    <div ref="divRef">页面dom</div>
</template>
<script>
import { ref, onMounted } from "@vue/composition-api";
export default {
    setup() {
        const divRef = ref(null);

        onMounted(() => {
            divRef.value.style.color = "blue";
        });

        return {
            divRef
        };
    }
};
</script>