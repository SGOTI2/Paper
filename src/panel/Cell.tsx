import { useContext } from "react";
import { TaskPriority, TaskStatus, type Task } from "../lib/Task";
import LocaleTime from "../lib/localeTime";
import { cnw } from "../lib/tailwindUtil";
import { pseudoEnumName } from "../lib/util";
import './cellStyles.css'
import useOverflow from "./useOverflow";
import { UnifiedStaticData } from "../lib/unifiedStaticData";

// DataKey represents the key in `task` that this cell represents
export default function Cell({ task, dataKey }: { task: Task, dataKey: keyof Task }) {
  const { ref, overflowing, overflowingAmount } = useOverflow<HTMLTableCellElement>();
  const unifiedStaticState = useContext(UnifiedStaticData);

  return (
    <td 
      className={cnw(
        "relative border border-gray-700 py-1.5 ps-2 overflow-hidden whitespace-nowrap",
        "bg-red-500/40",   dataKey == "priority" && task.priority == TaskPriority.High,
        "bg-yellow-500/40",dataKey == "priority" && task.priority == TaskPriority.Medium,
        "bg-blue-500/40",  dataKey == "priority" && task.priority == TaskPriority.Low,
        "bg-red-500/40",   dataKey == "status" && task.status == TaskStatus.NotStarted,
        "bg-green-500/40", dataKey == "status" && task.status == TaskStatus.InProgress,
        "bg-blue-500/40",  dataKey == "status" && task.status == TaskStatus.Done,
        "bg-yellow-500/40",dataKey == "status" && task.status == TaskStatus.Hold,
        "bg-gray-500/40",  dataKey == "status" && task.status == TaskStatus.Outdated,
        "line-through", task.status == TaskStatus.Outdated,
        "opacity-20", ([TaskStatus.Outdated, TaskStatus.Done, TaskStatus.Hold] as number[]).includes(task.status),
        "seeMe", task.priority == TaskPriority.Urgent || (task.due < new Date() && ([TaskStatus.InProgress, TaskStatus.NotStarted] as number[]).includes(task.status)),
      )} 
      ref={ref}
    >
      <span 
        className={cnw(
          "top-1.5", 
          "marquee", overflowing
        )} 
        style={{
          "--overflow": `${overflowingAmount}px`,
          "--duration": `${Math.pow(overflowingAmount,0.6)/10}s`
        } as React.CSSProperties}
      >
        {(() => {
          if (dataKey == "status")        return pseudoEnumName(task[dataKey], TaskStatus);
          else if (dataKey == "priority") return pseudoEnumName(task[dataKey], TaskPriority);
          else if (dataKey == "due")      return LocaleTime(task[dataKey]);
          else if (dataKey == "part")     return `P${task[dataKey].toString().padStart(3, "0")}`;
          else if (dataKey == "subteam")  return unifiedStaticState.subteamMapping[task[dataKey]] ?? "Not Configured";
          else if (dataKey == "owner")    return unifiedStaticState.SINNCT[task[dataKey]] ?? (task[dataKey] == -1 ? "Unassigned" : "SID " + task[dataKey].toString());
          else return task[dataKey].toString()
        })()}
      </span>
    </td>
  )
}