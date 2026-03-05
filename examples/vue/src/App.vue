<script setup lang="ts">
// biome-ignore lint: Used in template
import { Tilt } from "@levita-js/vue";
import "levita-js/style.css";
</script>

<template>
  <div class="container">
    <Tilt glare :max-glare="0.5" shadow>
      <div class="card">Vue</div>
    </Tilt>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: system-ui, sans-serif;
}
.card {
  width: 300px;
  height: 400px;
  background: linear-gradient(135deg, #42d392 0%, #647eff 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
</style>
