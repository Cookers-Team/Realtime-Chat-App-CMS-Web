import { PlusIcon, SearchIcon } from "lucide-react";

const Header = ({ SearchBoxes, onSearch, onCreate }: any) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center">
      {SearchBoxes}
      <button
        onClick={onSearch}
        className="bg-blue-600 hover:bg-blue-900 text-white border p-2 rounded-lg flex items-center"
      >
        <SearchIcon size={20} />
        <span className="ml-1">Tìm kiếm</span>
      </button>
    </div>
    <button
      onClick={onCreate}
      className="bg-gray-600 hover:bg-gray-800 text-white p-2 rounded-lg flex items-center"
    >
      <PlusIcon size={20} className="mr-1" /> Thêm
    </button>
  </div>
);

export default Header;
