import { MdCopyright } from "react-icons/md";
import Navbar from "./Navbar";

export default function Home() {
  return (
    <>
      <Navbar className="m-3 mx-auto" />
      <div className="flex-1 flex flex-col justify-between px-8 md:px-16 py-8">
        <img src="paper.webp" className="hidden lg:block absolute top-1/2 left-6/8 -translate-x-1/2 -translate-y-1/2 scale-50 rounded-xl"></img>
        <div></div>
        <div>
          <h1 className="text-4xl font-bold">Paper</h1>
          <h6>Parts And Production Electronic Resource</h6>
        </div>
        <div className="text-xs text-gray-500 flex flex-col md:flex-row gap-3 justify-between">
          <p>Use the navigation bar to enter the shop feed or add to part requests</p>
          <p className="flex items-center gap-0.5"><MdCopyright />FRC 1511 - Rolling Thunder</p>
        </div>
      </div>
    </>
  )
}