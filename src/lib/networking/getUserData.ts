import { doc, getDocFromCache, getDocFromServer, FirestoreError } from "firebase/firestore";
import { db } from "./firebase";

export type UserData = {
  allowedDevices: string[]
}

export type UserDataWithCacheStatus = UserData & {
  cachePersistenceAccessible: boolean
}

export async function getUserData(userId: string, forceRefresh: boolean = false): Promise<UserDataWithCacheStatus | undefined> {
  const userDocQuery = doc(db!, "/users/" + userId);
  let cachePersistenceAccessible = true; // We care because the live panel page doesn't work if cache is missed / it uses too many resources to not cache the data
  if (!forceRefresh) {
    try {
      let userData = await getDocFromCache(userDocQuery);
      if (userData.exists()) return {...userData.data() as UserData, cachePersistenceAccessible: true};
    } catch (e: any) {
      if ((e as FirestoreError).code == "failed-precondition" || (e as FirestoreError).code == "unavailable") {
        cachePersistenceAccessible = false;
        console.log("=== CACHE TO MISS ===")
      }
    }
  }

  let userData = await getDocFromServer(userDocQuery);
  if (userData.data()) {
    return {...userData.data() as UserData, cachePersistenceAccessible: cachePersistenceAccessible};
  }
}