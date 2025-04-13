import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./routes/home";
import Profile from "./routes/profile"; //yeong-eun
import ProfileEdit from "./routes/profile-edit"; //yeong-eun
import Login from "./routes/login";
import SignUp from "./routes/signup";
import PasswdReset from "./routes/passwd-reset";
import Layout from "./components/layout/layout";
import CreateProfile from "./routes/create-profile";
import ProjectBoard from "./routes/project-board"; //yu-geum
import NoticeBoard from "./routes/notice-board"; //yu-geum
import Notice from "./routes/notice"; //yu-geum
import InterestsBorad from "./routes/interests-borad"; //yeong-eun
import { useState } from "react";
import GlobalBackdrop from "./components/easter/GlobalBackdrop";
import { BackdropContext } from "./context/Backdropcontext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "profile/",
        element: <Profile />,
      },
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile-edit/",
        element: <ProfileEdit />,
      },
      {
        path: "project-board/",
        element: <ProjectBoard />,
      },
      {
        path: "notice-board/",
        element: <NoticeBoard />,
      },
      {
        path: "notice/",
        element: <Notice />,
      },
      {
        path: "interests-board/",
        element: <InterestsBorad />,
      },
    ],
  },
  // 이 윗 줄 까진 Layout의 children임.
  // 인증이 필요한 부분
  {
    path: "/login",
    element: <NavigateToHome />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },

  {
    path: "/create-profile",
    element: <CreateProfile />,
  },
  {
    path: "/password-reset",
    element: <PasswdReset />,
  },
  {
    path: "/find-id",
    element: <PasswdReset />,
  },
]);

function App() {
  const [showBackdrop, setShowBackdrop] = useState(false);
  return (
    <>
      <BackdropContext.Provider value={{ showBackdrop, setShowBackdrop }}>
        <GlobalBackdrop visible={showBackdrop} />
        <RouterProvider router={router} />
      </BackdropContext.Provider>
    </>
  );
}

function NavigateToHome() {
  try {
    return <Login />;
  } catch (e) {
    console.log(e);
  }
}

export default App;
