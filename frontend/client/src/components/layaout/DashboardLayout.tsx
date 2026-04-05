import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout() {

  return (
    <div className="h-screen flex flex-col">
    <Topbar className="border h-16"></Topbar>
    <div className=" flex h-full">
        <Sidebar className=" w-[11%] flex flex-col justify-between items-center py-8 px-2 shadow-md" ></Sidebar>
        <Outlet></Outlet>
    </div>
    </div>
  )
}
