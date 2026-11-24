import { useContext } from "react";
import { TabletContextProvider } from "./TabletContext";
import { UnifiedStaticData } from "../lib/unifiedStaticData";
import { AuthContext } from "../auth/AuthWrapper";
import { Link, Outlet } from "react-router";
import { obfuscate } from "../panel/Version";
import { fingerprint } from "../auth/Fingerprinting";
import TabletAutoLogoutTimer from "./TabletAutoLogoutTimer";

export function TabletGateway() {
  const unifiedStaticState = useContext(UnifiedStaticData);
  const authContext = useContext(AuthContext);

  const _401 = !authContext.user;
  const _403 = authContext.user && (!authContext.claims?.tabletAllowed || !authContext.claims?.verified || !authContext.isAllowedThisDevice);

  if (_401 || _403) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
      <div>
        <div className="flex gap-2">
          <h1 className="text-6xl font-bold tracking-wider">{_401 ? "401" : "403"}</h1>
          <div className="flex flex-col justify-between mt-1">
            <h2 className="text-xl inline-block align-bottom">{_401 ? "Unauthorized" : "Forbidden"}</h2>
            <hr className="border-gray-500"/>
            <Link to={"/"} className="text-blue-400">Return Home</Link>
          </div>
        </div>
        {_403 && !authContext.claims?.isAllowedThisDevice && !!authContext.claims?.tabletAllowed && <p className="pt-3">This <u className="decoration-wavy decoration-1 underline-offset-4 decoration-red-500">device</u> is not allowed to be a tablet, please authroize this device.</p>}
        <p className="flex flex-col text-xs text-gray-500 mt-3">
          Authority:
          <small className="text-xs text-gray-500">{authContext.user?.uid ?? "Not logged in"}</small>
          <small className="text-xs text-gray-500">{obfuscate(fingerprint)}</small>
        </p>
        {(!authContext.authenticationChecked || !authContext.userDataValid || !authContext.jwtDataValid) && <p className="bg-red-500 p-2 mt-4 w-full text-center text-shadow-lg text-shadow-black authAlert">
          Authentication is in progress
          <small className="text-xs">{!authContext.authenticationChecked ? "Awaiting auth response" : (!authContext.jwtDataValid ? "Awiting JWT" : "Awaiting user data response")}</small>
        </p>}
      </div>
    </div>
    )
  } else if (!authContext.cachePersistenceAccessible) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <div className="max-w-96">
          <div className="flex gap-2">
            <h1 className="text-6xl font-bold tracking-wider">423</h1>
            <div className="flex flex-col justify-between mt-1">
              <h2 className="text-xl inline-block align-bottom">Resource Locked</h2>
              <hr className="border-gray-500"/>
              <Link to={"/"} className="text-blue-400">Return Home</Link>
            </div>
          </div>
          <p className="pt-3"><b className="tracking-wide pb-2">Your device's persistent IDB storage is likely mutexed by another tab at this time.</b><br/><br/>To prevent cache and network overuse issues, you are not allowed to view the live panels while another, staler, Paper tab is open. If this is not the case, your browser still not allowing the use of IDB and this page will not function, please attempt to repair it.</p>
          <p className="flex flex-col text-xs text-gray-500 mt-3">
            Authority:
            <small className="text-xs text-gray-500">{authContext.user?.uid ?? "Not logged in"}</small>
            <small className="text-xs text-gray-500">{obfuscate(fingerprint)}</small>
          </p>
          {(!authContext.userDataValid || !authContext.authenticationChecked || !authContext.jwtDataValid) && <p className="bg-red-500 p-2 mt-4 w-full text-center text-shadow-lg text-shadow-black authAlert">Authentication is in progress</p>}
        </div>
      </div>
    )
  }

  return (
    <TabletContextProvider>
      <TabletAutoLogoutTimer />
      {Object.entries(unifiedStaticState.SINNCT).length <= 0 && <h4 className="m-5 p-3 bg-red-500 mb-0">SINNCT is empty! You will not be able to authanticate any users</h4>}
      <Outlet />
    </TabletContextProvider>
  )
}