import Sidebar from "../components/Sidebar";

const Setting = ({ profile }: any) => {
  return (
    <>
      <Sidebar activeItem="setting" renderContent={<>Settings</>} />
    </>
  );
};

export default Setting;
