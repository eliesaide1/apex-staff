import React from 'react';
import { AP_Screen, AP_Header, AP_Card, AP_ListItem, AP_StatusPill, AP_Icon, useI18n, colors } from '@apex/shared';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import type { Priority } from '@apex/shared';

const NOTIF_ICON: Record<Priority, { name: string; color: string }> = {
  high: { name: 'activity', color: colors.high },
  med: { name: 'calendar', color: colors.medInk },
  low: { name: 'bell', color: colors.low },
  ok: { name: 'clipboardCheck', color: colors.ok },
};

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

export const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const { t, L } = useI18n();
  const items: Array<{ tone: Priority; tt: { en: string; ar: string }; time: string }> = [
    { tone: 'high', tt: { en: 'Nurse queue: Omar waiting', ar: 'طابور العيادة: عمر بانتظار' }, time: '10:45 AM' },
    { tone: 'med', tt: { en: 'New parent meeting request', ar: 'طلب اجتماع جديد من ولي أمر' }, time: '10:10 AM' },
    { tone: 'ok', tt: { en: 'Attendance saved · 6-B', ar: 'تم حفظ الحضور · 6-ب' }, time: '9:05 AM' },
  ];
  return (
    <AP_Screen>
      <AP_Header title={t('notifications')} showBack onBack={() => navigation.goBack()} />
      <AP_Card title={t('liveAlerts')}>
        {items.map((n, i) => (
          <AP_ListItem
            key={i}
            tone={n.tone}
            leading={<AP_Icon name={NOTIF_ICON[n.tone].name} size={20} color={NOTIF_ICON[n.tone].color} />}
            title={L(n.tt)}
            time={n.time}
            trailing={<AP_StatusPill label={n.tone.toUpperCase()} tone={n.tone} />}
          />
        ))}
      </AP_Card>
    </AP_Screen>
  );
};
