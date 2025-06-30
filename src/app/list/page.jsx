"use client";
import ThreeSlider from "@/components/ThreeSlider";
import { useRevealer } from "@/hooks/useRevealer";
import { useGSAP } from "@gsap/react";

import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ReactLenis from "lenis/react";



const List = () => {
  useRevealer();

  return (
    <>
    <div className="revealer"></div>
     <ThreeSlider />
     <section className="outro">
          <h1>
            This isn&apos;t just motion. It&apos;s meaning in movement. In every
            blurred edge and amplified hue, we trace the shape of something
            deeper — truth in abstraction.
          </h1>
        </section>

    </>
  );
};

export default List;
