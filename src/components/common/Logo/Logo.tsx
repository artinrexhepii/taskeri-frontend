import React from "react";
import logo from "../../../assets/images/logo-no-bg.png";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-32 w-auto -mb-14 -mt-10 mx-auto" }) => {
  return <img src={logo} alt="Logo" className={className} />;
};

export default Logo;
