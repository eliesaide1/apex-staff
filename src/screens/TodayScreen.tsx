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
  AP_Icon,
  useI18n,
  colors,
} from '@apex/shared';
import { useAuth } from '../navigation/AuthContext';
import { ROLE_QA, QA_ICONS, ROLE_ICON } from '../roles';
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
        <View style={styles.heroRow}>
          <View style={styles.heroPulse}>
            <AP_Icon name={ROLE_ICON[role].icon} size={26} color={colors.white} />
          </View>
          <View style={styles.heroBody}>
            <AP_Text variant="h2" color={colors.white}>
              {t(role === 'nurse' ? 'nurseR' : role)}
            </AP_Text>
            <AP_Text variant="caption" color={colors.white}>
              {t('limitedRole')}
            </AP_Text>
          </View>
        </View>
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
            <AP_ListItem
              key={p.id}
              tone={p.priority}
              leading={
                <AP_Icon
                  name={p.priority === 'high' ? 'activity' : p.priority === 'med' ? 'alert' : 'flag'}
                  size={20}
                  color={p.priority === 'high' ? colors.high : p.priority === 'med' ? colors.medInk : colors.low}
                />
              }
              title={p.studentName}
              description={p.type}
            />
          ))
        )}
      </AP_Card>

      <AP_Card title={t('quickActions')}>
        <View style={styles.qa}>
          {quickActions.map((q) => (
            <AP_Button
              key={q}
              label={t(q)}
              variant="ghost"
              icon={<AP_Icon name={QA_ICONS[q]} size={16} color={colors.brand} />}
            />
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
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroPulse: {
    width: 46,
    height: 46,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBody: { flex: 1, gap: 2 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  metric: { width: '40%' },
  qa: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
