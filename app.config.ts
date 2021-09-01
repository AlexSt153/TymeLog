import 'dotenv/config';

const { SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN } = process.env;

module.exports = () => {
  return {
    expo: {
      name: 'TymeLog',
      slug: 'TymeLog',
      version: '1.0.1',
      orientation: 'portrait',
      icon: './assets/icon.png',
      splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#002147',
      },
      updates: {
        enabled: true,
        checkAutomatically: 'ON_LOAD',
        fallbackToCacheTimeout: 2000,
      },
      assetBundlePatterns: ['**/*'],
      userInterfaceStyle: 'automatic',
      ios: {
        supportsTablet: true,
        requireFullScreen: false,
        usesIcloudStorage: true,
        config: {
          usesNonExemptEncryption: false,
        },
        infoPlist: {
          UIBackgroundModes: ['location', 'fetch'],
          UISupportsDocumentBrowser: true,
          UIFileSharingEnabled: true,
          LSSupportsOpeningDocumentsInPlace: true,
          NSLocationWhenInUseUsageDescription:
            'In order to use location tracking when using the app',
          NSLocationAlwaysAndWhenInUseUsageDescription:
            'In order to use location tracking when using the app and in background',
          NSLocationAlwaysUsageDescription:
            'In order to use location tracking when app is in background',
        },
        bundleIdentifier: 'com.alexst15.TymeLog',
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './assets/adaptive-icon.png',
          backgroundColor: '#002147',
        },
        permissions: ['READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE'],
        package: 'com.alexst15.TymeLog',
      },
      web: {
        favicon: './assets/favicon.png',
      },
      plugins: ['sentry-expo'],
      hooks: {
        postPublish: [
          {
            file: 'sentry-expo/upload-sourcemaps',
            config: {
              organization: SENTRY_ORG,
              project: SENTRY_PROJECT,
              authToken: SENTRY_AUTH_TOKEN,
            },
          },
        ],
      },
    },
  };
};
