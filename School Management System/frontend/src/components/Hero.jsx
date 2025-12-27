import { useEffect, useState } from "react";
import "./Hero.css";

const slides = [
  {
    image: "/hero1.png",
    align: "left", 
    title: (
      <>
        School / College <br />
        Management System
      </>
    ),
    subtitle: (
      <>
        Student Management | Attendance | Results <br />
        Teachers | Library | Online Payments
      </>
    ),
  },
  {
    image: "/hero2.png",
    align: "right",
    title: "Explore our digital Tools and Resources",
    subtitle:
      "We provide all the tools to save you time and money, and help you manage your school efficiently.",
  },
  {
    image: "/hero3.png",
    align: "left",
    title: "Single place for every requirement for school",
    subtitle: "You will get everything to make a school digital here",
  },
];

function Hero() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // animate content on slide change (schedule state updates to avoid synchronous setState in effect)
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(false), 0);
    const t2 = setTimeout(() => setVisible(true), 120);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [index]);

  const slide = slides[index];

  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${slide.image})` }}
    >
      <div
        className={`hero-content ${visible ? "show" : ""} ${
          slide.align === "right" ? "align-right" : "align-left"
        }`}
        key={index}
      >
        <h1>{slide.title}</h1>

        <p>{slide.subtitle}</p>

        <div className="hero-buttons">
          <button className="primary-btn">Learn More</button>
          <button className="secondary-btn">Contact Us</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
