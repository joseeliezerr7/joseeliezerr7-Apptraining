# Apptraining

A modern training app — Subsplash-style — built with Expo SDK 51, Expo Router and Supabase.

**iOS · Android · Web** from a single codebase.

App moderna multiplataforma (iOS, Android, Web) con interfaz tipo Subsplash.

**Stack:** Expo SDK 51 + Expo Router (file-based) + React Native + React Native Web + TypeScript + Supabase + i18n (en/es).

## Estructura

```
mobile/
├── app/                          # Expo Router (file-based routing)
│   ├── _layout.tsx               # Auth gate + providers + i18n init
│   ├── (auth)/                   # Login / Register
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (app)/                    # Rutas protegidas (Tabs)
│       ├── _layout.tsx           # Tab bar
│       ├── index.tsx             # Home (featured + categorías + manuales)
│       ├── videos/
│       │   ├── index.tsx         # Lista por categoría con filtros
│       │   ├── [category].tsx    # Videos de una categoría
│       │   └── play/[id].tsx     # Reproductor (expo-video)
│       ├── manuals/
│       │   ├── index.tsx         # Lista con filtro EN/ES
│       │   └── [id].tsx          # Visor de PDF (iframe en web, WebView en mobile)
│       └── profile.tsx           # Perfil + cambio de idioma + sign out
├── components/                   # VideoCard, ManualCard, CategoryTile, UI básicos
├── constants/theme.ts            # Colores, spacing, radius, tipografía
├── lib/
│   ├── supabase.ts               # Cliente Supabase (storage seguro por plataforma)
│   ├── auth.tsx                  # AuthProvider + useAuth
│   ├── api.ts                    # Llamadas a Supabase con fallback a mocks
│   ├── i18n.ts                   # i18next + detección de idioma del SO
│   ├── format.ts                 # formatDuration, formatBytes
│   └── mockData.ts               # Datos de ejemplo para correr sin backend
├── locales/                      # en.json / es.json
├── supabase/schema.sql           # Esquema de DB + RLS + trigger de profile
└── app.json
```

## Setup

```bash
cd mobile
npm install            # o pnpm install / yarn
cp .env.example .env   # edita con tus credenciales de Supabase
```

> Sin `.env` la app arranca igual usando **datos mock** (verás un banner en Home).

### Correr la app

```bash
npm run web        # http://localhost:8081
npm run ios        # requiere Xcode
npm run android    # requiere Android Studio
```

Escanea el QR con la app **Expo Go** para probar en dispositivo físico.

### Builds para producción

```bash
npx eas build --platform ios       # iOS (TestFlight / App Store)
npx eas build --platform android   # Android (Play Store)
npm run build:web                  # bundle web estático en ./dist
```

## Configurar Supabase

1. Crea un proyecto en https://supabase.com.
2. SQL Editor → pega el contenido de `supabase/schema.sql` y ejecuta.
3. Storage → crea 3 buckets **públicos**: `videos`, `thumbnails`, `manuals`.
4. Authentication → Providers → habilita **Email**.
5. Copia `URL` y `anon public key` desde Project Settings → API hacia `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=...
   EXPO_PUBLIC_SUPABASE_ANON_KEY=...
   ```
6. Reinicia `npm run web` / `npm run ios`.

## Funcionalidades incluidas

- **Auth**: email + contraseña con Supabase Auth. Sesión persistida en SecureStore (mobile) y AsyncStorage (web).
- **Registro** con nombre, email, país de procedencia, teléfono (opcional), contraseña. Trigger SQL crea automáticamente la fila en `profiles`.
- **Videos por categoría** con miniatura, duración, resolución y peso del archivo. Reproductor nativo (`expo-video`) con fullscreen y picture-in-picture.
- **Manuales** PDF en inglés y/o español con miniatura, badges de idioma, número de páginas. Visor embebido (iframe en web, WebView en mobile) + botón "Abrir externamente".
- **i18n** completo en inglés/español, detecta el idioma del sistema y permite cambiarlo desde Perfil.
- **Tema oscuro tipo Subsplash**: paleta navy + accent azul, hero cards, tiles de categoría con scrim.
- **Responsive**: el mismo código se ve bien en móvil y en web.

## Próximos pasos sugeridos

- Subir tus assets reales en `assets/images/` (icon, splash, adaptive-icon, favicon — 1024×1024 PNG cada uno).
- Cambiar `bundleIdentifier` y `package` en `app.json` por los tuyos.
- Crear contenido desde el panel de Supabase (Tabla → `video_categories`, `videos`, `manuals`) o construir un panel admin.
- Considerar políticas de Storage para restringir descargas a usuarios autenticados si los manuales son privados.
- Conectar Sentry, analytics, etc.
