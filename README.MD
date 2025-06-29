# 🎵 Skibidify React Native App

![Demo](https://i.imgur.com/WaC4toT.gif)

---

## 📦 Requisitos

### General
- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- [API Necesaria](https://github.com/Suprimir/audio-url-resolver-yt-dlp)

### Para Android
- [Android Studio](https://developer.android.com/studio) (incluye SDK de Android)
- Java Development Kit (JDK) 17
- Variables de entorno configuradas:
  - `ANDROID_HOME`
  - `JAVA_HOME`
- Dispositivo Android o emulador configurado

### Para iOS (solo en macOS)
- [Xcode](https://developer.apple.com/xcode/) (versión 12 o superior)
- Xcode Command Line Tools
- [CocoaPods](https://cocoapods.org/)
- Simulador de iOS o dispositivo físico

---

## 🚀 Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/Suprimir/skibidify-app.git
cd skibidify-app

# 2. Instala dependencias
npm install

# 3. Para iOS (solo en macOS), instala pods
cd ios && pod install && cd ..

# 4. Inicia el servidor Metro
npm run start
```

---

## 🏗️ Buildeo

### Android

```bash
# Desarrollo - en un nuevo terminal
npm run android

# O ejecuta directamente
npx react-native run-android

# Para generar APK de release
cd android
./gradlew assembleRelease
# El APK estará en: android/app/build/outputs/apk/release/

```

### iOS (solo en macOS)

```bash
# Desarrollo - en un nuevo terminal
npm run ios

# O ejecuta directamente
npx react-native run-ios

# Para generar build de release desde Xcode:
# 1. Abre ios/SkibidifyApp.xcworkspace en Xcode
# 2. Selecciona el esquema de Release
# 3. Product > Archive
```

---
