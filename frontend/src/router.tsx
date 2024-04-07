import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import NotFound from "./components/NotFound";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <NotFound />,
      children: [
        {
          path: "", // 기본 시작 페이지는 빈 문자열 경로 ("/")로 설정
          element: <Home />, // "Home" 페이지 연결
        },
        {
          path: "portfolio",
          element: <Portfolio />,
        },
      ],
    },
  ]);
  
  export default router;