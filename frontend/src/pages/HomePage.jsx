import MainHeader from "../components/Header"
import Features from "../components/LandPage/features"
import Hero from "../components/LandPage/Hero"
import Navbar from "../components/LandPage/Navbar"
import PropertiesCard from "../components/LandPage/PropertiesCrad"
import { ModeToggle } from "../components/mode-toggle"
import { SiteHeader } from "../components/site-header"


const HomePage =()=>{
    return(
        <div className="min-h-screen bg-gradient-to-b from-rose-100 to-white">
    <Navbar/>
    <Hero/>

    <Features/>

    <PropertiesCard/>
           
          
        </div>
    )
}

export default HomePage