import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  AP_Screen,
  AP_Header,
  AP_Card,
  AP_Textbox,
  AP_ListItem,
  AP_Avatar,
  AP_Modal,
  AP_Button,
  AP_EmptyState,
  toast,
  useI18n,
  colors,
} from '@apex/shared';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { api } from '../api';

type Props = Partial<NativeStackScreenProps<RootStackParamList, 'Students'>>;

interface StudentRow {
  id: string;
  name: string;
  grade: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

/**
 * Staff Students screen + the "Send notification to parent" action. Tapping a
 * student opens an AP_Modal sheet with title + message inputs; Send calls
 * clientProxy.post('/staff/notify', { studentId, title, body, category:'note',
 * priority:'medium' }) and toasts "Sent" on success. AP_ components only.
 */
export const StudentsScreen: React.FC<Props> = ({ navigation }) => {
  const { t, L } = useI18n();
  const [q, setQ] = useState('');
  const [students, setStudents] = useState<StudentRow[]>([]);

  // Notify sheet state.
  const [target, setTarget] = useState<StudentRow | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  // Live student search (debounced) via the staff BFF — RBAC-scoped server-side.
  useEffect(() => {
    let active = true;
    const handle = setTimeout(() => {
      api
        .searchStudents(q)
        .then((page) => active && setStudents(page.items))
        .catch(() => {
          /* clientProxy already alerted */
        });
    }, 250);
    return () => {
      active = false;
      clearTimeout(handle);
    };
  }, [q]);

  const openNotify = (s: StudentRow) => {
    setTarget(s);
    setTitle('');
    setBody('');
  };

  const closeNotify = () => {
    if (sending) return;
    setTarget(null);
  };

  const send = async () => {
    if (!target || !title.trim() || !body.trim()) return;
    setSending(true);
    try {
      await api.notifyParent({
        studentId: target.id,
        title: title.trim(),
        body: body.trim(),
        category: 'note',
        priority: 'medium',
      });
      setTarget(null);
      toast(L({ en: 'Sent', ar: 'تم الإرسال' }));
    } catch {
      /* clientProxy already alerted */
    } finally {
      setSending(false);
    }
  };

  return (
    <AP_Screen>
      {navigation ? <AP_Header title={t('students')} showBack onBack={() => navigation.goBack()} /> : null}
      <AP_Card>
        <AP_Textbox placeholder={t('searchStudents')} value={q} onChangeText={setQ} />
        {students.length === 0 ? (
          <AP_EmptyState message={L({ en: 'No students found.', ar: 'لا يوجد طلاب.' })} />
        ) : (
          students.map((s) => (
            <AP_ListItem
              key={s.id}
              leading={<AP_Avatar initials={initials(s.name)} color={colors.brand2} />}
              title={s.name}
              description={s.grade}
              trailing={
                <AP_Button label={t('notifyParent')} variant="ghost" onPress={() => openNotify(s)} />
              }
              onPress={() => openNotify(s)}
            />
          ))
        )}
      </AP_Card>

      <AP_Modal
        visible={target != null}
        onClose={closeNotify}
        title={t('notifyParent')}
        subtitle={target?.name}
      >
        <AP_Textbox
          label={L({ en: 'Title', ar: 'العنوان' })}
          placeholder={L({ en: 'e.g. Left early today', ar: 'مثال: غادر مبكرًا اليوم' })}
          value={title}
          onChangeText={setTitle}
          maxLength={140}
        />
        <AP_Textbox
          label={t('message')}
          placeholder={L({ en: 'Write a short message…', ar: 'اكتب رسالة قصيرة…' })}
          value={body}
          onChangeText={setBody}
          multiline
          maxLength={1000}
        />
        <View style={styles.actions}>
          <AP_Button label={t('cancel')} variant="ghost" full onPress={closeNotify} disabled={sending} />
          <AP_Button
            label={t('send')}
            full
            loading={sending}
            disabled={!title.trim() || !body.trim()}
            onPress={send}
          />
        </View>
      </AP_Modal>
    </AP_Screen>
  );
};

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
});
