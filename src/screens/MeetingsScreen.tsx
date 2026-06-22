import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  AP_Screen,
  AP_Card,
  AP_ListItem,
  AP_Button,
  AP_StatusPill,
  useI18n,
} from '@apex/shared';

export const MeetingsScreen: React.FC = () => {
  const { t, L } = useI18n();
  return (
    <AP_Screen>
      <AP_Card title={t('incomingRequests')}>
        <AP_ListItem
          tone="med"
          title={L({ en: 'Rami Khalil (parent)', ar: 'رامي خليل (ولي أمر)' })}
          description={L({ en: 'Re: Omar — behavior follow-up', ar: 'بخصوص عمر — متابعة سلوك' })}
          footer={
            <View style={styles.actions}>
              <AP_Button label={t('accept')} full />
              <AP_Button label={t('proposeTime')} variant="ghost" full />
              <AP_Button label={t('decline')} variant="danger" full />
            </View>
          }
        />
      </AP_Card>
      <AP_Card title={t('upcomingMeetings')}>
        <AP_ListItem
          title={L({ en: 'Parent–Teacher meeting', ar: 'اجتماع ولي أمر ومعلم' })}
          description={L({ en: 'Mon 18 June, 3:30 PM', ar: 'الإثنين 18 يونيو، 3:30 م' })}
          trailing={<AP_StatusPill label="OK" tone="ok" />}
        />
      </AP_Card>
      <AP_Card>
        <AP_Button label={t('requestMeeting')} full />
      </AP_Card>
    </AP_Screen>
  );
};

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
});
