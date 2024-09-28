import { UserIcon, ShieldEllipsisIcon, FileTextIcon } from "lucide-react";
import { useEffect, useState } from "react";
import User from "./User";
import Post from "./Post";
import Role from "./Role";
import useFetch from "../hooks/useFetch";
import { ConfimationDialog, LoadingDialog } from "../components/Dialog";
import { ToastContainer } from "react-toastify";
import useDialog from "../hooks/useDialog";
import Sidebar from "../components/Sidebar";
import UpdateProfile from "../components/UpdateProfile";

const Home = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { isDialogVisible, showDialog, hideDialog } = useDialog();
  const [activeItem, setActiveItem] = useState("user");
  const { get, loading } = useFetch();
  const [profile, setProfile] = useState<any>({
    displayName: "Đang tải",
    avatarUrl: null,
  });

  const handleLogout = () => {
    hideDialog();
    localStorage.removeItem("accessToken");
    window.location.reload();
  };

  const handleLogoutDialog = () => {
    showDialog();
  };

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
        onLogOut={handleLogoutDialog}
        onProfileClick={() => setModalVisible(true)}
      />
      <div className="flex-grow p-6">{renderContent()}</div>
      <LoadingDialog isVisible={loading} />
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
      />
    </div>
  );
};

export default Home;
