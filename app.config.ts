// Set API_BASE_URL env var for local development
if (!process.env.API_BASE_URL) {
  // process.env.API_BASE_URL = "http://192.168.0.83:3000/api/transport-activity";
  process.env.API_BASE_URL = "https://emission-tracker-api-test.azurewebsites.net/api/transport-activity";
  // process.env.API_BASE_URL = "https://emission-tracker-api.azurewebsites.net/api/transport-activity";
}

const version = "1.0.0";

export default {
  name: "emission-tracker-app",
  slug: "emission-tracker-app",
  scheme: "emission-tracker-app",
  version: process.env.VERSION_SUFFIX ? `${version}${process.env.VERSION_SUFFIX}` : version,
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#1C5C5B",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#1C5C5B",
    },
    package: process.env.ANDROID_PACKAGE,
    versionCode: 4,
    permissions: [],
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  description: "",
  extra: {
    apiBaseUrl: process.env.API_BASE_URL,
  },
};
