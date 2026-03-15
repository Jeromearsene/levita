<template>
  <div ref="containerRef">
    <div class="card">
      <img data-levita-offset="0" src="album.jpg" />
      <div data-levita-offset="15"><!-- Gradient overlay --></div>
      <p data-levita-offset="35">Artist Name</p>
    </div>
    <!-- More cards... -->
  </div>
</template>

<script setup>
import Levita from "levita-js";
import { onMounted, onUnmounted, ref } from "vue";

const containerRef = ref(null);
const instances = [];

onMounted(() => {
  const cards = containerRef.value.querySelectorAll(".card");
  for (const card of cards) {
    instances.push(
      new Levita(card, {
        eventsEl: containerRef.value,
        glare: true,
        shadow: true,
        max: 25,
      })
    );
  }
});

onUnmounted(() => instances.forEach((i) => i.destroy()));
</script>
