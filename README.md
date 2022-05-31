<p align="center">
  <img width="400px" src="https://github.com/BassT/emission-tracker-app/blob/master/assets/google%20play%20store%20listing/feature%20graphic%20only%20name.png">
</p>

<p align="center">
  <a href='https://play.google.com/store/apps/details?id=de.strangeloop.emissiontracker&utm_source=github&utm_campaign=emission-tracker-app&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
    <img alt='Get it on Google Play' width="200px" src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'/>
  </a>
</p>

Repository of the emission tracker mobile app. Built with Expo, TypeScript and common libraries from the React Native ecosystem.

# Getting started

Install dependencies

`npm install`

Run the app

`npm start`

# Development

The following libraries are used for development:

- [react-native-paper](https://github.com/callstack/react-native-paper) as UI component library
- [react-navigation](https://github.com/react-navigation/react-navigation) for app navigation
- [prettier](https://github.com/prettier/prettier) for code formatting
- [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) for code linting
- [jest-expo](https://github.com/expo/expo/tree/main/packages/jest-expo) for testing

## Local development

By default, the API of the test environment is used.

## Authentication

User authentication is implemented using [Azure AD B2C](https://docs.microsoft.com/en-us/azure/active-directory-b2c/) identity management service.

# Publishing

## For test release

- Update `version` in `app.config.js`
- Increment `android.versionCode` in `app.config.js`
- Run `eas build --platform android --profile testing`
- Wait for build process to finish
- Download Android App Bundle from [expo.dev](https://expo.dev)
- Create testing release on [Google Play Console](https://play.google.com/console)

## For production release

- Update `version` in `app.config.js`
- Optional: Increment `android.versionCode` in `app.config.js`
- Run `eas build --platform android --profile production`
- Wait for build process to finish
- Download Android App Bundle from [expo.dev](https://expo.dev)
- Create release on [Google Play Console](https://play.google.com/console)
