import { useContext, useState } from "react";
import BigNumpad from "../BigNumpad";
import GetFullFeed from "../../lib/networking/getFullFeed";
import { UnifiedStaticData } from "../../lib/unifiedStaticData";
import type { Task } from "../../lib/Task";
import { Link } from "react-router";

export default function useTabletGetTask(title: string, desc: string) {
  const unifiedStaticState = useContext(UnifiedStaticData);
  const [task, setTask] = useState<Task & { fscn: string }>();
  const [problems, setProblems] = useState<string>();

  async function findPart(partNumber: number) {
    if (!partNumber) return setProblems("Enter a number please");
    const feedPromises = unifiedStaticState.fscn.map((fscn) =>
      GetFullFeed(fscn, true).then((tasks) => tasks.filter((t) => t && t.part === partNumber).map((v) => {return {fscn: fscn, ...v as Task}}))
    )
    const tasks = (await Promise.allSettled(feedPromises)).flatMap((v) => v.status == "fulfilled" ? v.value : []);
    if (tasks.length !== 0)
      return setTask(tasks[0]);
    
    setProblems("Could not find that part")
  }

  return {
    task: task,
    taskOverlay: <div className="p-5 flex flex-col lg:flex-row justify-between items-center h-full xl:mx-32">
      <div>
        <h1 className="text-7xl font-bold mb-3">{title}</h1>
        <p className="text-3xl text-gray-500 mb-3">{desc}</p>
        {problems && <p className="bg-red-500 rounded-full py-4 px-5 mb-3 text-xl">{problems}</p>}
        <Link to="/tablet/home/" className="mt-3 py-4 bg-blue-500 rounded-xl text-xl px-6 cursor-pointer inline-block">Go Back</Link>
      </div>
      <BigNumpad defaultNumber={0} onSubmit={findPart} />
    </div>
  }
}