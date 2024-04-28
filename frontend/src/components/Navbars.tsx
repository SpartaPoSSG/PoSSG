import React, { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import { BiLogIn } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "flowbite-react";

const theme = {
  active: {
    on: "bg-blue-700 text-white font-PretendardVariable font-normal dark:text-white md:bg-transparent md:text-blue-700",
    off: "border-b border-gray-100 text-gray-700 font-PretendardVariable font-normal hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white",
  },
};

function Navbars() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState<string>('');
  const [loggedIn, setLoggedIn] = useState<boolean>(false); // 로그인 상태
  const [userName, setUserName] = useState<string>(''); // 사용자 이름
  
  const token = localStorage.getItem('token');

  // 로그인 버튼 클릭 시 이벤트 핸들러
  const handleLoginButtonClick = () => {
    if (loggedIn) {
      // 로그아웃 처리
      localStorage.removeItem('token');
      setLoggedIn(false);
    } else {
      // 로그인 처리
      navigate("/login");
    }
  };

  useEffect(() => {
    setActiveLink(location.pathname);

    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [location.pathname, token]);

  const getButtonStyle = (path: string) => {
    return path === activeLink ? theme.active.on : theme.active.off;
  };

  return (
    <Navbar border fluid className="fixed left-0 right-0 top-0 z-50">
      <Navbar.Brand href="/">
        <img
          alt="Logo"
          className="ml-6 mr-2 h-6 sm:h-9"
          src="/img/logo.png"
        />
        <span className="self-center whitespace-nowrap font-PretendardVariable text-xl font-semibold dark:text-white">
          포쓱
        </span>
      </Navbar.Brand>
      <div className="flex items-center mr-auto gap-x-4 ml-12 list-none">
        <Navbar.Link theme={theme} href="/" className={getButtonStyle("/")}>
          프로젝트
        </Navbar.Link>
        <Navbar.Link
          theme={theme}
          href="/portfolio"
          className={getButtonStyle("/portfolio")}
        >
          포트폴리오
        </Navbar.Link>
      </div>
      <div className="flex items-center ml-auto gap-x-4 mr-10 list-none">
        {loggedIn && (
          <div className="flex items-center font-PretendardVariable list-none">
              <div className='flex w-full font-semibold'>{userName}</div>&nbsp;
              <span className='list-none'>님</span>&nbsp;&nbsp;
          </div>
        )}
        <Navbar.Link
          theme={theme}
          href="/login"
          className={getButtonStyle("/login")}
        >
          <Button color="light">
            <BiLogIn className={`mr-2 h-5 w-5 ${activeLink === 'login' ? 'active' : ''}`} onClick={handleLoginButtonClick} />
            {loggedIn ? '로그아웃' : '로그인'}
          </Button>
        </Navbar.Link>
      </div>
    </Navbar>
  );
}

export default Navbars;
