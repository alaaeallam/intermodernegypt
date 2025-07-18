"use client";
import { useRevealer } from "@/hooks/useRevealer";
import { useGSAP } from "@gsap/react";

import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ReactLenis from "lenis/react";

gsap.registerPlugin(SplitText);

const Contact = () => {
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
      delay: 1.75,
      ease: "power4.out",
    });
  }, {});

  return (
    <>
      <ReactLenis root>
        <div className="revealer"></div>
        <div className="contact">
          <div className="col">
            <h2>Contact Us</h2>
          </div>
          <div className="col">
            <div className="contact-copy">
              <h2>Phone</h2>
              <h2>02 33363295</h2>
            </div>

            <div className="contact-copy">
              <h2>Email</h2>
              <h2>inter_imc@yahoo.com</h2>
            </div>
            <div className="contact-copy">
              <h2>Address</h2>
              <h2>2 El Fwakeh St. Mohandeseen, Giza, Egypt</h2>
            </div>

            <div className="socials">
              <p>Instagram</p>
              <p>Twitter</p>
              <p>LinkedIn</p>
            </div>
          </div>
        </div>
      </ReactLenis>
    </>
  );
};

export default Contact;
