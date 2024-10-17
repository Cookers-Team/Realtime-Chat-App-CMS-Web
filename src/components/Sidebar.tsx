import { useEffect, useState } from "react";
import {
  BellIcon,
  FileTextIcon,
  LogOutIcon,
  ShieldEllipsisIcon,
  UserIcon,
} from "lucide-react";
import logo from "../assets/cms.png";
import userImage from "../assets/user_icon.png";
import Notification from "./Notification";
import { useNavigate } from "react-router-dom";
import { ConfimationDialog } from "./Dialog";
import { ToastContainer } from "react-toastify";
import UpdateProfile from "./user/UpdateProfile";
import useFetch from "../hooks/useFetch";
import useDialog from "../hooks/useDialog";

const Sidebar = ({ activeItem, renderContent }: any) => {
  const navigate = useNavigate();
  const [isModalVisible, setModalVisible] = useState(false);
  const { isDialogVisible, showDialog, hideDialog } = useDialog();
  const { get } = useFetch();
  const [profile, setProfile] = useState<any>({
    displayName: "Đang tải",
    avatarUrl: null,
  });
  const handleLogout = () => {
    hideDialog();
    localStorage.removeItem("accessToken");
    navigate("/");
    window.location.reload();
  };
  const handleLogoutDialog = () => {
    showDialog();
  };
  const getProfile = async () => {
    if (localStorage.getItem("accessToken")) {
      const res = await get("/v1/user/profile");
      setProfile(res.data);
    }
  };
  useEffect(() => {
    getProfile();
  }, []);
  const menuItems = [
    {
      name: "user",
      label: "Quản lý người dùng",
      icon: <UserIcon size={20} />,
      path: "/",
    },
    {
      name: "post",
      label: "Quản lý bài đăng",
      icon: <FileTextIcon size={20} />,
      path: "/post",
    },

    {
      name: "role",
      label: "Quản lý quyền",
      icon: <ShieldEllipsisIcon size={20} />,
      path: "/role",
    },
  ];
  const handleMenuItemClick = (itemName: string) => {
    const selectedItem = menuItems.find((item) => item.name === itemName);
    if (selectedItem) {
      navigate(selectedItem.path);
    }
  };
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  return (
    <div className="flex">
      <div className="w-100 h-screen flex flex-col sticky top-0">
        <div className="w-full bg-gray-900 text-white flex-none flex flex-col">
          <div className="flex flex-col items-center m-2">
            <img src={logo} className="w-64 rounded-lg" alt="Logo" />
          </div>
          <div
            onClick={() => setModalVisible(true)}
            className="flex items-center cursor-pointer hover:bg-gray-700 transition-colors rounded-lg mx-2 mb-2 p-2"
          >
            <img
              src={profile?.avatarUrl ? profile.avatarUrl : userImage}
              className="w-10 h-10 rounded-full mr-2 border-gray-600 border object-cover"
              alt="User Avatar"
            />
            <span className="mr-2">{profile.displayName}</span>
          </div>

          <button
            className="flex text-gray-300 items-center justify-center bg-gray-800 cursor-pointer hover:bg-gray-700 transition-colors rounded-lg mb-2 mx-2 p-2"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <BellIcon size={20} />
            <span className="ml-2">Thông báo</span>
          </button>
        </div>
        {isNotificationOpen && <Notification />}
        <div className="w-full bg-blue-900 text-white flex-grow flex flex-col">
          <nav className="flex-grow">
            <ul>
              {menuItems.map((item: any, index: number) => (
                <li key={index} className="mb-2">
                  <div
                    className={`flex items-center p-3 m-2 rounded-lg cursor-pointer transition-colors ${
                      activeItem === item.name
                        ? "bg-blue-500"
                        : "hover:bg-blue-700"
                    }`}
                    onClick={() => handleMenuItemClick(item.name)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto p-3">
            <button
              className="w-full bg-red-600 text-white rounded-lg hover:bg-red-800 transition-colors p-2"
              onClick={handleLogoutDialog}
            >
              <div className="flex items-center justify-center">
                <LogOutIcon size={20} />
                <span className="ml-2">Đăng xuất</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="flex-grow p-6">{renderContent}</div>
      <ToastContainer />
      <ConfimationDialog
        isVisible={isDialogVisible}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất?"
        onConfirm={handleLogout}
        confirmText="Đăng xuất"
        onCancel={hideDialog}
        color="red"
      />
      <UpdateProfile
        isVisible={isModalVisible}
        setVisible={setModalVisible}
        userId={profile._id}
        onUpdate={getProfile}
      />
    </div>
  );
};

export default Sidebar;
