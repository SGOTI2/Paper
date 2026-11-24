import { useContext, useState } from "react"
import USD_Encrypter from "./USD_Encrypter2000.tsx";
import { UnifiedStaticData } from "../lib/unifiedStaticData.tsx";

function sameElements<T>(a: Array<T>, b: Array<T>): boolean {
  return (
    a.length === b.length &&
    [...a].sort().every((v, i) => v === [...b].sort()[i])
  );
}

function objectConformsTo(value: unknown, keyIsInt: boolean): value is Record<number | string, string> {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return Object.entries(value).every(([key, val]) =>
    (keyIsInt ? Number.isInteger(Number((key))) : typeof key === "string") && typeof val === "string"
  );
}

function arrayConformsTo(value: unknown): value is Array<string> {
  if (!(value instanceof Array) || value === null) {
    return false;
  }

  return value.every((value) =>
    typeof value === "string"
  );
}

function matchesKeys(
  expectedKeys: readonly string[],
  obj: Record<string, string>
): boolean {
  const objKeys = Object.keys(obj);

  if (objKeys.length !== expectedKeys.length) {
    return false;
  }

  return expectedKeys.every(key => Object.hasOwn(obj, key));
}


export function validateUSDJSON(text: string): string | undefined {
  let json: {[e: string]: any} | null = null;
  try {
    json = JSON.parse(text)
  } catch (e: any) {
    if (e instanceof SyntaxError) {
      return `Bad JSON! ${e.message}`
    }
    return `Error! ${e}`
  }
  if (!json) return "Something's wrong here";
  if (!sameElements(Object.keys(json), ["subteamMapping", "fscn", "fscnMapping", "SINNCT"])) return "You have something wrong with your keys, only 'subteamMapping', 'fscn', 'fscnMapping' and 'SINNCT' are allowed";
  if (!objectConformsTo(json["subteamMapping"], true)) return "subteamMapping is supposed to be an object of type [key: int]: string (int wrapped in quotes b/c json is stupid)";
  if (!arrayConformsTo(json["fscn"])) return "FSCN is supposed to be an array of strings";
  if (!objectConformsTo(json["fscnMapping"], false)) return "subteamMapping is supposed to be an object of type [key: string]: string";
  if (!matchesKeys(json["fscn"], json["fscnMapping"])) return "Each FSCN must have exactly one fscnMapping entry and vice versa";
  if (!objectConformsTo(json["SINNCT"], true)) return "SINNCT is supposed to be an object of type [key: int]: string (int wrapped in quotes b/c json is stupid)";
}


export default function UnifiedStaticDataCreator() {
  const unifiedStaticState = useContext(UnifiedStaticData);
  const [text, setText] = useState(JSON.stringify(unifiedStaticState, null, 2));
  const [problems, setProblems] = useState<string | null>();

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">USD Creator</h1>
      <p className="text-gray-500 mb-2">Create a temporary Unified Static Data config file for data synchronization</p>
      <textarea 
        className="resize bg-gray-800 p-3 border border-gray-500 rounded max-w-full w-full h-96" 
        onChange={(e) => {
          const text = e.target.value;
          setText(text)
          setProblems(validateUSDJSON(text) ?? null)
        }}
        value={text}
      />
      {problems && <p className="text-red-500 font-bold">{problems}</p>}
      <p className="text-gray-500 my-2">FSCN or FireStore Collection Name, corresponds with database tables and are directly related to how users interface with the database. Adding a new entry will add a new table to your database when someone adds a task to it. The mapping is used to convert the internal database name to a more human readable name for dropdowns and table headings in the live panel. Subteam mappings are essentially just a list of subteams that are present on your team and are available to chose from in dropdowns and will appear with that name on the live panel; numbers do not necessarily need to be sequential. Do not modify SINNCT, use the dedicated manager for more information and to update it.</p>
      <USD_Encrypter text={text} />
    </div>
  )
}