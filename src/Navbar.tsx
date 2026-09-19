import { MdAdd, MdLiveTv, MdOutlineAccountCircle, MdUpdate } from "react-icons/md";
import { Link } from "react-router";
import { cnw } from "./lib/tailwindUtil";
import { useContext } from "react";
import { AuthContext } from "./auth/AuthWrapper";

export default function Navbar({ className }: { className?: string }) {
  const authContext = useContext(AuthContext);

  return (
    <nav className={cnw("flex items-center gap-4 border border-gray-700 rounded-full py-2 px-4", className ?? "")}>
      <div className="inline-flex items-center">
        <Link to={"/"} className="inline-flex justify-start items-center gap-3">
          <img src="/favicon.svg" className="h-5"/>
          <h6 className="hidden md:block">Paper</h6>
        </Link>
      </div>
      <Link to={"/addTask"}  className="inline-flex justify-center items-center gap-1 h-6"><MdAdd size={24}/>Add Task</Link>
      <Link to={"/livefeed"} className="inline-flex justify-center items-center gap-1 h-6"><MdLiveTv size={24}/>Live</Link>
      <Link to={"/update"}   className="inline-flex justify-end items-center gap-1 h-6"><MdUpdate size={24}/>Update</Link>
      <Link to={"/account"}  className="inline-flex justify-end items-center gap-1 h-6">
        <MdOutlineAccountCircle size={24}/>
        {authContext.user ? (authContext.user.displayName) : "Account"}
        </Link>
    </nav>
  )
}