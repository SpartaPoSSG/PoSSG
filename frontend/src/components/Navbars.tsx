import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "flowbite-react";

const theme = {
  active: {
    on: "bg-blue-700 text-white dark:text-white md:bg-transparent md:text-blue-700",
    off: "border-b border-gray-100  text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white",
  },
};

function Navbars() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const getButtonStyle = (path: string) => {
    return path === activeLink ? theme.active.on : theme.active.off;
  };

  return (
    <Navbar border fluid className="fixed left-0 right-0 top-0 z-50">
      <Navbar.Brand href="/">
        {/* <img
          alt="Logo"
          className="mr-1 h-6 sm:h-9"
          src="/img/logo.png"
        /> */}
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          포쓱
        </span>
      </Navbar.Brand>
      <div className="flex items-end ml-auto gap-x-4 mr-10 list-none">
        <Navbar.Link theme={theme} href="/" className={getButtonStyle("/")}>
          Home
        </Navbar.Link>
        <Navbar.Link
          theme={theme}
          href="/portfolio"
          className={getButtonStyle("/portfolio")}
        >
          Portfolio
        </Navbar.Link>
      </div>
    </Navbar>
  );
}

export default Navbars;
