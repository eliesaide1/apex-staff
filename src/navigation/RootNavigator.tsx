import React from 'react';
import { Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  BottomTabHeaderProps,
} from '@react-navigation/bottom-tabs';
import {
  AP_Badge,
  AP_Icon,
  AP_AppHeader,
  AP_HeaderChip,
  useI18n,
  useUnreadCount,
  colors,
} from '@apex/shared';
import { RootStackParamList } from './types';
import { useAuth } from './AuthContext';
import { ROLE_TABS, TAB_DEFS, ROLE_IDENTITY } from '../roles';
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

/** Bell (with live unread badge) + settings gear — the header tools slot. */
const HeaderTools: React.FC<{ onBell: () => void; onSettings: () => void }> = ({ onBell, onSettings }) => {
  const unread = useUnreadCount();
  return (
    <>
      <Pressable onPress={onBell}>
        <AP_Icon name="bell" size={21} color={colors.white} />
        <AP_Badge count={unread} />
      </Pressable>
      <Pressable onPress={onSettings}>
        <AP_Icon name="settings" size={20} color={colors.white} />
      </Pressable>
    </>
  );
};

/**
 * The single brand (indigo) header block for the staff Tab.Navigator: logo +
 * APEX wordmark, current tab title, today's date, bell/settings tools, and a
 * single role-identity chip (current user name + role) inside the block —
 * matching the staff prototype's header.
 */
const StaffHeader: React.FC<BottomTabHeaderProps> = ({ navigation, options }) => {
  const { t, L, formatHeaderDate } = useI18n();
  const { role } = useAuth();
  const id = ROLE_IDENTITY[role];
  return (
    <AP_AppHeader
      title={options.title ?? ''}
      subtitle={formatHeaderDate()}
      right={
        <HeaderTools
          onBell={() => navigation.getParent()?.navigate('Notifications' as never)}
          onSettings={() => navigation.getParent()?.navigate('Settings' as never)}
        />
      }
    >
      <AP_HeaderChip label={`${L(id.name)} · ${t(id.roleKey)}`} initials={id.init} color={id.color} active />
    </AP_AppHeader>
  );
};

const MainTabs: React.FC = () => {
  const { t } = useI18n();
  const { role } = useAuth();
  const tabIds = ROLE_TABS[role];

  return (
    <Tab.Navigator
      screenOptions={{
        header: (props) => <StaffHeader {...props} />,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.muted,
      }}
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
                <AP_Icon name={def.icon} size={22} color={focused ? colors.brand : colors.muted} />
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
