import { Route, Routes } from "react-router"
import LoginPage from "./pages/Auth/LoginPage"
import Dashboard from "./pages/Dashboard/Dashboard"
import RegsiterPage from "./pages/Auth/RegisterPage"






function App() {
 

  return (
    <div>
      <Routes>

      <Route path="/login" element={<LoginPage/>}/>

      <Route path="/register" element={<RegsiterPage/>}/>
     {/* Dashboard */}
     <Route path='/dashboard' element={<Dashboard/>}/>
      

      </Routes>
    </div>
  )
}

export default App

