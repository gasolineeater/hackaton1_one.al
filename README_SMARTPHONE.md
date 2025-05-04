# ONE Albania Mobile App - Smartphone Setup Guide

This guide provides detailed instructions for setting up and running the ONE Albania SME Dashboard mobile application on various devices and platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Development Environment Setup](#development-environment-setup)
3. [Running on Android Devices](#running-on-android-devices)
4. [Running on iOS Devices](#running-on-ios-devices)
5. [Building for Production](#building-for-production)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or newer)
- **npm** (v6 or newer) or **yarn** (v1.22 or newer)
- **Git**
- **Expo CLI**: Install globally using `npm install -g expo-cli`

## Development Environment Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/one-albania-mobile.git
   cd one-albania-mobile/OneAlbaniaMobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**:
   ```bash
   npm start
   # or
   yarn start
   ```

   This will start the Expo development server and display a QR code in your terminal.

## Running on Android Devices

### Using a Physical Android Device

1. **Install the Expo Go app** from the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent).

2. **Enable USB Debugging** on your Android device:
   - Go to **Settings > About Phone**
   - Tap **Build Number** 7 times to enable Developer Options
   - Go back to **Settings > System > Developer Options**
   - Enable **USB Debugging**

3. **Connect your device** to your computer using a USB cable.

4. **Run the app** on your connected device:
   ```bash
   npm run android
   # or
   yarn android
   ```

   Alternatively, you can scan the QR code displayed in the terminal with the Expo Go app.

### Using an Android Emulator

1. **Install Android Studio** from the [official website](https://developer.android.com/studio).

2. **Set up an Android Virtual Device (AVD)**:
   - Open Android Studio
   - Go to **Tools > AVD Manager**
   - Click **Create Virtual Device**
   - Select a device definition (e.g., Pixel 4)
   - Select a system image (preferably with Google Play Services)
   - Complete the setup and start the emulator

3. **Run the app** on the emulator:
   ```bash
   npm run android
   # or
   yarn android
   ```

## Running on iOS Devices

> **Note**: iOS development requires a macOS computer.

### Using a Physical iOS Device

1. **Install the Expo Go app** from the [App Store](https://apps.apple.com/app/apple-store/id982107779).

2. **Sign in with the same Expo account** on both your development machine and the Expo Go app.

3. **Run the app** and scan the QR code with your iPhone's camera app, or select your project from the "Projects" tab in the Expo Go app if you're signed in.

### Using an iOS Simulator

1. **Install Xcode** from the [Mac App Store](https://apps.apple.com/us/app/xcode/id497799835?mt=12).

2. **Install iOS Simulator**:
   - Open Xcode
   - Go to **Preferences > Components**
   - Install the iOS Simulator version you need

3. **Run the app** on the simulator:
   ```bash
   npm run ios
   # or
   yarn ios
   ```

## Building for Production

### Android APK

1. **Configure app.json**:
   Ensure your `app.json` has the correct Android package name and version.

2. **Build the APK**:
   ```bash
   npm run build:android
   # or
   yarn build:android
   ```

   This will start the build process on Expo's servers. Once complete, you'll receive a link to download the APK.

### iOS IPA

1. **Configure app.json**:
   Ensure your `app.json` has the correct iOS bundle identifier and version.

2. **Build the IPA**:
   ```bash
   npm run build:ios
   # or
   yarn build:ios
   ```

   This will start the build process on Expo's servers. You'll need an Apple Developer account to complete this process.

## Troubleshooting

### Common Issues and Solutions

1. **"Unable to find module" errors**:
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Metro bundler issues**:
   ```bash
   npm start --reset-cache
   # or
   yarn start --reset-cache
   ```

3. **Android build failures**:
   - Ensure you have the latest Android SDK tools
   - Check that your `app.json` has a valid Android package name

4. **iOS build failures**:
   - Ensure you have the latest Xcode version
   - Check that your `app.json` has a valid iOS bundle identifier

5. **Expo Go app connection issues**:
   - Ensure your mobile device and development machine are on the same network
   - Try using a tunnel connection: `npm start --tunnel`

### Getting Help

If you encounter issues not covered in this guide:

1. Check the [Expo documentation](https://docs.expo.dev/)
2. Search for solutions on [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)
3. Contact ONE Albania support at support@onealbania.al

---

## Device-Specific Requirements

### Android Minimum Requirements

- Android 5.0 (Lollipop) or newer
- 2GB RAM or more
- 100MB free storage space

### iOS Minimum Requirements

- iOS 12.0 or newer
- iPhone 6s or newer
- 100MB free storage space

---

For any questions or support, please contact the ONE Albania development team.
