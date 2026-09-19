import { useContext } from "react";
import Version, { obfuscate } from "./Version";
import LivePanel from "./LivePanel";
import { UnifiedStaticData } from "../lib/unifiedStaticData";
import Time from "./Time";
import PartCounter from "./PartCounter";
import { AuthContext } from "../auth/AuthWrapper";
import { Link } from "react-router";
import { fingerprint } from "../auth/Fingerprinting";

import './AuthAlertBackground.css'

export default function PanelAggregator() {
  const authContext = useContext(AuthContext);
  const unifiedStaticState = useContext(UnifiedStaticData);

  const _401 = !authContext.user;
  const _403 = authContext.user && (!authContext.claims?.feedAllow || !authContext.claims?.verified || !authContext.isAllowedThisDevice);

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
        {_403 && !authContext.claims?.isAllowedThisDevice && <p className="pt-3">This <u className="decoration-wavy decoration-1 underline-offset-4 decoration-red-500">device</u> is not allowed to view the live feed</p>}
        <p className="flex flex-col text-xs text-gray-500 mt-3">
          Authority:
          <small className="text-xs text-gray-500">{authContext.user?.uid ?? "Not logged in"}</small>
          <small className="text-xs text-gray-500">{obfuscate(fingerprint)}</small>
        </p>
        {(!authContext.userDataValid || !authContext.claimsDataValid || !authContext.jwtDataValid) && <p className="bg-red-500 p-2 mt-4 w-full text-center text-shadow-lg text-shadow-black authAlert">Authentication is in progress</p>}
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
          <p className="pt-3"><b className="tracking-wide pb-2">Your device's persistent IDB storage is likely mutexed by another tab at this time.</b><br/><br/>To prevent cache and network overuse issues, you are not allowed to view the live panels while another, staler, RPTS tab is open. Close it and then reopen it after reloading this page to facilitate add and watch functionality concurrently.</p>
          <p className="flex flex-col text-xs text-gray-500 mt-3">
            Authority:
            <small className="text-xs text-gray-500">{authContext.user?.uid ?? "Not logged in"}</small>
            <small className="text-xs text-gray-500">{obfuscate(fingerprint)}</small>
          </p>
          {(!authContext.userDataValid || !authContext.claimsDataValid || !authContext.jwtDataValid) && <p className="bg-red-500 p-2 mt-4 w-full text-center text-shadow-lg text-shadow-black authAlert">Authentication is in progress</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 pb-5 flex flex-col h-dvh">
      <div className="flex justify-even px-5">
        <div className="flex-1 pt-5">
          <Time />
        </div>
        <small className="flex-1 text-center text-gray-500 pt-1 hidden lg:block">
          RPTS <Version />
        </small>
        <div className="flex-1 text-right pt-5">
          <h3 className="text-base md:text-xl">Parts</h3>
          <PartCounter />
        </div>
      </div>
      <div className="flex-1 py-5 gap-5 px-5 grid xl:grid-cols-2 grid-cols-1 overflow-scroll h-full">
        {unifiedStaticState.fscn.map((fscn, i) => // TODO: Make it so ya can organzize this
          <LivePanel fscn={fscn} key={i}/>
        )}
      </div>
    </div>
  )
}