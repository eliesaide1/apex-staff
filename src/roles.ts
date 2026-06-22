/** Staff role model — mirrors ROLE_ORDER / ROLE_TABS / ROLE_QA in apex-staff-app.html. */
export type StaffRole = 'teacher' | 'nurse' | 'supervisor' | 'counselor' | 'admin';

export const ROLE_ORDER: StaffRole[] = ['teacher', 'nurse', 'supervisor', 'counselor', 'admin'];

/** Tab ids per role (the bottom-nav set changes with the signed-in role). */
export const ROLE_TABS: Record<StaffRole, string[]> = {
  teacher: ['today', 'classes', 'incidents', 'meetings', 'students'],
  nurse: ['today', 'nurse', 'students', 'meetings', 'classes'],
  supervisor: ['today', 'incidents', 'classes', 'meetings', 'students'],
  counselor: ['today', 'meetings', 'students', 'incidents', 'nurse'],
  admin: ['today', 'incidents', 'nurse', 'meetings', 'students'],
};

/** Quick-action keys per role (rendered on the Today dashboard). */
export const ROLE_QA: Record<StaffRole, string[]> = {
  teacher: ['takeAttendance', 'reportIncident', 'requestMeeting', 'sendNote', 'logNurse'],
  nurse: ['logNurse', 'sendNote', 'requestMeeting', 'reportIncident'],
  supervisor: ['reportIncident', 'requestMeeting', 'sendNote', 'takeAttendance'],
  counselor: ['requestMeeting', 'sendNote', 'reportIncident', 'logNurse'],
  admin: ['reportIncident', 'requestMeeting', 'sendNote', 'logNurse', 'takeAttendance'],
};

/** Icon glyph + i18n label key per tab. */
export const TAB_DEFS: Record<string, { glyph: string; key: string }> = {
  today: { glyph: '🏠', key: 'today' },
  classes: { glyph: '📋', key: 'classes' },
  incidents: { glyph: '⚠️', key: 'incidents' },
  nurse: { glyph: '🩺', key: 'nurse' },
  meetings: { glyph: '📅', key: 'meetings' },
  students: { glyph: '👥', key: 'students' },
};
