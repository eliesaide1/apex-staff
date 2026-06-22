import React from 'react';
import { Pressable, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AP_Text, AP_Badge, useI18n, colors } from '@apex/shared';
import { RootStackParamList } from './types';
import { useAuth } from './AuthContext';
import { ROLE_TABS, TAB_DEFS } from '../roles';
import { LoginScreen } from '../screens/LoginScreen';
import { TodayScreen } from '../screens/TodayScreen';
import { ClassesScreen } from '../screens/ClassesScreen';
import { IncidentsScreen } from '../screens/IncidentsScreen';
import { NurseScreen } from '../screens/NurseScreen';
import { MeetingsScreen } from '../screens/MeetingsScreen';
import { StudentsScreen } from '../screens/StudentsScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const SCREENS: Record<string, React.ComponentType<any>> = {
  today: TodayScreen,
  classes: ClassesScreen,
  incidents: IncidentsScreen,
  nurse: NurseScreen,
  meetings: MeetingsScreen,
  students: StudentsScreen,
};

const HeaderTools: React.FC<{ onBell: () => void; onSettings: () => void }> = ({ onBell, onSettings }) => (
  <View style={{ flexDirection: 'row', gap: 16, paddingHorizontal: 12 }}>
    <Pressable onPress={onBell}>
      <AP_Text color={colors.white}>🔔</AP_Text>
      <AP_Badge count={3} />
    </Pressable>
    <Pressable onPress={onSettings}>
      <AP_Text color={colors.white}>⚙️</AP_Text>
    </Pressable>
  </View>
);

const MainTabs: React.FC = () => {
  const { t } = useI18n();
  const { role } = useAuth();
  const tabIds = ROLE_TABS[role];

  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: colors.brand },
        headerTintColor: colors.white,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.muted,
        headerRight: () => (
          <HeaderTools
            onBell={() => navigation.getParent()?.navigate('Notifications')}
            onSettings={() => navigation.getParent()?.navigate('Settings')}
          />
        ),
      })}
    >
      {tabIds.map((id) => {
        const def = TAB_DEFS[id];
        return (
          <Tab.Screen
            key={id}
            name={id}
            component={SCREENS[id]}
            options={{
              title: t(def.key),
              tabBarIcon: ({ focused }) => (
                <AP_Text color={focused ? colors.brand : colors.muted}>{def.glyph}</AP_Text>
              ),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  const { token, role } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <>
            {/* key on role so the tab set rebuilds when the role changes */}
            <Stack.Screen name="Main" key={role}>
              {() => <MainTabs />}
            </Stack.Screen>
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Students" component={StudentsScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
