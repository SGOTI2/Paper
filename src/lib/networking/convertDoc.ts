import type { DocumentData } from "firebase/firestore";
import type { Task, TaskPriority, TaskStatus } from "../Task";

export function convertFromDoc(doc: DocumentData, id: string): Task {
  return {
    status: doc["status"] as TaskStatus,
    name: doc["name"] as string,
    subteam: doc["subteam"] as number,
    priority: doc["priority"] as TaskPriority,
    part: doc["pid"] as number,
    qty: doc["quantity"] as number,
    due: doc["due"].toDate() as Date,
    id: id,
    owner: doc["owner"] as number ?? -1
  };
}