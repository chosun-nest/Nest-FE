import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./routes/home";
import Profile from "./routes/profile"; //yeong-eun
import ProfileEdit from "./routes/profile-edit"; //yeong-eun
import Login from "./routes/login";
import SignUp from "./routes/signup";
import PasswdReset from "./routes/passwd-reset";
import Layout from "./components/layout/layout";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getMemberProfile } from "./api/profile/ProfileAPI";
import { setUser, clearUser } from "./store/slices/userSlice";
import { setAccessToken } from "./store/slices/authSlice"; // ✅ accessToken 복구용 추가

import ProjectBoard from "./routes/project-board"; //yu-gyeom
import ProjectDetail from "./routes/project-detail"; //yu-gyeom
import ProjectEdit from "./routes/project-edit"; // yu-gyeom
import ProjectApply from "./routes/project-apply"; // yu-gyeom
import NoticeBoard from "./routes/NoticeBoard"; //hye-rin
import InterestsBorad from "./routes/interests-borad"; //yeong-eun
import InterestsDetail from "./routes/interests-detail"; //yeong-eun
import InterestWrite from "./routes/interests-write"; //yeong-eun
import ProjectWrite from "./routes/project-write"; //yeong-eun

import GlobalBackdrop from "./components/easter/GlobalBackdrop";
import { BackdropContext } from "./context/Backdropcontext";
import NotFound from "./routes/notfound";
import ProtectedRoute from "./components/auth/protected-route";
import Events from "./routes/events";
import PublicRoute from "./components/auth/public-route";
import ResetPassword from "./routes/reset-password";
import GlobalModal from "./components/global/global-modal";
import ChatMain from "./routes/chat-main";
import OtherProfile from "./routes/other-profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "project/:id", element: <ProjectDetail /> },
      {
        path: "project/:id/edit",
        element: (
          <ProtectedRoute>
            <ProjectEdit />
          </ProtectedRoute>
        ),
      },
      { path: "project-apply", element: <ProjectApply /> },
      { path: "notice-board/", element: <NoticeBoard /> },
      { path: "interests-board/", element: <InterestsBorad /> },
      { path: "interests-detail/:id", element: <InterestsDetail /> },
      { path: "chat/", element: <ChatMain /> },
      { path: "events/", element: <Events /> },
    ],
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "profile/",
        children: [
          {
            path: "", // /profile
            element: <Profile />, // 내 프로필
          },
          {
            path: ":id", // /profile/123
            element: <OtherProfile />, // 타인 프로필
          },
        ],
      },

      {
        path: "profile-edit/",
        element: <ProfileEdit />,
      },
      {
        path: "interests-write",
        element: (
          <ProtectedRoute>
            <InterestWrite />
          </ProtectedRoute>
        ),
      },
      { path: "project-board/", element: <ProjectBoard /> },
      {
        path: "project-write",
        element: (
          <ProtectedRoute>
            <ProjectWrite />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
  },
  {
    path: "/password-reset",
    element: (
      <PublicRoute>
        <PasswdReset />
      </PublicRoute>
    ),
  },
  {
    path: "/reset-password/",
    element: (
      <PublicRoute>
        <ResetPassword />
      </PublicRoute>
    ),
  },
  {
    path: "/*",
    element: <NotFound />,
  },
]);

function App() {
  const [showBackdrop, setShowBackdrop] = useState(false);
  const dispatch = useDispatch();

  // ✅ accessToken 복구: localStorage → Redux store
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(setAccessToken(token));
    }
  }, [dispatch]);

  // ✅ 유저 정보 로드
  useEffect(() => {
    const initUser = async () => {
      try {
        const user = await getMemberProfile();
        dispatch(
          setUser({
            memberId: user.memberId,
            memberName: user.memberName,
            memberRole: user.memberRole,
          })
        );
      } catch {
        dispatch(clearUser());
      }
    };

    initUser();
  }, [dispatch]);

  return (
    <BackdropContext.Provider value={{ showBackdrop, setShowBackdrop }}>
      <GlobalModal />
      <GlobalBackdrop visible={showBackdrop} />
      <RouterProvider router={router} />
    </BackdropContext.Provider>
  );
}

export default App;
