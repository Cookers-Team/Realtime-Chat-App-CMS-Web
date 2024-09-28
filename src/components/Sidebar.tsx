import { LogOutIcon } from "lucide-react";
import logo from "../assets/cms.png";
import userImage from "../assets/user_icon.png";

const Sidebar = ({
  menuItems,
  activeItem,
  onMenuItemClick,
  profile,
  onLogOut,
  onProfileClick,
}: any) => (
  <div className="w-100 h-screen flex flex-col sticky top-0">
    <div className="w-full bg-gray-900 text-white flex-none flex flex-col">
      <div className="flex flex-col items-center m-2">
        <img src={logo} className="w-64 rounded-lg" alt="Logo" />
      </div>
      <div
        onClick={onProfileClick}
        className="flex items-center cursor-pointer hover:bg-gray-700 transition-colors rounded-lg mx-2 mb-2 p-2"
      >
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
        <button
          className="w-full bg-red-600 text-white rounded-lg hover:bg-red-800 transition-colors p-2"
          onClick={onLogOut}
        >
          <div className="flex items-center justify-center">
            <LogOutIcon size={20} />
            <span className="ml-2">Đăng xuất</span>
          </div>
        </button>
      </div>
    </div>
  </div>
);

export default Sidebar;
