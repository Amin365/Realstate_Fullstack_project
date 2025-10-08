import React from "react";
import { ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api/CleintApi";

export default function HeroSection() {
  const { data: properties = [] } = useQuery({
    queryKey: ["property"],
    queryFn: async () => (await api.get("/properties")).data,
  });

  const vacant = properties.filter((p) => p.status === "available").length;

  return (
    <main className="overflow-hidden">
      <section>
        <div className="relative pt-24 md:pt-36">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
          />

          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
              {/* Vacant or Urgent Alert */}
              <Link
                to="/propertydetails"
                className={`group mx-auto flex w-fit items-center gap-4 rounded-full border p-2 pl-4 shadow-md transition-all duration-300 
                ${
                  vacant > 0
                    ? "border-green-500 bg-green-50 hover:bg-green-100"
                    : "border-red-600 bg-red-50 hover:bg-red-100 animate-pulse"
                }`}
              >
                {vacant > 0 ? (
                  <>
                    <CheckCircle className="size-5 text-green-600" />
                    <span className="font-medium text-green-700">
                      {vacant} Properties Available
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="size-5 text-red-600" />
                    <span className="font-medium text-red-700 text-sm md:text-xl">
                      ⚠️ All Properties are Rented — Visit an Other Time!
                    </span>
                  </>
                )}

                <span className="dark:border-background block h-4 w-0.5 border-l bg-gray-300"></span>
                <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                  <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                    <span className="flex size-6">
                      <ArrowRight className="m-auto size-3" />
                    </span>
                    <span className="flex size-6">
                      <ArrowRight className="m-auto size-3" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Title */}
              <h1 className="mx-auto mt-8 max-w-4xl text-balance text-4xl max-md:font-semibold md:text-5xl lg:mt-16 xl:text-[5rem]">
              Buy, rent, or sell your property easily with{" "}
              <span className="text-blue-600 font-bold">Waansan Real Estate</span>
            </h1>

              {/* Subtitle */}
              <p className="mx-auto mt-8 max-w-2xl text-balance text-lg">
                A great platform to buy, sell, or even rent your properties
                without any commissions.
              </p>

              {/* Buttons */}
              <div className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                <Link
                  to="/propertydetails"
                     className="bg-black text-white flex items-center gap-3 rounded-full px-6 py-3 shadow-md hover:bg-gray-900 transition-all"
                >
                  <span className="text-sm text-white">
                    Browse Your Properties
                  </span>
                  <span className="block h-4 w-0.5 border-l bg-white"></span>
                  <div className="size-6 overflow-hidden rounded-full duration-500">
                    <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-3" />
                      </span>
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
