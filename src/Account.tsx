import { useContext } from "react";
import Logout from "./auth/Logout";
import ReloadData from "./auth/ReloadData";
import SignIn from "./auth/SignIn";
import { AuthContext } from "./auth/AuthWrapper";
import { MdCheckCircle, MdClose } from "react-icons/md";
import { cnw } from "./lib/tailwindUtil";
import { fingerprint } from "./auth/Fingerprinting";
import { obfuscate } from "./panel/Version";
import { Link } from "react-router";
import DeviceQR from "./auth/DeviceQR";
import { USDUsingStoredConfig } from "./lib/unifiedStaticData";

export default function Account() {
  const authContext = useContext(AuthContext);

  return (
    <div className="flex-1 p-5">
      <div className="flex justify-between flex-col md:flex-row items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-wide">
            Account Management
          </h2>
          {authContext.user &&
            <h4 className={cnw(
              "text-red-500 inline-flex gap-1 items-center mt-1 text-lg",
              "text-green-500!", !!authContext.claims?.verified
            )}>{!!authContext.claims?.verified ?
              <>Verified <MdCheckCircle /></> :
              <>Unverified <MdClose /></>}
            </h4>}
        </div>
        <div>
          <p className="text-xs text-gray-500 md:text-end">
            {authContext.user?.uid ?? "Not logged in"}<br/>
            {obfuscate(fingerprint)}<br/>
            {authContext.claims?.verified ? 1 : 0}
            {authContext.claims?.feedAllow ? 1 : 0}
            {authContext.isAllowedThisDevice ? 1 : 0}
            {USDUsingStoredConfig ? 1 : 0}
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <p>I can't be bothered to make 3 different pages for a proper login flow, you figure it out</p>
        <SignIn />
        <Logout />
        <ReloadData />
        <div className="inline-flex">
          <Link to="/USD_Patcher" className="text-black p-2 px-3 rounded bg-white">USD Patcher</Link>
        </div>
        {!!authContext.claims?.admin && (
          <div className="inline-flex">
            <Link to="/admin" className="text-white p-2 px-3 rounded bg-red-500">To Admin</Link>
          </div>
        )}
        {authContext.user && (
          <div className="inline-flex">
            <div className="bg-white p-5 pt-3 rounded origin-bottom-left rotate-90 -translate-y-full md:translate-y-0 md:rotate-0">
              <DeviceQR />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}