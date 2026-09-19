import { useContext } from "react";
import { AuthContext } from "../auth/AuthWrapper";
import { fingerprint } from "../auth/Fingerprinting";

declare const __BUILD_TIME__: string;
declare const __GIT_HASH__: string;
declare const __MODIFIED__: string;
declare const __VERSION__: string;

export const obfuscate = (text: string) => {
  return text.split("-").map((v) => v.slice(0, 3) + "*".repeat(v.length - 3)).join("-")
}

export default function Version() {
  const authContext = useContext(AuthContext);

  return (
    <>
      Ver. {__VERSION__} @ {__GIT_HASH__} {__MODIFIED__ != "0" && <span className="bg-blue-500 p-1 rounded text-white">+ {__MODIFIED__} @ {__BUILD_TIME__}</span>}<br/>{authContext.user?.uid}<br/>{obfuscate(fingerprint).replaceAll("*", "")}
    </>
  )
}