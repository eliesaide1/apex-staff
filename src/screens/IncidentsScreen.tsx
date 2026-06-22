import React, { useState } from 'react';
import {
  AP_Screen,
  AP_Card,
  AP_ListItem,
  AP_Button,
  AP_StatusPill,
  AP_Modal,
  AP_Select,
  AP_Textbox,
  AP_Icon,
  useI18n,
  colors,
} from '@apex/shared';

export const IncidentsScreen: React.FC = () => {
  const { t, L } = useI18n();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('late');
  const [priority, setPriority] = useState('med');

  return (
    <AP_Screen>
      <AP_Card>
        <AP_Button
          label={t('reportIncident')}
          full
          icon={<AP_Icon name="flag" size={17} color={colors.white} />}
          onPress={() => setOpen(true)}
        />
      </AP_Card>
      <AP_Card title={t('recentIncidents')}>
        <AP_ListItem
          tone="high"
          leading={<AP_Icon name="flag" size={20} color={colors.high} />}
          title={L({ en: 'Omar Khalil · Disruption', ar: 'عمر خليل · إزعاج' })}
          description={L({ en: 'Repeated talking in class', ar: 'تكرار الحديث في الصف' })}
          trailing={<AP_StatusPill label="HIGH" tone="high" />}
        />
        <AP_ListItem
          tone="med"
          leading={<AP_Icon name="flag" size={20} color={colors.medInk} />}
          title={L({ en: 'Karim Aziz · Late', ar: 'كريم عزيز · تأخر' })}
          description={L({ en: 'Late to Period 3', ar: 'تأخر عن الحصة 3' })}
          trailing={<AP_StatusPill label="MED" tone="med" />}
        />
      </AP_Card>

      <AP_Modal visible={open} onClose={() => setOpen(false)} title={t('reportIncident')}>
        <AP_Select
          label={t('student')}
          value="omar"
          onChange={() => undefined}
          options={[{ label: 'Omar Khalil', value: 'omar' }, { label: 'Lara Khalil', value: 'lara' }]}
        />
        <AP_Select
          label={t('incidentType')}
          value={type}
          onChange={setType}
          options={[
            { label: L({ en: 'Late', ar: 'تأخر' }), value: 'late' },
            { label: L({ en: 'Disruption', ar: 'إزعاج' }), value: 'disruption' },
            { label: L({ en: 'Class skip', ar: 'تغيّب عن الحصة' }), value: 'skip' },
          ]}
        />
        <AP_Select
          label={t('severity')}
          value={priority}
          onChange={setPriority}
          options={[
            { label: 'High', value: 'high' },
            { label: 'Medium', value: 'med' },
            { label: 'Low', value: 'low' },
          ]}
        />
        <AP_Textbox label={t('notes')} multiline />
        <AP_Button label={t('submit')} full onPress={() => setOpen(false)} />
      </AP_Modal>
    </AP_Screen>
  );
};
