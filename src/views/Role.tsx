import { useEffect, useState } from "react";
import Table from "../components/Table";
import { LoadingDialog } from "../components/Dialog";
import useFetch from "../hooks/useFetch";
import Header from "../components/Header";
import InputBox from "../components/InputBox";
import CreateRole from "../components/role/CreateRole";
import UpdateRole from "../components/role/UpdateRole";

const Role = ({ profile }: any) => {
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [roleId, setRoleId] = useState(null);
  const [data, setData] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const columns = [
    { label: "Tên vai trò", accessor: "name", align: "left" },
    {
      label: "Ngày cập nhật",
      accessor: "updatedAt",
      align: "center",
    },
  ];
  const { get, loading } = useFetch();
  const [searchValues, setSearchValues] = useState({
    name: "",
  });

  const getData = async () => {
    const query: any = {
      page: currentPage,
      size: itemsPerPage,
    };
    if (searchValues.name) {
      query.name = searchValues.name;
    }
    const res = await get("/v1/role/list", query);
    setData(res.data.content);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    const fetchPermissions = async () => {
      const res = await get(`/v1/permission/list`);
      setPermissions(res.data.content);
    };
    fetchPermissions();
  }, []);

  useEffect(() => {
    getData();
  }, [currentPage]);

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
  };

  const handleRefreshData = async () => {
    setCurrentPage(0);
    await getData();
  };

  const handleClear = async () => {
    setSearchValues({ name: "" });
    setCurrentPage(0);
    const res = await get("/v1/role/list", {
      page: 0,
      size: itemsPerPage,
    });
    setData(res.data.content);
    setTotalPages(res.data.totalPages);
  };

  return (
    <>
      <Header
        createDisabled={!profile.isSuperAdmin}
        onCreate={() => {
          setCreateModalVisible(true);
        }}
        onSearch={handleRefreshData}
        onClear={handleClear}
        SearchBoxes={
          <>
            <InputBox
              value={searchValues.name}
              onChangeText={(value: any) =>
                setSearchValues({ ...searchValues, name: value })
              }
              placeholder="Tên vai trò..."
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
          setRoleId(id);
          setUpdateModalVisible(true);
        }}
        disableEditCondition={(item: any) =>
          item.name.toLowerCase().includes("admin") ||
          (item.name.toLowerCase().includes("quản trị") &&
            !profile.isSuperAdmin)
        }
      />
      <LoadingDialog isVisible={loading} />
      <UpdateRole
        isVisible={updateModalVisible}
        setVisible={setUpdateModalVisible}
        roleId={roleId}
        permissions={permissions}
        onButtonClick={handleClear}
      />
      <CreateRole
        isVisible={createModalVisible}
        setVisible={setCreateModalVisible}
        permissions={permissions}
        onButtonClick={handleClear}
      />
    </>
  );
};

export default Role;
