import { useState } from "react";
import Header from "../components/Header";
import SelectBox from "../components/SelectBox";
import Sidebar from "../components/Sidebar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const Statistic = ({ profile }: any) => {
  const [searchValues, setSearchValues] = useState({
    category: "0",
  });
  return (
    <Sidebar
      activeItem="statistic"
      renderContent={
        <>
          <Header
            createDisabled={true}
            SearchBoxes={
              <>
                <SelectBox
                  width="500px"
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
          {/* <BarChart width={500} height={300} data={data}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="uv" fill="#8884d8" />
          </BarChart> */}
        </>
      }
    />
  );
};

export default Statistic;
