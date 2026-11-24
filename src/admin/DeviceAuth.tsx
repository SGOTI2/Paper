import { Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';
import CryptoJS from "crypto-js";
import AESPassword from '../auth/aesPassword';
import { obfuscate } from '../panel/Version';
import { addDeviceAuth } from '../lib/networking/addDeviceAuth';

type DeviceQRData = {
  uid: string,
  fingerprint: string,
  username: string
}

export default function DeviceAuth() {
  const [device, setDevice] = useState<DeviceQRData | null>();

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">Authenticate New Device</h1>
      <p className="text-gray-500 mb-2">Scan a device QR code to authorize a new device to view the live feed or run the tablet mode if they have the permissions to do so.</p>
      <p className="font-bold mb-5 bg-gray-800 p-2 rounded w-fit">After authorization the device authorized will need to click "Refresh User Data Cache"</p>
      <div className='flex justify-evenly items-center'>
        <div>
          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-md xl:max-w-xl 2xl:max-w-2xl h-full rounded-xl overflow-hidden">
              <Scanner
                onScan={(result) => {
                  const raw_data = CryptoJS.AES.decrypt(result[0].rawValue, AESPassword);
                  const data = raw_data.toString(CryptoJS.enc.Utf8);
                  const parts = data.split("&&");
                  if (parts.length < 2) return;
                  if (parts[1].match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i) == null) {
                    console.log("UFID failure")
                    return;  
                  }
                  setDevice({
                    uid: parts[0],
                    fingerprint: parts[1],
                    username: parts.slice(2).join(""),
                  })
                  console.log("done")
                }}
                constraints={{
                  facingMode: 'environment',
                  aspectRatio: 1,
                  frameRate: {
                    ideal: 60
                  },
                  noiseSuppression: {
                    ideal: true
                  }
                }}
                components={{
                  finder: false
                }}
                settleDelayMs={0}
                retryDelay={50}
              />
            </div>
          </div>
          <p className='text-center text-xl mt-5'>{AESPassword.slice(-6, -3) + " " + AESPassword.slice(-3)}</p>
        </div>
        {device && (
          <div>
            <h2 className='text-3xl mb-1'>{device.username}</h2>
            <p className='leading-4 mb-3'>
              <small className='text-gray-500'>{device.uid}</small><br/>
              <small className='text-gray-500'>{obfuscate(device.fingerprint)}</small>
            </p>
            <button 
              onClick={async () => {
                await addDeviceAuth(device.uid, device.fingerprint)
                setDevice(undefined);
              }}
              className='text-white p-2 px-3 w-full rounded bg-blue-500 cursor-pointer' 
            >
              Authorize
            </button>
          </div>
        )}
      </div>
    </div>
  );
}