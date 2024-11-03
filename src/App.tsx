import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Loading from "./views/Loading";
import useFetch from "./hooks/useFetch";
import NotFound from "./views/NotFound";
import User from "./views/User";
import Post from "./views/Post";
import Role from "./views/Role";
import Statistic from "./views/Statistic";
import Setting from "./views/Setting";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);
  const { get, post, loading } = useFetch();

  useEffect(() => {
    const checkToken = async () => {
      const token = await localStorage.getItem("accessToken");
      const res = await post("/v1/user/verify-token", { accessToken: token });
      if (res.result) {
        setIsAuthenticated(true);
      } else {
        await localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
      }
    };
    const getProfile = async () => {
      const res = await get("/v1/user/profile");
      setProfile(res.data);
    };
    getProfile();
    checkToken();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <BrowserRouter>
            <Routes>
              {isAuthenticated ? (
                <>
                  <Route path="/" element={<User profile={profile} />} />
                  <Route path="/post" element={<Post profile={profile} />} />
                  <Route
                    path="/statistic"
                    element={<Statistic profile={profile} />}
                  />
                  <Route
                    path="/setting"
                    element={<Setting profile={profile} />}
                  />
                  <Route path="/role" element={<Role profile={profile} />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<Login />} />
                </>
              )}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </>
      )}
    </>
  );
};

export default App;
