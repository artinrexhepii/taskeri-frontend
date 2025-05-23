import React from "react";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8 w-auto" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 150 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32.5 0H27L17 10V0H13V21.5L0 32H8L15.5 25.5V32H19.5V19L27 13V32H31.5V13L40 19V32H44V16L32.5 0Z"
        fill="#0D9488"
      />
      <path d="M55 6H78V11H60V15H76V20H60V24H78V29H55V6Z" fill="#0D9488" />
      <path d="M85 6H108V11H90V15H106V20H90V24H108V29H85V6Z" fill="#0D9488" />
      <path
        d="M115 6H138V11H120V15H136V20H120V24H138V29H115V6Z"
        fill="#0D9488"
      />
      <path d="M145 6H150V29H145V6Z" fill="#0D9488" />
      <circle cx="147.5" cy="2.5" r="2.5" fill="#0D9488" />
    </svg>
  );
};

export default Logo;
