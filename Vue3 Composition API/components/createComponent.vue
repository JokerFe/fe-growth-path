<template>
    <div></div>
</template>

<script>
import { createComponent } from "@vue/composition-api";
export default createComponent({
    props: {
        foo: String
    },
    setup(props) {
        console.warn(typeof props.foo);
    }
});
</script>