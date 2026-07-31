import { createContext, type ReactNode } from "react";
import USDConfig from "../../USD.cfg.ts"

declare const __BUILD_TIME__: string;

type ContextType = {
  subteamMapping: {
    [k: number]: string
  },
  fscn: string[] // FireStore Collection Name - The internal name for a panel feed in the database
  fscnMapping: {
    [fscn: string]: string // FSCN -> Human Text
  } 
}

const providerlessContext: ContextType = {subteamMapping: {}, fscn: [], fscnMapping: {}}

export const UnifiedStaticData = createContext(providerlessContext)

const storedUSDRaw = localStorage.getItem("USDConfig");
const storedUSDVersionRaw = localStorage.getItem("USDConfigVersion");

let USDUsingStored = false;
let StoredData: ContextType | null = null;

if (storedUSDRaw && storedUSDVersionRaw) {
  const storedVersion = parseInt(storedUSDVersionRaw);
  const bakedVersion = parseInt(__BUILD_TIME__);

  if (storedVersion < bakedVersion) {
    localStorage.removeItem("USDConfig");
    localStorage.removeItem("USDConfigVersion");
  } else {
    try {
      StoredData = JSON.parse(storedUSDRaw)
      USDUsingStored = true;
    } catch {
      localStorage.removeItem("USDConfig");
      localStorage.removeItem("USDConfigVersion");
    }
  }
}

export const USDUsingStoredConfig = USDUsingStored;

const data: ContextType = StoredData ?? USDConfig; 

export function UnifiedStaticDataProvider({ children }: { children: ReactNode }) {
  return (
    <UnifiedStaticData value={data}>
      {children}
    </UnifiedStaticData>
  )
}