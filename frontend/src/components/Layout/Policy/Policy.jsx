const Policy = () => {
  return (
     <section className="border border-gray-300 mt-10">
    <div className="container">
      <ul className="flex justify-between flex-wrap py-6">
        <li className="flex items-center gap-2.5">
          <i className="bi bi-truck text-5xl flex"></i>
          <div className="flex flex-col">
            <strong className="font-semibold">FREE DELIVERY</strong>
            <span className="text-xs">From $59.89</span>
          </div>
        </li>
        <li className="flex items-center gap-2.5">
          <i className="bi bi-headset text-5xl flex"></i>
          <div className="flex flex-col">
            <strong className="font-semibold">SUPPORT 24/7</strong>
            <span className="text-xs">Online 24 hours</span>
          </div>
        </li>
        <li className="flex items-center gap-2.5">
          <i className="bi bi-arrow-clockwise text-5xl flex"></i>
          <div className="flex flex-col">
            <strong className="font-semibold"> 30 DAYS RETURN</strong>
            <span className="text-xs">Simply return it within 30 days</span>
          </div>
        </li>
        <li className="flex items-center gap-2.5">
          <i className="bi bi-credit-card text-5xl flex"></i>
          <div className="flex flex-col">
            <strong className="font-semibold"> PAYMENT METHOD</strong>
            <span className="text-xs">Secure Payment</span>
          </div>
        </li>
      </ul>
    </div>
  </section>
  )
}

export default Policy
