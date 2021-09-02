import 'dotenv/config';

const { SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN, ANDROID_GOOGLE_MAPS_API_KEY } = process.env;

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
        permissions: [
          'READ_EXTERNAL_STORAGE',
          'WRITE_EXTERNAL_STORAGE',
          'ACCESS_COARSE_LOCATION',
          'ACCESS_FINE_LOCATION',
          'FOREGROUND_SERVICE',
          'RECEIVE_BOOT_COMPLETED',
          'WAKE_LOCK',
        ],
        package: 'com.alexst15.TymeLog',
        config: {
          googleMaps: {
            apiKey: ANDROID_GOOGLE_MAPS_API_KEY,
          },
        },
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
