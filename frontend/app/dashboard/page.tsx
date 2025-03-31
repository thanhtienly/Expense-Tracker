import Sidebar from "../components/sidebar/sidebar";
import Main from "../components/main/main";

export default function Dashboard() {
  return (
    <div className="w-full h-screen flex flex-row">
      <Sidebar></Sidebar>
      <Main></Main>
    </div>
  );
}
