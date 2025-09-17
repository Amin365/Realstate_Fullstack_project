import { Routes, Route } from "react-router-dom";
import Properties from "./pages/Dashboard/Properties";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import LoginPage from "./pages/Auth/LoginPage";
import RegsiterPage from "./pages/Auth/RegisterPage";
import HomePage from "./pages/HomePage";


export default function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      {/* <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} /> */}
      <Route path="/login" element={<LoginPage/> }  />
      <Route path="register" element={<RegsiterPage/>} />
      <Route path="/" element={<HomePage/>} />

      {/* Dashboard Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path="properties" element={<Properties />} />
      </Route>
    </Routes>
  );
}
