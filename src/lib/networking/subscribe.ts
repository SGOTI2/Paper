// AND DON'T FORGET TO **SMASH** THAT LIKE BUTTON!!!!!
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import type { Task } from "../Task";
import type { Unsubscribe } from "firebase/database";
import { convertFromDoc } from "./convertDoc";

export default function subscribe(fscn: string, addNewTask: (newTask: Task, del: boolean) => void): Unsubscribe {
  return onSnapshot(collection(db!, "/"+fscn), (docs) => {
    docs.docChanges().forEach((doc) => {
      if (doc.type == "added" || doc.type == "modified") {
        addNewTask(convertFromDoc(doc.doc.data(), doc.doc.id), false);
      } else if (doc.type == "removed") {
        addNewTask({id: doc.doc.id} as Task, true);
      }
    })
  });
}
