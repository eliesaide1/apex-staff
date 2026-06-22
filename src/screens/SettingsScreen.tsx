import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  AP_Screen,
  AP_Header,
  AP_Card,
  AP_Text,
  AP_Avatar,
  AP_Button,
  useI18n,
  colors,
} from '@apex/shared';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../navigation/AuthContext';
import { ROLE_ORDER, StaffRole } from '../roles';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { t, lang, setLang } = useI18n();
  const { signOut, role, setRole } = useAuth();
  const roleLabel = (r: StaffRole) => t(r === 'nurse' ? 'nurseR' : r);

  return (
    <AP_Screen>
      <AP_Header title={t('settings')} showBack onBack={() => navigation.goBack()} />
      <AP_Card>
        <View style={styles.prof}>
          <AP_Avatar initials="SM" size={60} />
          <View>
            <AP_Text weight="700">Sami Mansour</AP_Text>
            <AP_Text variant="muted">staff@apex.app · {roleLabel(role)}</AP_Text>
          </View>
        </View>
      </AP_Card>

      <AP_Card title={t('switchRole')}>
        <View style={styles.grid}>
          {ROLE_ORDER.map((r) => (
            <AP_Button
              key={r}
              label={roleLabel(r)}
              variant={role === r ? 'primary' : 'ghost'}
              onPress={() => setRole(r)}
            />
          ))}
        </View>
      </AP_Card>

      <AP_Card title={t('language')}>
        <View style={styles.grid}>
          <AP_Button label="EN" variant={lang === 'en' ? 'primary' : 'ghost'} onPress={() => setLang('en')} />
          <AP_Button label="ع" variant={lang === 'ar' ? 'primary' : 'ghost'} onPress={() => setLang('ar')} />
        </View>
      </AP_Card>

      <AP_Card title={t('privacy')}>
        <AP_Text variant="muted">{t('privacyNote')}</AP_Text>
      </AP_Card>

      <AP_Card>
        <AP_Button label={t('logout')} variant="danger" full onPress={signOut} />
        <AP_Text variant="caption" align="center" color={colors.muted} style={styles.ver}>
          Apex AI · Staff App · v1
        </AP_Text>
      </AP_Card>
    </AP_Screen>
  );
};

const styles = StyleSheet.create({
  prof: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ver: { marginTop: 12 },
});
