<script>
  import { tilt } from "levita-svelte";
</script>

<div use:tilt={{ shadow: true }}>
  <img data-levita-offset="0" src="hero.jpg" />
  <div data-levita-offset="50">
    <p>Explore</p>
    <p>The Alps</p>
  </div>
</div>
