import { useContext } from "react";
import { pseudoEnumName } from "../../lib/util";
import { TaskPriority, TaskStatus, type Task } from "../../lib/Task";
import LocaleTime from "../../lib/localeTime";
import { UnifiedStaticData } from "../../lib/unifiedStaticData";
import { cnw } from "../../lib/tailwindUtil";

export default function TabletTaskData({ task }: { task: Task & { fscn: string } }) {
  const unifiedStaticState = useContext(UnifiedStaticData);

  return <div>
    <h1 className="text-7xl font-bold mb-3">Comfirm <span style={{ fontFamily: "JetBrains Mono" }}>P{task.part.toString().padStart(3, "0")}</span></h1>
    <p className="text-3xl text-gray-500 mb-3">Make sure that the data below is correct</p>
    <table className="w-full lg:w-lg border border-gray-700 overflow-hidden text-2xl">
      <tbody>
        <tr>
          <td className="border border-gray-700 p-2">Status</td>
          <td 
            className={cnw(
              "border border-gray-700 p-2",
              "bg-red-500/40",    task.status == TaskStatus.NotStarted,
              "bg-green-500/40",  task.status == TaskStatus.InProgress,
              "bg-blue-500/40",   task.status == TaskStatus.Done,
              "bg-yellow-500/40", task.status == TaskStatus.Hold,
              "bg-gray-500/40",   task.status == TaskStatus.Outdated,
            )} 
            style={{ fontFamily: "JetBrains Mono" }}
          >{pseudoEnumName(task.status, TaskStatus)}</td>
        </tr>
        <tr>
          <td className="border border-gray-700 p-2">Name</td>
          <td className="border border-gray-700 p-2" style={{ fontFamily: "JetBrains Mono" }}>{task.name}</td>
        </tr>
        <tr>
          <td className="border border-gray-700 p-2">Machine</td>
          <td className="border border-gray-700 p-2" style={{ fontFamily: "JetBrains Mono" }}>{unifiedStaticState.fscnMapping[task.fscn]}</td>
        </tr>
        <tr>
          <td className="border border-gray-700 p-2">Subteam</td>
          <td className="border border-gray-700 p-2" style={{ fontFamily: "JetBrains Mono" }}>{unifiedStaticState.subteamMapping[task.subteam] ?? "Not Configured"}</td>
        </tr>
        <tr>
          <td className="border border-gray-700 p-2">Priority</td>
          <td className="border border-gray-700 p-2" style={{ fontFamily: "JetBrains Mono" }}>{pseudoEnumName(task.priority, TaskPriority)}</td>
        </tr>
        <tr>
          <td className="border border-gray-700 p-2">Qty</td>
          <td className="border border-gray-700 p-2" style={{ fontFamily: "JetBrains Mono" }}>{task.qty}</td>
        </tr>
        <tr>
          <td className="border border-gray-700 p-2">Due</td>
          <td className="border border-gray-700 p-2" style={{ fontFamily: "JetBrains Mono" }}>{LocaleTime(task.due)}</td>
        </tr>
        <tr>
          <td className="border border-gray-700 p-2">Owner</td>
          <td className="border border-gray-700 p-2" style={{ fontFamily: "JetBrains Mono" }}>{unifiedStaticState.SINNCT[task.owner] ?? (task.owner == -1 ? "Unassigned" : "SID " + task.owner.toString())}</td>
        </tr>
      </tbody>
    </table>
  </div>;
}