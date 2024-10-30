import { useEffect, useState } from "react";
import Header from "../components/Header";
import SelectBox from "../components/SelectBox";
import Sidebar from "../components/Sidebar";
import useFetch from "../hooks/useFetch";
import { LoadingDialog } from "../components/Dialog";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Statistic = ({ profile }: any) => {
  const { get, loading } = useFetch();
  const [data, setData] = useState({
    users: [],
  });
  const [searchValues, setSearchValues] = useState({
    category: "0",
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await get("/v1/user/list", { isPaged: 0 });
      setData({ ...data, users: res.data.content });
    };
    fetchData();
  }, []);

  // Chuyển đổi dữ liệu người dùng thành dữ liệu phù hợp cho biểu đồ
  const userDataForCharts = data.users.map((user: any) => ({
    name: user.displayName,
    totalFriends: user.totalFriends,
    unreadNotifications: user.totalUnreadNotifications,
  }));

  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <>
      <Sidebar
        activeItem="statistic"
        renderContent={
          <>
            <Header
              createDisabled={true}
              SearchBoxes={
                <>
                  <SelectBox
                    width="400px"
                    onChange={(value: any) =>
                      setSearchValues({
                        ...searchValues,
                        category: value,
                      })
                    }
                    options={[
                      { value: "0", name: "Thống kê người dùng" },
                      { value: "1", name: "Thống kê bài đăng" },
                      { value: "2", name: "Thống kê bình luận" },
                      { value: "3", name: "Thống kê bản tin" },
                      { value: "4", name: "Thống kê cuộc trò chuyện" },
                    ]}
                    labelKey="name"
                    valueKey="value"
                  />
                </>
              }
            />

            {/* Thống kê tổng số bạn bè của từng người dùng */}
            <h3>Thống kê bạn bè</h3>
            <BarChart width={600} height={300} data={userDataForCharts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalFriends" fill="#8884d8" name="Số bạn bè" />
            </BarChart>

            {/* Thống kê thông báo chưa đọc */}
            <h3>Thông báo chưa đọc</h3>
            <PieChart width={400} height={400}>
              <Pie
                data={userDataForCharts}
                dataKey="unreadNotifications"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#82ca9d"
                label
              >
                {userDataForCharts.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </>
        }
      />
      <LoadingDialog isVisible={loading} />
    </>
  );
};

export default Statistic;
