# Sample License Demo (`contoh_implement`)

This is a minimal Node.js/Express application that demonstrates how to integrate with the **License Server** you have in the main project.

## Features
- Activate a license key by forwarding the request to the main server (`http://localhost:3001`).
- Store the activated license locally in `license.json`.
- Verify the stored license (`/check`).
- Access premium content (`/premium`) only when a valid license is present.

## Prerequisites
- The main License Server must be running (default port **3001**). You can start it with:
  ```powershell
  $env:PORT=3001; npm run dev
  ```
- Node.js (v22) and npm installed.

## Setup
```powershell
# Navigate to the example folder
cd "c:/Users/arief/Desktop/experimen with AI/antigravity/lisensi-key-2/contoh_implement"

# Install dependencies
npm install
```

## Running the Demo
```powershell
# Start the demo server (it will listen on port 3003)
node server.js
```
You should see:
```
Sample license app listening on http://localhost:3003
```
Open your browser at <http://localhost:3003> to see the UI.

## Using the Demo
1. **Create a license** in the main admin dashboard (`http://localhost:3001/admin/dashboard`).
   - Go to **Licenses → Create** and note the generated license key.
2. **Activate** the license in the demo:
   - Enter the key in the input field and click **Activate**.
   - The demo will forward the request to the main server. If the key is valid, it will be stored locally.
3. **Access premium content**:
   - After successful activation, the UI will show the premium section.
   - You can also call the endpoint directly:
     ```powershell
     curl.exe -X GET http://localhost:3003/premium
     ```
4. **Check license status**:
   ```powershell
   curl.exe -X GET http://localhost:3003/check
   ```

## Troubleshooting
- **Port conflict**: The demo uses port **3003**. If something else is using it, change the `PORT` variable in `server.js`.
- **Activation fails**: Ensure the license key exists in the main server and that the main server is reachable at `http://localhost:3001`.
- **CORS**: The demo runs on a different port; the main server already allows requests from any origin.

Enjoy experimenting with the license integration!