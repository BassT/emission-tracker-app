# Development

- Set `extra.apiBaseUrl` in `app.config.js` to desired env var from `.env` file
- Start development server with `npm start`

# Publishing for testing

- Update `version` in `app.config.js`
- Increment `android.versionCode` in `app.config.js`
- Run `eas build --platform android --profile testing`
- Wait for build process to finish
- Download Android App Bundle from (expo.dev)[https://expo.dev]
- Create testing release on (Google Play Console)[https://play.google.com/console]

# Publishing for production

- Update `version` in `app.config.js`
- Optional: Increment `android.versionCode` in `app.config.js`
- Run `eas build --platform android --profile production`
- Wait for build process to finish
- Download Android App Bundle from (expo.dev)[https://expo.dev]
- Create release on (Google Play Console)[https://play.google.com/console]
 