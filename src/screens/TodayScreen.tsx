import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  AP_Screen,
  AP_Card,
  AP_Text,
  AP_ListItem,
  AP_Button,
  AP_StatusPill,
  AP_EmptyState,
  useI18n,
  colors,
} from '@apex/shared';
import { useAuth } from '../navigation/AuthContext';
import { ROLE_QA } from '../roles';
import { api, ClassDto, IncidentDto } from '../api';

/** Role-tailored dashboard. Teachers see today's classes (via clientProxy); admin sees metrics. */
export const TodayScreen: React.FC = () => {
  const { t, L } = useI18n();
  const { role } = useAuth();
  const quickActions = ROLE_QA[role];
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [pending, setPending] = useState<IncidentDto[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [cls, inc] = await Promise.all([api.myClasses(), api.recentIncidents()]);
        if (!active) return;
        setClasses(cls);
        setPending(inc);
      } catch {
        /* clientProxy already alerted */
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <AP_Screen>
      <AP_Card hero title={t('greetingAm')}>
        <AP_Text variant="h2" color={colors.white}>
          {t(role === 'nurse' ? 'nurseR' : role)}
        </AP_Text>
        <AP_Text variant="caption" color={colors.white}>
          {t('limitedRole')}
        </AP_Text>
      </AP_Card>

      {role === 'admin' ? (
        <AP_Card title={t('schoolMetrics')}>
          <View style={styles.metrics}>
            <Metric value="412" label={t('presentN')} color={colors.ok} />
            <Metric value="18" label={t('absentN')} color={colors.high} />
            <Metric value="7" label={t('openIncidents')} color={colors.med} />
            <Metric value="3" label={t('nurseQueue')} color={colors.low} />
          </View>
        </AP_Card>
      ) : (
        <AP_Card title={t('myClasses')}>
          {classes.length === 0 ? (
            <AP_EmptyState message={L({ en: 'No classes scheduled today.', ar: 'لا صفوف اليوم.' })} />
          ) : (
            classes.map((c) => (
              <AP_ListItem
                key={c.id}
                title={c.name}
                description={`${t('period')} ${c.period} · ${t('room')} ${c.room}`}
                trailing={
                  <AP_StatusPill
                    label={c.attendanceTaken ? t('attendanceTaken') : t('attendancePending')}
                    tone={c.attendanceTaken ? 'ok' : 'med'}
                  />
                }
              />
            ))
          )}
        </AP_Card>
      )}

      <AP_Card title={t('pendingTasks')}>
        {pending.length === 0 ? (
          <AP_EmptyState message={t('noPending')} />
        ) : (
          pending.map((p) => (
            <AP_ListItem key={p.id} tone={p.priority} title={p.studentName} description={p.type} />
          ))
        )}
      </AP_Card>

      <AP_Card title={t('quickActions')}>
        <View style={styles.qa}>
          {quickActions.map((q) => (
            <AP_Button key={q} label={t(q)} variant="ghost" />
          ))}
        </View>
      </AP_Card>
    </AP_Screen>
  );
};

const Metric: React.FC<{ value: string; label: string; color: string }> = ({ value, label, color }) => (
  <View style={styles.metric}>
    <AP_Text variant="h2" color={color}>
      {value}
    </AP_Text>
    <AP_Text variant="caption">{label}</AP_Text>
  </View>
);

const styles = StyleSheet.create({
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  metric: { width: '40%' },
  qa: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
