import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  configureI18n,
  configureTheme,
  STAFF_BRAND,
  initClientProxy,
  AP_Alert,
  AP_Loader,
  AP_Toast,
} from '@apex/shared';
import { strings } from './src/i18n/strings';
import { API_BASE_URL } from './src/config';
import { AuthProvider } from './src/navigation/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { registerStaffMocks } from './src/api/mocks';

// Bootstrap shared singletons once. Same shared package + same backend as parent-app.
// Brand the shared AP_ library indigo for staff (parent stays teal default).
configureTheme(STAFF_BRAND);
configureI18n(strings, 'en');
initClientProxy({ baseURL: API_BASE_URL });
// Offline seed for the staff routes until the one shared backend is reachable.
registerStaffMocks();

export default function App() {
  useEffect(() => {
    // place for push-notification registration, deep links, etc.
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar barStyle="light-content" />
          <RootNavigator />
          {/* Global loader (interceptor) + global alert (clientProxy) + toast */}
          <AP_Loader global />
          <AP_Alert />
          <AP_Toast />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
