import { deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export default async function deleteTask(fscn: string, pid: number) {
  await deleteDoc(doc(db!, fscn, pid.toString()));
}