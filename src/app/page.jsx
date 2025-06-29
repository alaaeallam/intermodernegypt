"use client";

import Stats from "@/components/Stats";
import { useRevealer } from "@/hooks/useRevealer";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export default function Home() {
  useRevealer();

  useGSAP(() => {
    const splitText = SplitText.create("h1", {
      type: "chars",
      charsClass: "letter",
      mask: "chars",
    });

    gsap.set(splitText.chars, { y: "110%" });
    gsap.to(splitText.chars, {
      y: "0%",
      duration: 1.5,
      stagger: 0.1,
      delay: 1.25,
      ease: "power4.out",
    });
  }, []);

  return (
    <>
      <div className="revealer"></div>
      <div className="home">
        <div className="header">
          <h1>
            <span className="imc-i">i</span>
            <span className="imc-mc">mc</span>
          </h1>
          <Stats />
        </div>
        <div className="hero-img">
          <img src="/logo.webp" alt="IMC Logo" />
        </div>
        
      </div>
      
    </>
  );
}