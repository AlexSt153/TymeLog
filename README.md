# TymeLog - work in progress

I'm developing this app only for fun in my freetime.  
Don't expect any fast progress with the mentioned features.

## Roadmap

- Keep track of working hours
- Add background location tracking and geofencing
- Show notifications when leaving areas to add notes
- Encrypt geospatial data
- Sync data to supabase cloud database
- Additional browser support

## Features

- Light/dark mode toggle
- Cross platform

## Requirements

- Node.js / npm
- Yarn
- expo-cli
- Git
- Supabase credentials / secret key (.env file)
- "Expo Go" App, iOS Simulator or Android Emulator

## Quick start

```bash
# Install the command line tools
$ npm install --global expo-cli

# Clone repository
$ git clone https://github.com/AlexSt153/TymeLog.git

# Change directory
$ cd TymeLog

# Install all dependencies
$ yarn

# Starting the development server
$ expo start
```

## .env

```env
SUPABASE_KEY=JWT_SECRET
SUPABASE_URL=<https://xyz.supabase.co>
```
