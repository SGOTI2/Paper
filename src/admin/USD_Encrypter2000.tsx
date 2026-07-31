import { useState } from "react";
import { MdDownload, MdFileUpload } from "react-icons/md";
import { RiCertificate2Line } from "react-icons/ri";
import { validateUSDJSON } from "./USD_Creator";
import { cnw } from "../lib/tailwindUtil";
import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha2.js';
ed.hashes.sha512 = sha512;

export default function USD_Encrypter({ text }: { text: string }) {
  const [privateKey, setPrivateKey] = useState<Uint8Array<ArrayBuffer> | null>();
  const [downloadURL, setDownloadURL] = useState<string | null>();
  
  return (
    <div className="mt-4">
      <hr className="mb-4 text-gray-500" />
      <div className="flex gap-3">
        <label htmlFor="upload" className="bg-gray-800 border border-gray-500 rounded p-2 px-4 flex gap-2 items-center cursor-pointer">
          <MdFileUpload size="24" />
          Upload Private Key
          <input type="file" id="upload" className="hidden" onChange={async (e) => {
            const file = e.target.files?.item(0);
            if (!file) return;

            const content = await file.bytes();
            setPrivateKey(content);
          }}/>
        </label>
        <button 
          className="bg-gray-800 border border-gray-500 rounded p-2 px-4 flex gap-2 items-center cursor-pointer disabled:opacity-40 disabled:cursor-auto" 
          onClick={() => {
            if (validateUSDJSON(text)) return;
            if (!privateKey) return;
            const json = JSON.parse(text);
            const msg = new TextEncoder().encode(btoa(JSON.stringify(json)));
            json["signature"] = btoa(String.fromCharCode(...ed.sign(
              msg,
              privateKey!
            )));

            let file = new Blob([btoa(JSON.stringify(json))], {type: "text/plain"});
            setDownloadURL(URL.createObjectURL(file));
          }}
          disabled={!privateKey}
        >
          <RiCertificate2Line size="24" /> Sign
        </button>
        <a 
          className={cnw(
            "bg-gray-800 border border-gray-500 rounded p-2 px-4 flex gap-2 items-center cursor-pointer aria-disabled:opacity-40 aria-disabled:cursor-auto",
          )} 
          href={downloadURL ?? "javascript: void(0);"}
          aria-disabled={!downloadURL}
          download={"USD.CFG"}
        >
          <MdDownload size="24" /> Download USD.CFG
        </a>
      </div>
      <div>
        {privateKey && <p className="font-medium text-green-500 p-0.5">Private key uploaded</p>}
      </div>
    </div>
  )
}