import {
  PlusIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  SearchIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import userImage from "../assets/user_icon.png";

const SearchBar = () => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center">
      <input
        type="text"
        placeholder="Nhập từ khóa tìm kiếm..."
        className="border p-2 rounded-lg w-64 mr-2"
      />
      <div className="relative">
        <select
          className="border p-2 rounded-lg w-40 bg-white text-gray-700 appearance-none"
          defaultValue=""
        >
          <option value="">Tất cả</option>
          <option value="admin">Quản trị viên</option>
          <option value="user">Người dùng</option>
        </select>
        <span className="absolute top-3 right-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 10l5 5 5-5H7z"
            />
          </svg>
        </span>
      </div>
      <button className="bg-blue-500 hover:bg-blue-800 text-white border p-2 rounded-lg flex items-center ml-2">
        <SearchIcon size={20} />
        <span className="ml-1">Tìm kiếm</span>
      </button>
    </div>
    <button className="bg-green-600 text-white p-2 rounded-lg flex items-center hover:bg-green-800">
      <PlusIcon size={20} className="mr-1" /> Thêm
    </button>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }: any) => {
  const pageNumbers: any = [];
  const maxVisiblePages = 5;
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  const renderPageNumbers = () => {
    if (totalPages <= maxVisiblePages) {
      return pageNumbers.map((number: any) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`w-8 h-8 mx-1 rounded-lg transition-colors duration-200 ${
            currentPage === number
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-blue-100"
          }`}
        >
          {number}
        </button>
      ));
    }
    const leftSide = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    const rightSide = Math.min(leftSide + maxVisiblePages - 1, totalPages);
    const items = [];
    if (leftSide > 1) {
      items.push(1);
      if (leftSide > 2) {
        items.push("...");
      }
    }
    for (let i = leftSide; i <= rightSide; i++) {
      items.push(i);
    }
    if (rightSide < totalPages) {
      if (rightSide < totalPages - 1) {
        items.push("...");
      }
      items.push(totalPages);
    }
    return items.map((item, index) => {
      if (item === "...") {
        return (
          <span
            key={index}
            className="w-8 h-8 mx-1 text-gray-700 text-center flex items-center justify-center"
          >
            ...
          </span>
        );
      }
      return (
        <button
          key={index}
          onClick={() => onPageChange(item)}
          className={`w-8 h-8 mx-1 rounded-lg transition-colors duration-200 ${
            currentPage === item
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-blue-100"
          }`}
        >
          {item}
        </button>
      );
    });
  };
  return (
    <div className="flex justify-center items-center mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-8 h-8 rounded bg-gray-100 mr-2 flex items-center justify-center ${
          currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        <ChevronLeftIcon size={20} />
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-8 h-8 rounded bg-gray-100 ml-2 flex items-center justify-center ${
          currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        <ChevronRightIcon size={20} />
      </button>
    </div>
  );
};

const Table = ({ data, currentPage, onPageChange, totalPages }: any) => (
  <div className="overflow-x-auto">
    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
          <th className="p-4 text-center">#</th>
          <th className="p-4 text-center">Tên</th>
          <th className="p-4 text-center whitespace-nowrap">Created Date</th>
          <th className="p-4 text-center whitespace-nowrap">Trạng thái</th>
          <th className="p-4 text-center whitespace-nowrap">Hành động</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 font-light">
        {data.map((item: any) => (
          <tr
            key={item.id}
            className="border-b hover:bg-blue-100 transition-colors duration-200"
          >
            <td className="p-4">
              <div className="flex justify-center">
                <img src={userImage} className="h-9 rounded-full" />
              </div>
            </td>
            <td className="p-4 text-center">{item.name}</td>
            <td className="p-4 text-center">{item.createdDate}</td>
            <td className="p-4 text-center">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md">
                {item.status}
              </span>
            </td>
            <td className="p-4 text-center">
              <div className="flex justify-center space-x-2">
                <button className="text-blue-500 p-1">
                  <PencilIcon size={16} />
                </button>
                <button className="text-red-500 p-1">
                  <TrashIcon size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  </div>
);

const User = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = 300;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Simulated data for the table
  const generateData = ({ start, end }: any) => {
    return Array.from({ length: end - start + 1 }, (_, index) => ({
      id: start + index,
      name: `Item ${start + index}`,
      createdDate: "12.08.2024",
      status: "Active",
    }));
  };

  const currentData = generateData({
    start: (currentPage - 1) * itemsPerPage + 1,
    end: currentPage * itemsPerPage,
  });

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <SearchBar />
      <Table
        data={currentData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
    </>
  );
};

export default User;
