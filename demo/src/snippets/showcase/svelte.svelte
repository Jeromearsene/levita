<script>
  import { tilt } from "levita-svelte";
</script>

<div use:tilt={{ shadow: true }}>
  <img data-levita-offset="0" src="product.jpg" />
  <div data-levita-offset="50">
    <span>New</span>
    <p>€129</p>
  </div>
</div>
