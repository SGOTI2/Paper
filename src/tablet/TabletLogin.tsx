import { useContext, useState } from "react";
import BigNumpad from "./BigNumpad";
import { UnifiedStaticData } from "../lib/unifiedStaticData";
import { TabletContext } from "./TabletContext";
import { useNavigate } from "react-router";

export default function TabletLogin() {
  const navigate = useNavigate();

  const [problems, setProblems] = useState<string>();
  const unifiedStaticData = useContext(UnifiedStaticData);
  const tabletState = useContext(TabletContext);


  function login(enteredSID: number) {
    if (!enteredSID) return setProblems("Enter a number please");
    const SINNCT_Data = Object.entries(unifiedStaticData.SINNCT).find(([SID, _]) => Number(SID) == enteredSID)
    if (!SINNCT_Data) return setProblems("No account found");
    tabletState.setSID(Number(SINNCT_Data[0]));
    tabletState.setUsername(SINNCT_Data[1]);
    tabletState.setLastInteraction(new Date());
    navigate("/tablet/home")
  }

  return <div className="p-5 flex flex-col lg:flex-row justify-between items-center h-full xl:mx-32">
    <div>
      <h1 className="text-7xl font-bold mb-3">Quick Login</h1>
      <p className="text-3xl text-gray-500 mb-3">Please enter your student code</p>
      {problems && <p className="bg-red-500 rounded-full py-4 px-5 mb-3 text-xl">{problems}</p>}
    </div>
    <BigNumpad defaultNumber={0} onSubmit={login} />
  </div>
}