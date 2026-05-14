# App icons & splash

Drop these files here before building for stores:

| File | Size | Purpose |
|------|------|---------|
| `icon.png` | 1024×1024 | iOS / Android / Web app icon |
| `adaptive-icon.png` | 1024×1024 | Android adaptive icon foreground (transparent background, keep important content in center ~66%) |
| `splash.png` | 1284×2778 (or 1242×2688) | Launch splash, shown before JS loads |
| `favicon.png` | 48×48 or 192×192 | Web favicon |

Then re-enable them in [`app.json`](../../app.json):

```json
"icon": "./assets/images/icon.png",
"splash": {
  "image": "./assets/images/splash.png",
  "resizeMode": "contain",
  "backgroundColor": "#0B0F1A"
},
"android": {
  "adaptiveIcon": {
    "foregroundImage": "./assets/images/adaptive-icon.png",
    "backgroundColor": "#0B0F1A"
  }
},
"web": {
  "favicon": "./assets/images/favicon.png"
}
```

Quick tools:
- [Expo asset generator](https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/) — uses your icon.png as input and generates all sizes
- [Figma template](https://www.figma.com/community/file/1155362909441341285) — official Expo template
