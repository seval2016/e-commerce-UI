import { useState } from "react";
import SliderItem from "./SliderItem";
import { sliders } from "../../data";

const Sliders = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % sliders.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + sliders.length) % sliders.length);
  };

  return (
    <section className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden">
      <div className="relative w-full h-full">
        {sliders.map((slider, index) =>
          currentSlide === index && (
            <SliderItem key={index} slider={slider} />
          )
        )}

        {/* Slider Buttons */}
        <div className="absolute top-1/2 left-4 right-4 flex justify-between items-center z-0">
          <button 
            onClick={prevSlide}
            className="w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
          >
            <i className="bi bi-chevron-left text-gray-800 text-xl"></i>
          </button>
          <button 
            onClick={nextSlide}
            className="w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
          >
            <i className="bi bi-chevron-right text-gray-800 text-xl"></i>
          </button>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-0">
          {sliders.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                currentSlide === index 
                  ? "bg-white scale-125" 
                  : "bg-white/50 hover:bg-white/80"
              }`}
              onClick={() => setCurrentSlide(index)}
            >
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sliders;
