import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  AP_Screen,
  AP_Card,
  AP_Text,
  AP_Textbox,
  AP_Button,
  AP_Logo,
  AP_Icon,
  useI18n,
  colors,
} from '@apex/shared';
import { useAuth } from '../navigation/AuthContext';
import { ROLE_ORDER, ROLE_ICON, StaffRole } from '../roles';
import { api } from '../api';

export const LoginScreen: React.FC = () => {
  const { t, setLang, lang } = useI18n();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('staff@apex.app');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<StaffRole>('teacher');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    try {
      // Real JWT login through the single clientProxy entry point. The chosen
      // role is sent and returned in the (mock) claims; we sign in with it.
      const res = await api.login(email, password, role);
      const claimed = (ROLE_ORDER as string[]).includes(res.role)
        ? (res.role as StaffRole)
        : role;
      await signIn(res.token, claimed);
    } catch {
      // error already alerted by clientProxy; stay on the login screen
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = (r: StaffRole) => t(r === 'nurse' ? 'nurseR' : r);

  return (
    <AP_Screen background={colors.white}>
      <View style={styles.langRow}>
        <AP_Button label="EN" variant={lang === 'en' ? 'primary' : 'ghost'} onPress={() => setLang('en')} />
        <AP_Button label="ع" variant={lang === 'ar' ? 'primary' : 'ghost'} onPress={() => setLang('ar')} />
      </View>
      <View style={styles.logoWrap}>
        <AP_Logo size={64} />
      </View>
      <AP_Text variant="h1" align="center" color={colors.brand}>
        APEX
      </AP_Text>
      <AP_Text variant="caption" align="center" style={styles.tag}>
        {t('staffApp')}
      </AP_Text>
      <AP_Card>
        <AP_Text variant="h2">{t('loginWelcome')}</AP_Text>
        <AP_Text variant="muted" style={styles.lead}>
          {t('loginLead')}
        </AP_Text>

        <AP_Text variant="label" style={styles.label}>
          {t('chooseRole')}
        </AP_Text>
        <View style={styles.roleGrid}>
          {ROLE_ORDER.map((r) => (
            <AP_Button
              key={r}
              label={roleLabel(r)}
              variant={role === r ? 'primary' : 'ghost'}
              icon={
                <AP_Icon
                  name={ROLE_ICON[r].icon}
                  size={16}
                  color={role === r ? colors.white : colors.brand}
                />
              }
              onPress={() => setRole(r)}
            />
          ))}
        </View>

        <AP_Textbox label={t('staffId')} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <AP_Textbox label={t('password')} value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />
        <AP_Button label={t('loginBtn')} full loading={loading} onPress={onLogin} />
      </AP_Card>
    </AP_Screen>
  );
};

const styles = StyleSheet.create({
  langRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginBottom: 8 },
  logoWrap: { alignItems: 'center', marginBottom: 8 },
  tag: { marginBottom: 16 },
  lead: { marginBottom: 16 },
  label: { marginBottom: 8 },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
});
