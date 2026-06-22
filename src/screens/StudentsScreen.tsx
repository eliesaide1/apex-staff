import React, { useState } from 'react';
import {
  AP_Screen,
  AP_Header,
  AP_Card,
  AP_Textbox,
  AP_ListItem,
  AP_Avatar,
  useI18n,
  colors,
} from '@apex/shared';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = Partial<NativeStackScreenProps<RootStackParamList, 'Students'>>;

const STUDENTS = [
  { id: '1', name: 'Lara Khalil', grade: 'Grade 6 — B', init: 'LK', color: colors.brand2 },
  { id: '2', name: 'Omar Khalil', grade: 'Grade 9 — A', init: 'OK', color: colors.low },
  { id: '3', name: 'Sara Nasr', grade: 'Grade 6 — B', init: 'SN', color: colors.med },
];

export const StudentsScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useI18n();
  const [q, setQ] = useState('');
  const filtered = STUDENTS.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <AP_Screen>
      {navigation ? <AP_Header title={t('students')} showBack onBack={() => navigation.goBack()} /> : null}
      <AP_Card>
        <AP_Textbox placeholder={t('searchStudents')} value={q} onChangeText={setQ} />
        {filtered.map((s) => (
          <AP_ListItem
            key={s.id}
            leading={<AP_Avatar initials={s.init} color={s.color} />}
            title={s.name}
            description={s.grade}
          />
        ))}
      </AP_Card>
    </AP_Screen>
  );
};
