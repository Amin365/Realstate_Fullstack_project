
import { LifeBuoy } from "lucide-react";
import { FiHome, FiShield, FiDollarSign, FiTrendingUp, FiSettings } from "react-icons/fi";

const Features = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
          Why Choose Us?
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gradient-to-b from-rose-100 to-white p-6 rounded-lg shadow-md w-full flex flex-col items-center">
            <FiHome className="text-purple-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-center">
              The New Way to Find Your Dream Home
            </h3>
            <p className="text-gray-600 text-center">
              Find your perfect property with ease using our intuitive search and filter options.
            </p>
           
          </div>

          {/* Feature 2: Nested Grid */}
          
            <div className="bg-gradient-to-b from-rose-100 to-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <FiShield className="text-purple-600 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-center">Property Insurance</h3>
              <p className="text-gray-600 text-center">
                We offer comprehensive property insurance options to protect your investments and provide peace of mind.
              </p>
            </div>

            <div className="bg-gradient-to-b from-rose-100 to-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <FiDollarSign className="text-purple-600 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-center">Best Price</h3>
              <p className="text-gray-600 text-center">
                We guarantee the best prices for our properties, ensuring you get the best value for your investment.
              </p>
            </div>

            <div className="bg-gradient-to-b from-rose-100 to-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <FiTrendingUp className="text-purple-600 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-center">Lowest Commission</h3>
              <p className="text-gray-600 text-center">
                Our platform offers the lowest commission rates in the industry, maximizing your returns when buying or selling properties.
              </p>
            </div>

            <div className="bg-gradient-to-b from-rose-100 to-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <FiSettings className="text-purple-600 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-center">Overall Control</h3>
              <p className="text-gray-600 text-center">
                We provide you with overall control of your property listings and transactions, ensuring a seamless and transparent experience.
              </p>
            </div>
            <div className="bg-gradient-to-b from-rose-100 to-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <LifeBuoy className="text-purple-600 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-center">24/7 Customer Support</h3>
              <p className="text-gray-600 text-center">
                Our dedicated support team is available 24/7 to assist you with any inquiries or issues you may have.
              </p>
            </div>
          </div>
        </div>
     
    </section>
  );
};

export default Features;
