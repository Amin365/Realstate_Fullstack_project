import MainHeader from "../components/Header"
import { ModeToggle } from "../components/mode-toggle"
import { SiteHeader } from "../components/site-header"


const HomePage =()=>{
    return(
        <div>
            Home page

            <ModeToggle/>

            <MainHeader/>
          
        </div>
    )
}

export default HomePage