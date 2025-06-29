"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export default function Cards() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || window.innerWidth <= 1000) return;

    const smoothStep = (p) => p * p * (3 - 2 * p);

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const section = sectionRef.current;

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${window.innerHeight * 4}`,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        const headerY = gsap.utils.interpolate(
          "400%",
          "0%",
          smoothStep(progress / 0.9)
        );
        gsap.set(".animated-cards-header", {
          y: headerY,
        });

        ["#animated-card-1", "#animated-card-2", "#animated-card-3"].forEach(
          (cardId, index) => {
            const p = gsap.utils.clamp(
              0,
              1,
              (progress - index * 0.05) / (0.9 - index * 0.05)
            );

            const inner = document.querySelector(`${cardId} .flip-card-inner`);
            const y =
              p < 0.4
                ? gsap.utils.interpolate("-100%", "50%", smoothStep(p / 0.4))
                : p < 0.6
                ? gsap.utils.interpolate("50%", "0%", smoothStep((p - 0.4) / 0.2))
                : "0%";

            const scale =
              p < 0.4
                ? gsap.utils.interpolate(0.25, 0.75, smoothStep(p / 0.4))
                : p < 0.6
                ? gsap.utils.interpolate(0.75, 1, smoothStep((p - 0.4) / 0.2))
                : 1;

            const opacity = p < 0.2 ? smoothStep(p / 0.2) : 1;

            const x =
              p < 0.6
                ? index === 0
                  ? "100%"
                  : index === 1
                  ? "0%"
                  : "-100%"
                : gsap.utils.interpolate(
                    index === 0 ? "100%" : index === 1 ? "0%" : "-100%",
                    "0%",
                    smoothStep((p - 0.6) / 0.4)
                  );

            const rotate =
              p < 0.6
                ? index === 0
                  ? -5
                  : index === 1
                  ? 0
                  : 5
                : gsap.utils.interpolate(
                    index === 0 ? -5 : index === 1 ? 0 : 5,
                    0,
                    smoothStep((p - 0.6) / 0.4)
                  );

            const rotY = p < 0.6 ? 0 : 180 * smoothStep((p - 0.6) / 0.4);

            gsap.set(cardId, { x, y, rotate, scale, opacity });
            gsap.set(inner, { rotationY: rotY });
          }
        );
      },
    });
  }, []);

  return (
    <section className="animated-cards-section" ref={sectionRef}>
      <div className="animated-cards-header">
        <h1>Stuff I make so you don’t have to</h1>
      </div>

      <div className="animated-cards-container">
        {[
          {
            id: 1,
            title: "Plan",
            items: ["Discovery", "Audit", "User Flow", "Site Map", "Personas", "Strategy"],
          },
          {
            id: 2,
            title: "Design",
            items: ["Wireframes", "UI Kits", "Prototypes", "Visual Style", "Interaction", "Design QA"],
          },
          {
            id: 3,
            title: "Develop",
            items: ["HTML/CSS/JS", "CMS Build", "GSAP Motion", "Responsive", "Optimization", "Launch"],
          },
        ].map(({ id, title, items }) => (
          <div className="animated-card" id={`animated-card-${id}`} key={id}>
            <div className="card-wrapper">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="card-title">
                    <span>{title}</span>
                    <span>0{id}</span>
                  </div>
                  <div className="card-title">
                    <span>0{id}</span>
                    <span>{title}</span>
                  </div>
                </div>
                <div className="flip-card-back">
                  <div className="card-title">
                    <span>{title}</span>
                    <span>0{id}</span>
                  </div>
                  <div className="card-copy">
                    {items.map((text, i) => (
                      <p key={i}>{text}</p>
                    ))}
                  </div>
                  <div className="card-title">
                    <span>0{id}</span>
                    <span>{title}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}