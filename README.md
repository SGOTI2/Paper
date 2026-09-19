# Paper - Robotics Part Tracking System
### Setup
```zsh
npm i
npm run generate-keys
cp USD.cfg.default.ts USD.cfg.ts
cp config.default.ts config.local.ts
python3 -m venv ./admin
source ./admin/bin/activate
pip install -r ./admin/requirements.txt
# Now copy and paste './config.local.ts' (firebase app config) && './admin/credential.enc' (firebase admin credentials)
python3 ./admin/encrypter2000.py # Save the key in a safe spot
npm run dev
```