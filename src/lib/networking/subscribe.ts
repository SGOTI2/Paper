// AND DON'T FORGET TO **SMASH** THAT LIKE BUTTON!!!!!
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import type { Task } from "../Task";
import type { Unsubscribe } from "firebase/database";
import { convertFromDoc } from "./convertDoc";

export default function subscribe(fscn: string, addNewTask: (newTask: Task) => void): Unsubscribe {
  return onSnapshot(collection(db!, "/"+fscn), (docs) => {
    docs.docs.forEach((doc) => {
      if (!doc.exists() || !doc.data()) {
        console.error("Empty snapshot update")
        return;
      }
      addNewTask(convertFromDoc(doc.data(), doc.id));
    })
  });
}
