import { useEffect, useState } from "react";
import Table from "../components/Table";
import { ConfimationDialog, LoadingDialog } from "../components/Dialog";
import useFetch from "../hooks/useFetch";
import Header from "../components/Header";
import InputBox from "../components/InputBox";
import SelectBox from "../components/SelectBox";
import CreatePost from "../components/post/CreatePost";
import UpdatePost from "../components/post/UpdatePost";
import useDialog from "../hooks/useDialog";
import { toast } from "react-toastify";
import PostDetail from "../components/post/PostDetail";
import Breadcrumb from "../components/Breadcrumb";
import {
  CircleCheckBigIcon,
  CircleXIcon,
  ClockIcon,
  EarthIcon,
  EditIcon,
  LockIcon,
  UsersIcon,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import PostReview from "../components/post/PostReview";

const Post = ({ profile }: any) => {
  const { isDialogVisible, showDialog, hideDialog } = useDialog();
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [postId, setPostId] = useState(null);
  const [users, setUsers] = useState(null);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [view, setView] = useState("list");
  const itemsPerPage = 10;

  const columns = [
    {
      label: "Người đăng",
      accessor: "user",
      align: "left",
      render: (item: any) => <span>{item.user.displayName}</span>,
    },
    {
      label: "Nội dung",
      accessor: "content",
      align: "left",
      render: (item: any) => {
        const content =
          item.content.length > 100
            ? item.content.slice(0, 100) + "..."
            : item.content;
        return (
          <span>
            {item.isUpdated === 1 && (
              <span className="inline-block mr-2">
                <EditIcon className="w-4 h-4 text-blue-500" />
              </span>
            )}
            <span>{item.kind === 3 ? "********************" : content}</span>
          </span>
        );
      },
    },
    {
      label: "Yêu thích",
      accessor: "likes",
      align: "center",
      render: (item: any) => <span>{item.totalReactions}</span>,
    },
    {
      label: "Bình luận",
      accessor: "comments",
      align: "center",
      render: (item: any) => <span>{item.totalComments}</span>,
    },
    {
      label: "Ngày đăng",
      accessor: "createdAt",
      align: "center",
    },
    {
      label: "Loại",
      accessor: "kind",
      align: "center",
      render: (item: any) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md ${
            item.kind === 1
              ? "bg-green-100 text-blue-800"
              : item.kind === 2
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.kind === 1 ? (
            <>
              <EarthIcon size={16} />
              Công khai
            </>
          ) : item.kind === 2 ? (
            <>
              <UsersIcon size={16} />
              Bạn bè
            </>
          ) : (
            <>
              <LockIcon size={16} />
              Riêng tư
            </>
          )}
        </span>
      ),
    },
    {
      label: "Trạng thái",
      accessor: "status",
      align: "center",
      render: (item: any) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md ${
            item.status === 1
              ? "bg-yellow-100 text-yellow-800"
              : item.status === 2
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.status === 1 ? (
            <>
              <ClockIcon size={16} />
              Chờ duyệt
            </>
          ) : item.status === 2 ? (
            <>
              <CircleCheckBigIcon size={16} />
              Chấp nhận
            </>
          ) : (
            <>
              <CircleXIcon size={16} />
              Từ chối
            </>
          )}
        </span>
      ),
    },
  ];

  const { get, del, loading } = useFetch();
  const [searchValues, setSearchValues] = useState({
    content: "",
    user: "",
    status: "",
    kind: "",
  });

  const getData = async () => {
    const query: any = {
      page: currentPage,
      size: itemsPerPage,
    };
    if (searchValues.content) {
      query.content = searchValues.content;
    }
    if (searchValues.user) {
      query.user = searchValues.user;
    }
    if (searchValues.status) {
      query.status = searchValues.status;
    }
    if (searchValues.kind) {
      query.kind = searchValues.kind;
    }
    const res = await get("/v1/post/list", query);
    setData(res.data.content);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await get("/v1/user/list?isPaged=0&sort=displayName,asc");
      setUsers(res.data.content);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    getData();
  }, [currentPage]);

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async () => {
    hideDialog();
    const res = await del("/v1/post/delete/" + postId);
    if (res.result) {
      toast.success("Xóa thành công");
      await handleClear();
    } else {
      toast.error(res.message);
    }
  };

  const handleDeleteDialog = (id: any) => {
    setPostId(id);
    showDialog();
  };

  const handleRefreshData = async () => {
    setCurrentPage(0);
    await getData();
  };

  const handleClear = async () => {
    setSearchValues({ content: "", user: "", status: "", kind: "" });
    setCurrentPage(0);
    const res = await get("/v1/post/list", {
      page: 0,
      size: itemsPerPage,
    });
    setData(res.data.content);
    setTotalPages(res.data.totalPages);
  };

  return (
    <>
      <Sidebar
        activeItem="post"
        renderContent={
          <>
            <Breadcrumb
              currentView={view}
              setView={setView}
              listLabel="Quản lý bài đăng"
              detailLabel="Chi tiết bài đăng"
            />
            {view === "list" ? (
              <>
                <Header
                  onCreate={() => {
                    setCreateModalVisible(true);
                  }}
                  onSearch={handleRefreshData}
                  onClear={handleClear}
                  SearchBoxes={
                    <>
                      <InputBox
                        value={searchValues.content}
                        onChangeText={(value: any) =>
                          setSearchValues({ ...searchValues, content: value })
                        }
                        placeholder="Nội dung bài viết..."
                      />
                      {users && (
                        <SelectBox
                          value={searchValues.user}
                          placeholder="Người đăng..."
                          options={users}
                          labelKey="displayName"
                          valueKey="_id"
                          onChange={(value: any) =>
                            setSearchValues({
                              ...searchValues,
                              user: value,
                            })
                          }
                        />
                      )}
                      <SelectBox
                        onChange={(value: any) =>
                          setSearchValues({
                            ...searchValues,
                            kind: value,
                          })
                        }
                        placeholder="Loại bài viết..."
                        options={[
                          { value: "1", name: "Công khai" },
                          { value: "2", name: "Bạn bè" },
                          { value: "3", name: "Riêng tư" },
                        ]}
                        labelKey="name"
                        valueKey="value"
                      />
                      <SelectBox
                        onChange={(value: any) =>
                          setSearchValues({
                            ...searchValues,
                            status: value,
                          })
                        }
                        placeholder="Trạng thái..."
                        options={[
                          { value: "1", name: "Chờ duyệt" },
                          { value: "2", name: "Chấp nhận" },
                          { value: "3", name: "Từ chối" },
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
                  onReview={(id: any) => {
                    setPostId(id);
                    setReviewModalVisible(true);
                  }}
                  onView={(id: any) => {
                    setPostId(id);
                    setView("detail");
                  }}
                  onEdit={(id: any) => {
                    setPostId(id);
                    setUpdateModalVisible(true);
                  }}
                  onDelete={(id: any) => {
                    handleDeleteDialog(id);
                  }}
                  disableReviewCondition={(item: any) =>
                    item.status !== 1 || item.kind === 3
                  }
                  disableEditCondition={(item: any) =>
                    item.kind === 3 ||
                    (item.isOwner === 0 && profile.role.kind !== 3)
                  }
                />
              </>
            ) : (
              <PostDetail postId={postId} />
            )}
          </>
        }
      />
      <ConfimationDialog
        isVisible={isDialogVisible}
        title="Xóa bài đăng"
        message="Bạn có chắc muốn xóa bài đăng này?"
        onConfirm={handleDelete}
        confirmText="Xóa"
        onCancel={hideDialog}
        color="red"
      />
      <LoadingDialog isVisible={loading} />
      <PostReview
        isVisible={reviewModalVisible}
        setVisible={setReviewModalVisible}
        postId={postId}
        onButtonClick={handleClear}
      />
      <UpdatePost
        isVisible={updateModalVisible}
        setVisible={setUpdateModalVisible}
        postId={postId}
        onButtonClick={handleClear}
      />
      <CreatePost
        isVisible={createModalVisible}
        setVisible={setCreateModalVisible}
        profile={profile}
        onButtonClick={handleClear}
      />
    </>
  );
};

export default Post;
