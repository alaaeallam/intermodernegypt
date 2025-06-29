"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis } from "lenis/react";
import { fetchCards } from "./data";

export default function AnimatedCardGallery() {
  const container = useRef(null);
  const [cardsData, setCardsData] = useState([]);

  const lenis = useLenis(() => {});

  useEffect(() => {
    fetchCards()
      .then((data) => {
        console.log("[Sanity Data Fetched]", data);
        setCardsData(data);
      })
      .catch((err) => {
        console.error("[Error fetching cards]", err);
      });
  }, []);

  useGSAP(() => {
    if (!container.current) {
      console.warn("Container ref is undefined!");
      return;
    }
    if (cardsData.length === 0) {
      console.warn("No cards data yet. Skipping animation.");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const cards = container.current.querySelectorAll(".card");
    const images = container.current.querySelectorAll(".card img");
    const totalCards = cards.length;

    if (totalCards === 0) {
      console.warn("No .card elements found in DOM!");
      return;
    }

    console.log("[GSAP INIT] Cards found:", totalCards);

    gsap.set(cards[0], { y: "0%", scale: 1, rotation: 0 });
    gsap.set(images[0], { scale: 1 });

    for (let i = 1; i < totalCards; i++) {
      gsap.set(cards[i], { y: "100%", scale: 1, rotation: 0 });
      gsap.set(images[i], { scale: 1 });
    }

    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".sticky-cards",
        start: "top top",
        end: `+=${window.innerHeight * (totalCards - 1)}`,
        pin: true,
        scrub: 0.5,
        markers: false,
      },
    });

    for (let i = 0; i < totalCards - 1; i++) {
      scrollTimeline.to(cards[i], {
        scale: 0.5,
        rotation: 10,
        duration: 1,
        ease: "none",
      }, i);

      scrollTimeline.to(images[i], {
        scale: 1.5,
        duration: 1,
        ease: "none",
      }, i);

      scrollTimeline.to(cards[i + 1], {
        y: "0%",
        duration: 1,
        ease: "none",
      }, i);
    }

    return () => {
      scrollTimeline.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, { dependencies: [cardsData], scope: container });

  return (
    <ReactLenis root>
      <div className="container" ref={container}>
        <section className="intro">
          <h1>
            Art is not what you see. It&apos;s what you *feel* in the blur, the
            chaos, the motion — every pulse captured in color and form.
          </h1>
        </section>

        <section className="sticky-cards">
          <div className="cards-container">
            {cardsData.length === 0 && (
              <p className="loading">Loading cards...</p>
            )}
            {cardsData.map((card, i) => (
              <div className="card" key={i}>
                <div className="tag">
                  <p>{card.title}</p>
                </div>
                {card.image?.asset?.url ? (
                  <img
                    src={card.image.asset.url}
                    alt={card.title}
                    onError={(e) => {
                      console.error("[Broken image]", card.image.asset.url);
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <p className="no-images">No image available</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="outro">
          <h1>
            This isn&apos;t just motion. It&apos;s meaning in movement. In every
            blurred edge and amplified hue, we trace the shape of something
            deeper — truth in abstraction.
          </h1>
        </section>
      </div>
    </ReactLenis>
  );
}