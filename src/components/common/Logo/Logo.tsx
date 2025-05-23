import React from "react";
import logo from "../../../assets/images/logo-no-bg.png";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-auto" }) => {
  return <img src={logo} alt="Logo" className={className} />;
};

export default Logo;
