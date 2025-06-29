"use client";
import { useRevealer } from "@/hooks/useRevealer";
import { useGSAP } from "@gsap/react";

import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ReactLenis from "lenis/react";

gsap.registerPlugin(SplitText);

const Studio = () => {
  useRevealer();

  useGSAP(() => {
    const splitText = SplitText.create("h2", {
      type: "lines",
      linesClass: "line",
      mask: "lines",
    });

    gsap.set(splitText.lines, { y: "110%" });

    gsap.to(splitText.lines, {
      y: "0%",
      duration: 1.5,
      stagger: 0.1,
      delay: 1.5,
      ease: "power4.out",
    });
  }, {});

  return (
    <>
      <ReactLenis root>
        <div className="revealer"></div>
        <div className="studio">
          <div className="col">
            <h2 className="studio-header">Our Story</h2>
          </div>
          <div className="col">
            <h2>
              IMC is a registered company founded in Cairo, operating under trade license number 81917 since 1988. It is also a member of the Union of the Egyptian Contractors, holding license number 2705. Initially established as a general contracting and decorative finishing firm, IMC quickly made a name for itself in the Egyptian construction market, becoming one of the leading players known for timely deliveries and high-quality specifications.
            </h2>

            <div className="about-img">
              <img
                src="/studio.jpg"
                alt="Team at work in Nuvoro's creative space"
              />
            </div>
          </div>
        </div>
      </ReactLenis>
    </>
  );
};

export default Studio;
