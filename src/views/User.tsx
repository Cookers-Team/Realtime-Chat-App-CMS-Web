import { PlusIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Table from "../components/Table";
import { ConfimationDialog, LoadingDialog } from "../components/Dialog";
import useFetch from "../hooks/useFetch";
import userImg from "../assets/user_icon.png";
import useDialog from "../hooks/useDialog";
import { toast } from "react-toastify";

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

const User = () => {
  const { isDialogVisible, showDialog, hideDialog } = useDialog();
  const [deleteId, setDeleteId] = useState(null);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 9;
  const columns = [
    {
      label: "Ảnh",
      accessor: "avatarUrl",
      align: "left",
      render: (item: any) => (
        <img
          className="w-10 h-10 rounded-full"
          src={item.avatarUrl ? item.avatarUrl : userImg}
        ></img>
      ),
    },
    { label: "Tên hiển thị", accessor: "displayName", align: "left" },
    { label: "Email", accessor: "email", align: "left" },
    { label: "Số điện thoại", accessor: "phone", align: "left" },
    {
      label: "Vai trò",
      accessor: "role",
      align: "center",
      render: (item: any) => <span>{item.role.name}</span>,
    },
    {
      label: "Trạng thái",
      accessor: "status",
      align: "center",
      render: (item: any) => (
        <span
          className={`px-2 py-1 rounded-md ${
            item.status === 1
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.status === 1 ? "Hoạt động" : "Chưa kích hoạt"}
        </span>
      ),
    },
    {
      label: "Ngày tạo",
      accessor: "createdAt",
      align: "center",
    },
  ];
  const { get, del, loading } = useFetch();

  const getData = async () => {
    const res = await get("/v1/user/list", {
      page: currentPage,
      size: itemsPerPage,
    });
    setData(res.data.content);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    getData();
  }, [currentPage]);

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async () => {
    hideDialog();
    const res = await del("/v1/user/delete/" + deleteId);
    if (res.result) {
      toast.success("Xóa thành công");
      setCurrentPage(0);
      getData();
    } else {
      toast.error(res.message);
    }
  };

  const handleDeleteDialog = (id: any) => {
    setDeleteId(id);
    showDialog();
  };

  return (
    <>
      <SearchBar />
      <Table
        data={data}
        columns={columns}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
        onEdit={(id: any) => {
          console.log(id);
        }}
        onDelete={(id: any) => {
          handleDeleteDialog(id);
        }}
        disableEditCondition={(item: any) => item.isSuperAdmin}
        disableDeleteCondition={(item: any) => item.isSuperAdmin}
      />
      <LoadingDialog isVisible={loading} />
      <ConfimationDialog
        isVisible={isDialogVisible}
        title="Xóa người dùng"
        message="Bạn có chắc muốn xóa người dùng này?"
        onConfirm={handleDelete}
        confirmText="Xóa"
        onCancel={hideDialog}
        color="red"
      />
    </>
  );
};

export default User;
