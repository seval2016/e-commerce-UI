import React from 'react'
import Badge from '../common/Badge'

const SliderItem = ({slider}) => {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0">
        <img 
          src={slider.image} 
          className="w-full h-full object-cover" 
          alt={slider.title}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
      </div>
      <div className="relative z-10 flex items-center h-full">
        <div className="text-left text-white max-w-2xl ml-8 md:ml-16 lg:ml-24 px-4">
          {/* Badge */}
          <div className="mb-4">
            <Badge variant="glass" size="lg" className="inline-flex items-center">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
              {slider.title}
            </Badge>
          </div>
          
          {/* Main Heading */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            {slider.subtitle}
          </h2>
          
          {/* Description */}
          <p className="text-base md:text-lg mb-6 leading-relaxed text-white/90 max-w-xl">
            {slider.description}
          </p>
          
          {/* CTA Button */}
          <a 
            href={slider.buttonLink} 
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold text-base hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group"
          >
            <span>{slider.buttonText}</span>
            <i className="bi bi-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
          </a>
          
          {/* Additional Info */}
          <div className="mt-6 flex items-center gap-6 text-xs text-white/80">
            <div className="flex items-center gap-2">
              <i className="bi bi-check-circle text-green-400"></i>
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-shield-check text-blue-400"></i>
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SliderItem
