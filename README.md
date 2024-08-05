# MassEnergize Community App
This repository contains the code for the MassEnergize community app, a mobile companion to the Massenergize community portal. The app mirrors the functionality of the web portal using the React Native framework. This project is currently under ongoing development.

## Getting started
Follow the instructions below to run the app on a simulator on your local machine for testing and development. The following instructions are for Mac users targeting the iOS simulator. Further instructions will be added as needed.

### 0. Set up the local MassEnergize API
Follow the instructions in the [Installing Local API and Database](https://docs.google.com/document/d/1212Ey3aOFSaMUJLTYaKSdv8rgRwRAKSL5srkluL6EgQ/edit#heading=h.3y8wn25kqint) guide to run the backend API on your own 

### 1. Clone the repository
Navigate to the directory where you want the code to be installed and clone the repository with `git clone massenergize/massenergize-mobile-application`.

### 2. Install required software
#### a. Node and Node Package Manager (`npm`)
Node is a JavaScript runtime used to run the app and npm is its package manager, used to install and run external libraries used in the app.

Check for an existing verions using `node -v`. If none exists, install using `brew install node`.

#### b. XCode
XCode is an IDE used specifically for development targeting Apple operating systems, including iOS. It will be used to run the iPhone simulator and install the app.

XCode can be found on the Mac App Store.

### 3. Installing libraries
#### a. Install Node modules
In the project root directory, run `npm install` to install the required modules.

#### b. Installing CocoaPods
CocoaPods is a package manager which we will use to install iOS specific packages.

Check for a Ruby installation using `ruby -v`. If none is found, install it with `brew install ruby`.

With Ruby installed, install CocoaPods with `sudo gem install cocoapods`.

Finally, navigate to the `ios` directory and install the required pods using `pod install`.

### 4. Additional and modified files
#### a. `GoogleService-Info.plist`
Obtain a copy of the appropriate `GoogleService-Info.plist` file from either the project's Firebase Console, the [MassEnergize Slack](https://massenergize.slack.com/files/U071D8926HW/F0778NZPP1C/googleservice-info.plist), or by contacting one of the contributors to this repository. Add the file to `ios` directory.

#### b. `config.json`
Open [app/api/config.json](app/api/config.json) and change `IS_LOCAL` to `true` and both other options to `false`:
```json
{
  "IS_LOCAL": true,
  "IS_PROD": false,
  "IS_CANARY": false,
  "BUILD_VERSION": "X.X.X"
}
```

### 5. Run the app
Run the app by running `npm start` in the project root directory and pressing `i` when prompted.

That's it! Please reach out to [William Soylemez](mailto:will.soylemez@massenergize.org) or [Moizes Almeida](mailto:moizes.almeida@massenergize.org) by email or Slack with any questions.

## Switching between dev and prod backend
The instructions above will configure the app to use the developer (local) backend. To use the production backend, follow these steps:

### 1. Update `config.json`
Switch the API config to use the Canary (or Prod) API:
```json
{
  "IS_LOCAL": false,
  "IS_PROD": false,
  "IS_CANARY": true,
  "BUILD_VERSION": "X.X.X"
}
```

### 2. Update `GoogleService-Info.plist`
Replace the contents of [ios/GoogleService-Info.plist](ios/GoogleService-Info.plist) with a production version that can be found in the ME slack [here](https://massenergize.slack.com/files/UMXEAL7QB/F074K1M3YCV/googleservice-info.plist) or by reaching out to a ME team member.

### 3. Update url scheme in XCode
Open the updated `GoogleService-Info.plist` and copy the value under `REVERSED_CLIENT_ID`.
Open XCode and click on the project in the left-hand navigator. Ensure the correct project is picked under "targets" then navigate to "info" and open "URL Types". Replace the value in "URL Schemes" with the ID you just copied from `GoogleService-Info.plist`.

### 4. Copy the Firebase client id into Info.plist
Copy the Firebase client ID, the last section of the `REVERSED_CLIENT_ID` from the section above, into the first section of the `GIDClientID` field of [ios/MassenergizeAppV2/Info.plist](ios/MassenergizeAppV2/Info.plist).

### 5. Copy the Firebase client Id into rootwrapper
Lastly, open [app/pages/RootWrapper.js](app/pages/RootWrapper.js) and update the lines under `GoogleSignIn.Configure` with the same part of the `REVERSED_CLIENT_ID` as the last step:
```js
GoogleSignin.configure({
  webClientId:
    '*YOUR_CLIENT_ID*.apps.googleusercontent.com',
});
```

With that, the app should use the production backend. Please reach out to [William Soylemez](mailto:will.soylemez@massenergize.org) with questions!

-----------------------------------------------
This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).