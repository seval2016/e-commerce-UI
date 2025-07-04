import React from 'react'

const SliderItem = ({slider}) => {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0">
        <img 
          src={slider.image} 
          className="w-full h-full object-cover" 
          alt={slider.title}
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      <div className="relative z-0 flex items-center justify-center h-full">
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <p className="text-lg md:text-xl font-medium mb-4 tracking-wider">
            {slider.title}
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            {slider.subtitle}
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            {slider.description}
          </p>
          <a 
            href={slider.buttonLink} 
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105"
          >
            {slider.buttonText}
            <i className="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  )
}

export default SliderItem
