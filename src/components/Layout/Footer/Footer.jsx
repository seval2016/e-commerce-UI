import React from "react";
import Policy from "../Policy/Policy";

const Footer = () => {
  return (
    <React.Fragment>
      <Policy />
      <footer className="bg-gray-900 text-white">
        {/* Subscribe Row */}
        <div className="py-12 border-b border-gray-800">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Subscribe Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-3">
                    Get our emails for info on new items, sales and more.
                  </h3>
                  <p className="text-gray-300 text-base">
                    We'll email you a voucher worth $10 off your first order over $50.
                  </p>
                </div>
                <div className="space-y-3">
                  <form className="flex gap-3 max-w-md">
                    <input
                      type="email"
                      placeholder="Enter your email address."
                      className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
                    />
                    <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors duration-200 text-sm whitespace-nowrap">
                      Subscribe
                    </button>
                  </form>
                  <p className="text-xs text-gray-400">
                    By subscribing you agree to our{" "}
                    <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                      Terms & Conditions and Privacy & Cookies Policy.
                    </a>
                  </p>
                </div>
              </div>

              {/* Contact Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-3">
                    Need help? <br />
                    (+90) 123 456 78 90
                  </h3>
                  <p className="text-gray-300 text-sm">
                    We are available 8:00am – 7:00pm
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <a href="#" className="block">
                      <img src="/img/footer/app-store.png" alt="App Store" className="h-10" />
                    </a>
                    <a href="#" className="block">
                      <img src="/img/footer/google-play.png" alt="Google Play" className="h-10" />
                    </a>
                  </div>
                  <p className="text-xs text-gray-400">
                    <strong>Shopping App:</strong> Try our View in Your Room
                    feature, manage registries and save payment info.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Widgets Row */}
        <div className="py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Brand Info */}
              <div className="lg:col-span-1 space-y-4">
                <div>
                  <a href="/" className="text-xl font-bold">
                    LOGO
                  </a>
                </div>
                <div>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Quis ipsum suspendisse ultrices gravida. Risus commodo
                    viverra maecenas accumsan lacus vel facilisis in termapol.
                  </p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">
                    <a href="tel:555 555 55 55" className="text-blue-400 hover:text-blue-300">(+800) 1234 5678 90</a> –{" "}
                    <a href="mailto:info@example.com" className="text-blue-400 hover:text-blue-300">info@example.com</a>
                  </p>
                </div>
              </div>

              {/* Information */}
              <div className="space-y-3">
                <h4 className="text-base font-semibold">Information</h4>
                <ul className="space-y-1">
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">About Us</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Returns Policy</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Shipping Policy</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Dropshipping</a></li>
                </ul>
              </div>

              {/* Account */}
              <div className="space-y-3">
                <h4 className="text-base font-semibold">Account</h4>
                <ul className="space-y-1">
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Dashboard</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">My Orders</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">My Wishlist</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Account details</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Track My Orders</a></li>
                </ul>
              </div>

              {/* Shop */}
              <div className="space-y-3">
                <h4 className="text-base font-semibold">Shop</h4>
                <ul className="space-y-1">
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Affiliate</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Bestsellers</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Discount</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Latest Products</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Sale Products</a></li>
                </ul>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <h4 className="text-base font-semibold">Categories</h4>
                <ul className="space-y-1">
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Women</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Men</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Bags</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Outerwear</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Shoes</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Row */}
        <div className="py-6 border-t border-gray-800">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
              <div className="text-gray-400 text-xs">
                <p>
                  Copyright 2022 © E-Commerce Theme. All right reserved. Powered
                  by Emin Basbayan.
                </p>
              </div>
              <a href="#" className="block">
                <img src="/img/footer/cards.png" alt="Payment Methods" className="h-6" />
              </a>
              <div>
                <ul className="flex flex-wrap gap-4 text-xs">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms and Conditions</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Returns Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default Footer;