<script>
  import Levita from "levita-js";
  import { onMount } from "svelte";

  let container;
  const instances = [];

  onMount(() => {
    const cards = container.querySelectorAll(".card");
    for (const card of cards) {
      instances.push(
        new Levita(card, {
          eventsEl: container,
          glare: true,
          shadow: true,
          max: 25,
        })
      );
    }

    return () => instances.forEach((i) => i.destroy());
  });
</script>

<div bind:this={container}>
  <div class="card">
    <img data-levita-offset="0" src="album.jpg" />
    <div data-levita-offset="15"><!-- Gradient overlay --></div>
    <p data-levita-offset="35">Artist Name</p>
  </div>
  <!-- More cards... -->
</div>
