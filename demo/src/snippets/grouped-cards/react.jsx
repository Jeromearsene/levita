import Levita from "levita-js";
import { useEffect, useRef } from "react";

function GroupedCards() {
  const containerRef = useRef(null);

  useEffect(() => {
    const cards = containerRef.current.querySelectorAll(".card");
    const instances = [];

    for (const card of cards) {
      instances.push(
        new Levita(card, {
          eventsEl: containerRef.current,
          glare: true,
          shadow: true,
          max: 25,
        })
      );
    }

    return () => instances.forEach((i) => i.destroy());
  }, []);

  return (
    <div ref={containerRef}>
      <div className="card">
        <img data-levita-offset="0" src="album.jpg" />
        <div data-levita-offset="15">{/* Gradient overlay */}</div>
        <p data-levita-offset="35">Artist Name</p>
      </div>
      {/* More cards... */}
    </div>
  );
}
