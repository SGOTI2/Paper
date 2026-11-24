import { collection, getDocs, getDocsFromCache, query } from "firebase/firestore";
import { db } from "./firebase";
import { convertFromDoc } from "./convertDoc";

export default async function GetFullFeed(fscn: string, usingCache: boolean = false) {
  console.log("req")
  const query_ = query(collection(db!, "/"+fscn));
  const docs = usingCache ? await getDocsFromCache(query_) : await getDocs(query_);

  if (docs.empty) {
    console.log("No docs for fscn:", fscn)
    return []
  }

  return docs.docs.map((doc) => {
    if (!doc.exists()) {
      console.log("A doc didn't exist? When doing a full feed refresh");
      return;
    }
    return convertFromDoc(doc.data(), doc.id);
  })
}