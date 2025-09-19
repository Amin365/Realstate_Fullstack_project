

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-b from-rose-100 to-white h-100 py-16">
      <div className="max-w-7xl mx-auto  gap-10 items-center px-6">
        {/* Left */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Buy, rent, or sell your property easily
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            A great platform to buy, sell, or even rent your properties without any
            commissions.
          </p>
            <button className="px-6 text-xl py-2 bg-rose-600 text-white rounded-lg">
            Browse Properties
          </button>
        </div>

        {/* Right */}
       
      </div>
    </section>

    
  );
};

export default Hero;
