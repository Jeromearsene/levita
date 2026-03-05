<script>
// biome-ignore lint/correctness/noUnusedImports: used in template as Svelte action
import { tilt } from "@levita-js/svelte";
import "levita-js/style.css";
</script>

<div class="container">
  <div use:tilt={{ glare: true, maxGlare: 0.5, shadow: true }} class="card">
    Svelte
  </div>
</div>

<style>
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
    background: linear-gradient(135deg, #ff3e00 0%, #ffbe00 100%);
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
