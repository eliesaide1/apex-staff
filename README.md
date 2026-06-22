# apex-staff

The **staff** mobile app for Apex — React Native (Expo), iOS + Android from one
codebase. Used by teachers, supervisors, nurses, counselors, and admins. It
talks to the **single shared backend** (see the root
[`README.md`](../README.md)) and imports everything UI/networking from
[`@apex/shared`](../shared/README.md). See [`CONVENTIONS.md`](../CONVENTIONS.md)
for the cross-stream contract.

## Stack
- **React Native + Expo**, TypeScript.
- React Navigation (native-stack + bottom-tabs).
- Bilingual **EN/AR with RTL** via `@apex/shared` i18n.
- All UI built from **`AP_` components** in `@apex/shared`.
- All networking through the shared **`clientProxy`** (single entry point);
  screens never call axios directly.
- Role-aware UI (`src/roles.ts`) — the 7 roles share one codebase; views adapt
  to the role in the JWT.

## Layout
```
App.tsx                 bootstrap: init i18n, init clientProxy, AuthProvider, nav
src/
  config.ts             API_BASE_URL (EXPO_PUBLIC_API_URL ?? localhost:3000/api)
  roles.ts              role definitions + per-role navigation/visibility
  api/                  typed endpoint wrappers over clientProxy + dev mocks
  navigation/           RootNavigator, AuthContext wiring, route types
  i18n/strings.ts       EN/AR dictionary for this app
  screens/              Today, Login, Students, Classes, Incidents, Nurse,
                        Meetings, Notifications, Settings
```

## Networking
Same single backend as the parent app. `initClientProxy({ baseURL })` at
bootstrap; the shared interceptor injects the JWT + drives the global loader;
`clientProxy` unwraps `{success,data}` and raises one global alert from
`error.message`/`error.messageAr` on failure. Ships with the offline **mock
adapter** enabled — point `EXPO_PUBLIC_API_URL` at the live backend and disable
mocks to go live.

## Run
```bash
npm install
npm run typecheck     # tsc --noEmit (also typechecks @apex/shared)
npm start             # expo start — i (iOS) / a (Android) / w (web)
```
