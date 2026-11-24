import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { TaskData } from "./sendTask";

export type QuickTaskData = {
  owner?: number,
  status?: number,
  pid: number,
}

export async function quickUpdateTask(fscn: string, data: QuickTaskData) {
  await updateDoc(doc(db!, fscn, data.pid.toString()), data);
}

export async function fullUpdateTask(fscn: string, data: TaskData) {
  await updateDoc(doc(db!, fscn, data.pid.toString()), data);
}