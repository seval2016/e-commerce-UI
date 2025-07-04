import { useState } from "react";
import SliderItem from "./SliderItem";
import "./sliders.css";

const Sliders = () => {
  const sliderImages = [
    "img/slider/slider1.jpg",
    "img/slider/slider2.jpg",
    "img/slider/slider3.jpg",
    "img/slider/slider4.jpg",
    "img/slider/slider5.jpg"
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + sliderImages.length) % sliderImages.length);
  };

  return (
    <section className="slider">
      <div className="slider-elements">
        {sliderImages.map((image, index) =>
          currentSlide === index && (
            <SliderItem key={index} imageSrc={image} />
          )
        )}

        <div className="slider-buttons">
          <button onClick={prevSlide}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button onClick={nextSlide}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>

        <div className="slider-dots">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${currentSlide === index ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            >
              <span></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sliders;
