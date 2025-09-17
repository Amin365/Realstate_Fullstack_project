import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "../../components/Auth/Login";
import { SiteHeader } from "../../components/site-header";
import { ModeToggle } from "../../components/mode-toggle";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* LEFT SIDE  */}
      <div className="bg-rose-700 text-white relative hidden lg:flex flex-col justify-center p-10">
        <div className="max-w-md mx-auto space-y-8">
          {/* Logo / Branding */}
          <div className="flex items-center gap-3">
            <div className="bg-white text-red-700 flex size-10 items-center justify-center rounded-md font-bold">
              <GalleryVerticalEnd className="size-6" />
            </div>
            <span className="text-2xl font-bold">Waansan Real State</span>
          </div>

          {/* Tagline */}
          <h2 className="text-3xl font-bold leading-tight">
            Revolutionizing Home Rentals  
          </h2>

          {/* Features */}
          <div className="grid grid-cols-2 gap-6">
            <div className="w-full bg-rose-600 rounded-lg p-4 shadow  hover:scale-105 transition-transform hover:border hover:border-amber-50">
            
              <h3 className="font-semibold">Smart Listings</h3>
              <p className="text-sm text-red-100">
                Real-time property updates with advanced search filters.
              </p>
            </div>

            <div className="bg-rose-600 rounded-lg p-4 shadow w-full  hover:scale-105 transition-transform hover:border hover:border-amber-50">
              <h3 className="font-semibold">Tenant Management</h3>
              <p className="text-sm text-red-100">
                Comprehensive tenant profiles and rental history tracking.
              </p>
            </div>

            <div className="bg-rose-600 rounded-lg p-4 shadow  hover:scale-105 transition-transform hover:border hover:border-amber-50">
              <h3 className="font-semibold">Secure Payments</h3>
              <p className="text-sm text-red-100">
                Safe and transparent rent collection and payment tracking.
              </p>
            </div>

            <div className="bg-rose-600 rounded-lg p-4 shadow-lg  hover:scale-105 transition-transform hover:border hover:border-amber-50">
              <h3 className="font-semibold">Grow Your Business</h3>
              <p className="text-sm text-red-100">
                Optimize operations to reach more tenants and landlords.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-6">
          <div className="text-sm text-white bg-red-500 shadow-md rounded-md inline px-3 py-1 border border-white/50 hover:scale-105 transition-transform">
            Trusted by 500+ landlords
          </div>
          <div className="text-sm text-white bg-red-500 shadow-md rounded-md inline px-3 py-1 border border-white/50 hover:scale-105 transition-transform">
            • 99.9% uptime
          </div>
           
          </div>
          
        </div>
      </div>

      {/* RIGHT SIDE (Login Form) */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex  justify-between  gap-2  items-center">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
          Waansan Real State
          </a>
          <div className="border-2 rounded-lg">
     <ModeToggle/>
          </div>
         
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
            
            

          </div>
        </div>
      </div>
    </div>
  );
}
