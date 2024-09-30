import { useEffect, useState } from "react";
import Table from "../components/Table";
import { ConfimationDialog, LoadingDialog } from "../components/Dialog";
import useFetch from "../hooks/useFetch";
import userImg from "../assets/user_icon.png";
import useDialog from "../hooks/useDialog";
import { toast } from "react-toastify";
import Header from "../components/Header";
import InputBox from "../components/InputBox";
import SelectBox from "../components/SelectBox";
import UpdateUser from "../components/user/UpdateUser";
import CreateUser from "../components/user/CreateUser";

const User = ({ profile }: any) => {
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const { isDialogVisible, showDialog, hideDialog } = useDialog();
  const [deleteId, setDeleteId] = useState(null);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
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
  const [searchValues, setSearchValues] = useState({
    displayName: "",
    email: "",
    phone: "",
    role: "",
    status: "",
  });
  const [roles, setRoles] = useState([]);

  const getData = async () => {
    const query: any = {
      page: currentPage,
      size: itemsPerPage,
    };
    if (searchValues.displayName) {
      query.displayName = searchValues.displayName;
    }
    if (searchValues.email) {
      query.email = searchValues.email;
    }
    if (searchValues.phone) {
      query.phone = searchValues.phone;
    }
    if (searchValues.role) {
      query.role = searchValues.role;
    }
    if (searchValues.status) {
      query.status = searchValues.status;
    }
    const userRes = await get("/v1/user/list", query);
    setData(userRes.data.content);
    setTotalPages(userRes.data.totalPages);
  };

  useEffect(() => {
    const fetchRoles = async () => {
      const roleRes = await get(`/v1/role/list?isPaged=0`);
      setRoles(roleRes.data);
    };
    fetchRoles();
  }, []);

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
      await handleClear();
    } else {
      toast.error(res.message);
    }
  };

  const handleDeleteDialog = (id: any) => {
    setDeleteId(id);
    showDialog();
  };

  const handleRefreshData = async () => {
    setCurrentPage(0);
    await getData();
  };

  const handleClear = async () => {
    setSearchValues({
      displayName: "",
      email: "",
      phone: "",
      role: "",
      status: "",
    });
    setCurrentPage(0);
    const userRes = await get("/v1/user/list", {
      page: 0,
      size: itemsPerPage,
    });
    setData(userRes.data.content);
    setTotalPages(userRes.data.totalPages);
  };

  return (
    <>
      <Header
        onCreate={() => {
          setCreateModalVisible(true);
        }}
        onClear={handleClear}
        onSearch={handleRefreshData}
        SearchBoxes={
          <>
            <InputBox
              value={searchValues.displayName}
              onChangeText={(value: any) =>
                setSearchValues({ ...searchValues, displayName: value })
              }
              placeholder="Tên hiển thị..."
            />
            <InputBox
              value={searchValues.email}
              onChangeText={(value: any) =>
                setSearchValues({ ...searchValues, email: value })
              }
              placeholder="Địa chỉ email..."
            />
            <InputBox
              value={searchValues.phone}
              onChangeText={(value: any) =>
                setSearchValues({ ...searchValues, phone: value })
              }
              placeholder="Số điện thoại..."
            />
            {roles && (
              <SelectBox
                onChange={(value: any) =>
                  setSearchValues({
                    ...searchValues,
                    role: value,
                  })
                }
                value={searchValues.role}
                placeholder="Vai trò..."
                options={roles}
                labelKey="name"
                valueKey="_id"
              />
            )}
            <SelectBox
              onChange={(value: any) =>
                setSearchValues({
                  ...searchValues,
                  status: value,
                })
              }
              placeholder="Trạng thái..."
              options={[
                { value: "0", name: "Chưa kích hoạt" },
                { value: "1", name: "Hoạt động" },
              ]}
              labelKey="name"
              valueKey="value"
            />
          </>
        }
      />
      <Table
        data={data}
        columns={columns}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
        onEdit={(id: any) => {
          setUserId(id);
          setUpdateModalVisible(true);
        }}
        onDelete={(id: any) => {
          handleDeleteDialog(id);
        }}
        disableEditCondition={(item: any) =>
          item.isSuperAdmin || item._id === profile._id
        }
        disableDeleteCondition={(item: any) =>
          item.isSuperAdmin || item._id === profile._id
        }
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
      <UpdateUser
        isVisible={updateModalVisible}
        setVisible={setUpdateModalVisible}
        userId={userId}
        roles={roles}
        onButtonClick={handleClear}
      />
      <CreateUser
        isVisible={createModalVisible}
        setVisible={setCreateModalVisible}
        userId={userId}
        roles={roles}
        onButtonClick={handleClear}
      />
    </>
  );
};

export default User;
