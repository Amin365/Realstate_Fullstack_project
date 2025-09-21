
import CallToAction from "../components/LandPage/Callaction"
import RealEstateFAQs from "../components/LandPage/Faq"
import Features from "../components/LandPage/features"


import HeroSection from "../components/LandPage/HeroSection"
import { HeroHeader } from "../components/LandPage/Navbar"

import PropertiesCard from "../components/LandPage/PropertiesCrad"
import Testimonials from "../components/LandPage/Testomony"



const HomePage =()=>{
    return(

        <div>
             <HeroHeader/>
        
        <div className="min-h-screen bg-gradient-to-b from-rose-100 to-whit">
       


    <HeroSection/>

    <Features/>
   

    <PropertiesCard/>

    <Testimonials/>
    <RealEstateFAQs/>

    <CallToAction/>
           
          
        </div>
        </div>
    )
}

export default HomePage