# 🎵 Skibidify React Native App

![Demo](https://i.imgur.com/WaC4toT.gif)

---

## 📦 Requisitos

- [Node.js](https://nodejs.org/)
- [API Necesaria](https://github.com/Suprimir/audio-url-resolver-yt-dlp)
- Dispositivo con la app **Expo Go**

---

## 🚀 Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/Suprimir/skibidify-app.git
cd skibidify-app

# 2. Instala dependencias
npm install

# 3. Configura las variables de entorno
# Crea un archivo .env en la raíz del proyecto con:
YOUTUBE_API_KEY=tu_youtube_api_key_aqui
API_BASE_URL=http://tu-servidor.com/api

# 4. Inicia el servidor de desarrollo
npm run start
```

Abre la app **Expo Go** en tu dispositivo móvil y escanea el código QR que aparece en consola o en el navegador.

---

## ⚙️ Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
YOUTUBE_API_KEY=tu_youtube_api_key_aqui
API_BASE_URL=http://tu-servidor/api
```

**Donde obtener:**
- `YOUTUBE_API_KEY`: Obtén tu API key desde [Google Cloud Console](https://console.cloud.google.com/)
- `API_BASE_URL`: URL base donde está hosteada tu [API necesaria](https://github.com/Suprimir/audio-url-resolver-yt-dlp)
