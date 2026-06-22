import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  AP_Screen,
  AP_Card,
  AP_ListItem,
  AP_Button,
  AP_StatusPill,
  AP_EmptyState,
  useI18n,
  colors,
  Priority,
} from '@apex/shared';
import { api, ClassDto, RosterStudent } from '../api';

type Status = RosterStudent['status'];
const toneFor: Record<Status, Priority> = { present: 'ok', absent: 'high', late: 'med', excused: 'low' };
const ORDER: Status[] = ['present', 'late', 'absent', 'excused'];

/** Classes + take-attendance. Roster loads via clientProxy; tap a student to cycle status; save posts back. */
export const ClassesScreen: React.FC = () => {
  const { t, L } = useI18n();
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [activeClass, setActiveClass] = useState<string | null>(null);
  const [roster, setRoster] = useState<RosterStudent[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .myClasses()
      .then((cls) => {
        if (!active) return;
        setClasses(cls);
        if (cls.length) setActiveClass(cls[0].id);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!activeClass) return;
    let active = true;
    api
      .roster(activeClass)
      .then((r) => active && setRoster(r))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [activeClass]);

  const cycle = (id: string) =>
    setRoster((r) =>
      r.map((s) =>
        s.id === id ? { ...s, status: ORDER[(ORDER.indexOf(s.status) + 1) % ORDER.length] } : s,
      ),
    );

  const onSave = async () => {
    if (!activeClass) return;
    setSaving(true);
    try {
      await api.saveAttendance(
        activeClass,
        roster.map((s) => ({ studentId: s.id, status: s.status })),
      );
      setClasses((cls) => cls.map((c) => (c.id === activeClass ? { ...c, attendanceTaken: true } : c)));
    } catch {
      /* alerted */
    } finally {
      setSaving(false);
    }
  };

  const onFlagSkip = async () => {
    const absent = roster.find((s) => s.status === 'absent');
    if (!activeClass || !absent) return;
    try {
      await api.flagSkip(activeClass, absent.id);
    } catch {
      /* alerted */
    }
  };

  const current = classes.find((c) => c.id === activeClass);

  return (
    <AP_Screen>
      {classes.length > 1 ? (
        <View style={styles.classRow}>
          {classes.map((c) => (
            <AP_Button
              key={c.id}
              label={c.name}
              variant={c.id === activeClass ? 'primary' : 'ghost'}
              onPress={() => setActiveClass(c.id)}
            />
          ))}
        </View>
      ) : null}

      <AP_Card title={`${t('roster')}${current ? ` · ${current.name}` : ''}`}>
        {roster.length === 0 ? (
          <AP_EmptyState message={L({ en: 'No students in this class.', ar: 'لا طلاب في هذا الصف.' })} />
        ) : (
          roster.map((s) => (
            <AP_ListItem
              key={s.id}
              tone={toneFor[s.status]}
              title={s.name}
              onPress={() => cycle(s.id)}
              trailing={<AP_StatusPill label={t(s.status)} tone={toneFor[s.status]} />}
            />
          ))
        )}
        <View style={styles.actions}>
          <AP_Button label={t('markSkip')} variant="ghost" full onPress={onFlagSkip} />
          <AP_Button label={t('saveAttendance')} full loading={saving} onPress={onSave} />
        </View>
      </AP_Card>
    </AP_Screen>
  );
};

const styles = StyleSheet.create({
  classRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
});
