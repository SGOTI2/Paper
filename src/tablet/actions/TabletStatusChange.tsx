import { useContext, useState } from "react";
import useTabletGetTask from "./useTabletGetTask";
import TabletTaskData from "./TabletTaskData";
import { cnw } from "../../lib/tailwindUtil";
import { quickUpdateTask } from "../../lib/networking/updateTask";
import { TabletContext } from "../TabletContext";
import { TaskStatus } from "../../lib/Task";
import type { FirestoreError } from "firebase/firestore";
import { useNavigate } from "react-router";
import { separateByCamelCase } from "../../lib/util";

const statusOptions = Object.keys(TaskStatus).map((v) => separateByCamelCase(v));

export default function TabletStatusChange() {
  const navigate = useNavigate();

  const tabletContext = useContext(TabletContext);

  const [comfirmed, setComfirmed] = useState<boolean | null>(null);
  const [status, setStatus] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);
  const [problems, setProblems] = useState<string | null>(null);
  
  async function changeStatus() {
    if (!(comfirmed === true && status !== -1) || !task || loading) {
      return;
    }
    setLoading(true);
    try {
      await quickUpdateTask(task?.fscn, {
        pid: task.part,
        owner: tabletContext.SID,
        status: status
      })
    } catch (e: any) {
      if ((e as FirestoreError).code == "not-found") {
        setProblems("That part number does not exist for the selected manufacturer")
      } else {
        setProblems((e as FirestoreError).code);
      }
      setLoading(false);
      return;
    }
    setLoading(false);
    navigate("/tablet/home")
  }
  
  const { task, taskOverlay } = useTabletGetTask("Change Part Status", "Please Input the Part ID");
  if (!task) return taskOverlay;

  return <div className="p-5 flex flex-col lg:flex-row justify-between items-center h-full xl:mx-32">
    <TabletTaskData task={task} />
    <div>
      <h4 className="text-4xl font-semibold mb-3">Is the Part Correct?</h4>
      <div className="flex gap-3">
        <button className={cnw("p-3 bg-red-500 rounded-xl text-2xl font-bold px-6 cursor-pointer", "opacity-45", comfirmed !== false)} onClick={() => setComfirmed(false)}>No</button>
        <button className={cnw("p-3 bg-green-500 rounded-xl text-2xl font-bold px-6 cursor-pointer", "opacity-45", comfirmed !== true)} onClick={() => setComfirmed(true)}>Yes</button>
      </div>
      <h4 className="text-4xl font-semibold mb-3 mt-12">What's the Status?</h4>
      <div className="flex gap-3">
        {statusOptions.map((option, index) => (
          <button 
            className={cnw(
              "p-3 bg-blue-500 rounded-xl text-2xl font-bold px-6 cursor-pointer", 
              "opacity-45", status !== index,
              "bg-red-500",    index == TaskStatus.NotStarted,
              "bg-green-500",  index == TaskStatus.InProgress,
              "bg-blue-500",   index == TaskStatus.Done,
              "bg-yellow-500", index == TaskStatus.Hold,
              "bg-gray-500",   index == TaskStatus.Outdated,
            )} 
            onClick={() => setStatus(index)}
          >
            {option}
          </button>
        ))}
      </div>
      <button className="mt-10 p-4 bg-blue-500 rounded-xl text-2xl font-bold px-6 w-full cursor-pointer flex justify-center items-center disabled:opacity-45" disabled={comfirmed !== true || status === -1 || loading} onClick={changeStatus}>
        {loading ? (
          <svg
            className="ml-3 h-5 w-5 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-20"
            />
            <path
              fill="currentColor"
              d="M22 12a10 10 0 00-10-10v4a6 6 0 016 6h4z"
            />
          </svg>
        ) : "Update"}
      </button>
      {problems && <p className="bg-red-500 rounded-full py-4 px-5 mt-3 text-xl">{problems}</p>}
    </div>
  </div>;
}