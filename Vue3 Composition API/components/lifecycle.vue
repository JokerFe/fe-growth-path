<template>
    <div></div>
</template>
<script>
import {
    onBeforeMount,
    onMounted,
    onBeforeUnmount
} from "@vue/composition-api";
export default {
    setup() {
        onBeforeMount(() => {
            console.log("onBeforeMount");
        });
        onMounted(() => {
            console.log("onMounted");
        });
        onBeforeUnmount(() => {
            console.log("onBeforeUnmount");
        });
    }
};
</script>