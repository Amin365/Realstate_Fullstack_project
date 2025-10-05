import { Routes, Route } from "react-router-dom";
import Properties from "./pages/Dashboard/Properties";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import LoginPage from "./pages/Auth/LoginPage";
import RegsiterPage from "./pages/Auth/RegisterPage";
import HomePage from "./pages/HomePage";
import PropertiesDetals from "./components/properties/PropertDetails";
import PropertyDetailPage from "./components/properties/PropertyDetailPage";
import PropertyCard from "./components/LandPage/PropertiesCrad";
import ProtectedAdmin from "./pages/Protectedadmin";
import ProfilePage from "./pages/profilePage";
import Tenants from "./pages/Tenants";



export default function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      {/* <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} /> */}
      <Route path="/login" element={<LoginPage/> }  />
      <Route path="/register" element={<RegsiterPage/>} />
      <Route path="/" element={<HomePage/>} />
      <Route path='/propertydetails' element={<PropertiesDetals/>}/>
       <Route path="/propertydetails/:id" element={ <ProtectedRoute>  <PropertyDetailPage /> </ProtectedRoute>} />
       <Route path='/profile' element={<ProfilePage />} />

       <Route path="/propertydetails/:id" element={<ProtectedRoute> <PropertyCard /> </ProtectedRoute>} />
       

      {/* Dashboard Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedAdmin requiredRole="admin">
            <Dashboard />
          </ProtectedAdmin>
        }
      >
        <Route path="properties" element={<Properties />} />
        <Route path="tenants" element={<Tenants/>}/>
      </Route>
    </Routes>
  );
}
