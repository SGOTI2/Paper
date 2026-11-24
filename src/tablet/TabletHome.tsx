import { useContext } from "react";
import { TabletContext } from "./TabletContext";
import { Link } from "react-router";

export default function TabletHome() {
  const tabletState = useContext(TabletContext);

  return <div className="p-10 h-full grid lg:grid-cols-2 gap-6">
    <div className="h-48 place-self-end w-full">
      <h1 className="text-7xl font-bold mb-3">Hello {tabletState.username}</h1>
      <p className="text-3xl text-gray-500 mb-3">What would you like to do?</p>
      <button className="p-4 bg-red-500 rounded-xl text-xl px-6 cursor-pointer" onClick={tabletState.logout}>Logout</button>
    </div>
    <Link to="/tablet/actions/claim" type="button" className="border border-gray-700 rounded-xl p-6 flex flex-col justify-center h-48 place-self-end w-full">
      <h3 className="text-5xl font-bold pb-2">Claim a Part</h3>
      <p className="text-gray-400 text-xl">Assign yourself to start working on a part. You will be asked for the part number.</p>
    </Link>
    <Link to="/tablet/actions/status" type="button" className="border border-gray-700 rounded-xl p-6 flex flex-col justify-center h-48 place-self-start w-full">
      <h3 className="text-5xl font-bold pb-2">Change Part Status</h3>
      <p className="text-gray-400 text-xl">Change the status of a part. Mark as Hold, In Progress, Complete, or Not Started</p>
    </Link>
    <Link to="/tablet/actions/lookup" type="button" className="border border-gray-700 rounded-xl p-6 flex flex-col justify-center h-48 place-self-start w-full">
      <h3 className="text-5xl font-bold pb-2">Lookup a Part</h3>
      <p className="text-gray-400 text-xl">See what the status of a particular part is.</p>
    </Link>
  </div>
}