# How to Test Safe-Area (Notch) Fixes and Build the App

There are three ways to test your mobile "safe-area" (notch) fixes, depending on whether you want to check them on your computer, as a PWA on your phone, or build the actual Android APK.

### 1. The Quickest Way: Test on Your Computer (Chrome DevTools)

Yes, you need to use `npm run dev` first.

1. Open your terminal in VS Code and run:
   ```bash
   npm run dev
   ```
2. Open **Google Chrome** and go to `http://localhost:3000`.
3. Press **F12** to open Developer Tools.
4. Click the **"Device Toggle Toolbar"** icon (it looks like a small phone next to the "Elements" tab, or press `Ctrl + Shift + M`).
5. From the dropdown at the top, select a device with a notch (like **iPhone 14 Pro**).
6. **Important:** Click the 3 dots in the top-right corner of the device toolbar and select **"Show device frame"**. This will show the notch and simulate the system status bar. You will see the new padding keeping your navigation and header perfectly safe!

---

### 2. The Best Way: Test as a "PWA" directly on your Phone

To see the app working like a real app on your actual phone without building an APK:

1. Find your computer's local Wi-Fi IP address (Run `ipconfig` in your VS Code terminal and look for `IPv4 Address`, e.g., `192.168.1.99`).
2. Run Next.js so it's accessible on your network:
   ```bash
   npm run dev -- -H 0.0.0.0
   ```
3. Connect your Android or iPhone to the **same Wi-Fi** as your computer.
4. Open Chrome (or Safari) on your phone and go to: `http://[your-ip-address]:3000` (e.g., `http://192.168.1.99:3000`).
5. **The Magic Step:** Tap the browser's menu (3 dots) and select **"Add to Home screen"**.
6. Close the browser, go to your phone's home screen, and tap the new **Tool Rental** icon. It will open in full-screen "Standalone App" mode—the system bar will be handled perfectly by our new fixes!

---

### 3. How to build the Actual Android APK (.apk file)

Your project is already set up with Capacitor (a tool that converts web apps to mobile apps). To generate the actual `.apk` file:

1. Build the production files by running:
   ```bash
   npm run build
   ```
   *(Note: Ensure you fix any TypeScript/linting errors if `next build` fails)*
2. Sync the built files into your Android folder (This passes the latest web code into the native Android shell):
   ```bash
   npm run cap:sync
   ```
3. Open the Android project in Android Studio (Make sure Android Studio is installed on your computer):
   ```bash
   npm run cap:open
   ```
4. **Get the APK:** Once Android Studio finishes loading (it will take a minute or two to sync Gradle):
   * **To test it:** Click the **Green ▷ Play Button** at the top right to run it on an emulator or an Android device connected via USB.
   * **To generate the `.apk` file:** Go to the top menu, click **Build > Build Bundle(s) / APK(s) > Build APK(s)**. 
   * Once it's done, Android Studio will show a pop-up in the bottom right corner with a "locate" link to open the folder containing your brand new `.apk` file. You can usually find it under `android/app/build/outputs/apk/debug/app-debug.apk`.