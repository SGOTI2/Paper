import config from "@staticConfig";
import { initializeApp } from "firebase/app";
import { CACHE_SIZE_UNLIMITED, disableNetwork, enableNetwork, initializeFirestore, persistentLocalCache } from "firebase/firestore";

// The app doesn't fucking work at all if you don't setup firebase, its like 20 clicks and a copy paste into a new file; I can't be bothered to make a tutorial because I don't think anyone but our team will want to use this, but if you want to, lmk
export const isValidated = config.apiKey != "unconfigured"; 

const app = isValidated ? initializeApp(config) : null;
const db = app ? initializeFirestore(app, {
  localCache: persistentLocalCache({
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  })}) : null;

if (Object.keys(config).includes("enableNetworking") && db) {
  if (!config.enableNetworking) disableNetwork(db)
  else enableNetwork(db)
}

export {app, db}