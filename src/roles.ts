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

/** Icon name (AP_Icon) + i18n label key per tab — copied from apex-staff-app.html TAB_DEFS. */
export const TAB_DEFS: Record<string, { icon: string; key: string }> = {
  today: { icon: 'home', key: 'today' },
  classes: { icon: 'clipboardCheck', key: 'classes' },
  incidents: { icon: 'flag', key: 'incidents' },
  nurse: { icon: 'activity', key: 'nurse' },
  meetings: { icon: 'calendar', key: 'meetings' },
  students: { icon: 'users', key: 'students' },
};

/** Quick-action icon name per action key — copied from apex-staff-app.html QA_ACTIONS. */
export const QA_ICONS: Record<string, string> = {
  takeAttendance: 'clipboardCheck',
  reportIncident: 'flag',
  logNurse: 'activity',
  requestMeeting: 'calendar',
  sendNote: 'send',
};

/** Role icon + brand color — copied from apex-staff-app.html ROLES. */
export const ROLE_ICON: Record<StaffRole, { icon: string; color: string }> = {
  teacher: { icon: 'book', color: '#3b4d9e' },
  nurse: { icon: 'activity', color: '#e63946' },
  supervisor: { icon: 'shield', color: '#e8a317' },
  counselor: { icon: 'heart', color: '#2a9d8f' },
  admin: { icon: 'school', color: '#5566c9' },
};
