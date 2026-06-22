import React, { useState } from 'react';
import {
  AP_Screen,
  AP_Card,
  AP_ListItem,
  AP_Button,
  AP_Modal,
  AP_Select,
  AP_Textbox,
  AP_DatePicker,
  AP_Icon,
  useI18n,
  colors,
} from '@apex/shared';

export const NurseScreen: React.FC = () => {
  const { t, L } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <AP_Screen>
      <AP_Card>
        <AP_Button
          label={t('logNurse')}
          full
          icon={<AP_Icon name="activity" size={17} color={colors.white} />}
          onPress={() => setOpen(true)}
        />
      </AP_Card>
      <AP_Card title={t('recentVisits')}>
        <AP_ListItem
          tone="high"
          leading={<AP_Icon name="thermometer" size={20} color={colors.high} />}
          title={L({ en: 'Omar Khalil', ar: 'عمر خليل' })}
          description={L({ en: 'Headache — resting', ar: 'صداع — يرتاح' })}
          time="10:45 AM"
        />
        <AP_ListItem
          tone="ok"
          leading={<AP_Icon name="pill" size={20} color={colors.ok} />}
          title={L({ en: 'Sara Nasr', ar: 'سارة نصر' })}
          description={L({ en: 'Minor scrape — treated', ar: 'خدش بسيط — عولج' })}
          time="9:20 AM"
        />
      </AP_Card>

      <AP_Modal visible={open} onClose={() => setOpen(false)} title={t('logNurse')}>
        <AP_Select
          label={t('student')}
          value="omar"
          onChange={() => undefined}
          options={[{ label: 'Omar Khalil', value: 'omar' }, { label: 'Sara Nasr', value: 'sara' }]}
        />
        <AP_Textbox label={t('reason')} multiline />
        <AP_Textbox label={t('actionTaken')} multiline />
        <AP_DatePicker label={t('visitTime')} value="10:45 AM" />
        <AP_Button label={t('submit')} full onPress={() => setOpen(false)} />
      </AP_Modal>
    </AP_Screen>
  );
};
