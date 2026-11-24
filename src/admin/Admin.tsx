import { Link } from "react-router";

export default function Admin() {
  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">Administration</h1>
      <p className="text-gray-500 mb-5">This will allow you to access some functions not otherwise available to the rest of the team, admin/manager.py will allow you to modify access permissions for users other than device authorization.</p>
      <Link to="/admin/deviceAuth" className="text-white p-2 px-3 rounded bg-blue-500 block w-fit">Authorize New Device</Link>
      <Link to="/admin/USD_Creator" className="text-white p-2 px-3 rounded bg-blue-500 block w-fit mt-3">Create USD Config File</Link>
      <Link to="/admin/SINNCTManagement" className="text-white p-2 px-3 rounded bg-blue-500 block w-fit mt-3">SINNCT Management</Link>
    </div>
  )
}