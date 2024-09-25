import {
  UserIcon,
  LogOutIcon,
  ShieldEllipsisIcon,
  FileTextIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import logo from "../assets/cms.png";
import userImage from "../assets/user_icon.png";
import User from "./User";
import Post from "./Post";
import Role from "./Role";
import useFetch from "../hooks/useFetch";
import { LoadingDialog } from "../components/Dialog";
import { ToastContainer } from "react-toastify";

const Sidebar = ({ menuItems, activeItem, onMenuItemClick, profile }: any) => (
  <div className="w-100 h-screen flex flex-col">
    <div className="w-full bg-gray-900 text-white flex-none flex flex-col">
      <div className="flex flex-col items-center m-2">
        <img src={logo} className="w-64 rounded-lg" alt="Logo" />
      </div>
      <div className="flex items-center cursor-pointer hover:bg-gray-700 transition-colors rounded-lg mx-2 mb-2 p-2">
        <img
          src={profile?.avatarUrl ? profile.avatarUrl : userImage}
          className="w-10 h-10 rounded-full mr-2"
        />
        <span className="mr-2">{profile.displayName}</span>
      </div>
    </div>
    <div className="w-full bg-blue-900 text-white flex-grow flex flex-col">
      <nav className="flex-grow">
        <ul>
          {menuItems.map((item: any, index: number) => (
            <li key={index} className="mb-2">
              <div
                className={`flex items-center p-3 m-2 rounded-lg cursor-pointer transition-colors ${
                  activeItem === item.name ? "bg-blue-500" : "hover:bg-gray-700"
                }`}
                onClick={() => onMenuItemClick(item.name)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto p-3">
        <button className="w-full bg-red-600 text-white rounded-lg hover:bg-red-800 transition-colors p-2">
          <div className="flex items-center justify-center">
            <LogOutIcon size={20} />
            <span className="ml-2">Đăng xuất</span>
          </div>
        </button>
      </div>
    </div>
  </div>
);

const Home = () => {
  const [activeItem, setActiveItem] = useState("user");
  const { get, loading } = useFetch();
  const [profile, setProfile] = useState({
    displayName: "Đang tải",
    avatarUrl: null,
  });

  useEffect(() => {
    const getProfile = async () => {
      const res = await get("/v1/user/profile");
      setProfile(res.data);
    };
    getProfile();
  }, []);

  const menuItems = [
    { name: "user", label: "Quản lý người dùng", icon: <UserIcon size={20} /> },
    {
      name: "post",
      label: "Quản lý bài đăng",
      icon: <FileTextIcon size={20} />,
    },
    {
      name: "role",
      label: "Quản lý quyền",
      icon: <ShieldEllipsisIcon size={20} />,
    },
  ];

  const renderContent = () => {
    switch (activeItem) {
      case "user":
        return <User />;
      case "post":
        return <Post />;
      case "role":
        return <Role />;
      default:
        return <User />;
    }
  };

  return (
    <div className="flex">
      <Sidebar
        menuItems={menuItems}
        activeItem={activeItem}
        onMenuItemClick={setActiveItem}
        profile={profile}
      />
      <div className="flex-grow p-6">{renderContent()}</div>
      <LoadingDialog isVisible={loading} />
      <ToastContainer />
    </div>
  );
};

export default Home;
