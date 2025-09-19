import React from "react";
import { ModeToggle } from "../mode-toggle";
import MainHeader from "../Header";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      {/* Logo / Brand */}
      <div className="text-xl font-bold text-purple-700">Waansan RealState</div>

      {/* Right side: Mode toggle and links/header */}
      <div className="flex items-center space-x-4">
        <ModeToggle />
        <MainHeader />
      </div>
    </nav>
  );
};

export default Navbar;
