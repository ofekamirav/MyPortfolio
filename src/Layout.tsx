import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

function Layout() {
  return (
    <div className="bg-white dark:bg-gray-950 text-black dark:text-white min-h-screen transition-colors">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default Layout;