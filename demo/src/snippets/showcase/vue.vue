<template>
  <Tilt shadow activeOffset="12">
    <img data-levita-offset="0" data-levita-active src="product.jpg" />
    <div data-levita-offset="50">
      <span>New</span>
      <p>€129</p>
    </div>
  </Tilt>
</template>

<script setup>
import { Tilt } from "levita-vue";
</script>
