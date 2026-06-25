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

/**
 * Per-role staff identity (name + initials + avatar color) — copied from the
 * apex-staff-app.html ROLES map. Used for the single role-identity chip in the
 * header's chip row. (en/ar names, and the role label uses the i18n key.)
 */
export const ROLE_IDENTITY: Record<
  StaffRole,
  { name: { en: string; ar: string }; init: string; color: string; roleKey: string }
> = {
  teacher: { name: { en: 'Layla Hadid', ar: 'ليلى حديد' }, init: 'LH', color: '#3b4d9e', roleKey: 'teacher' },
  nurse: { name: { en: 'Nadia Saab', ar: 'نادية صعب' }, init: 'NS', color: '#e63946', roleKey: 'nurseR' },
  supervisor: { name: { en: 'Sami Tannous', ar: 'سامي طنوس' }, init: 'ST', color: '#e8a317', roleKey: 'supervisor' },
  counselor: { name: { en: 'Rania Aoun', ar: 'رانيا عون' }, init: 'RA', color: '#2a9d8f', roleKey: 'counselor' },
  admin: { name: { en: 'Karim Daou', ar: 'كريم ضو' }, init: 'KD', color: '#5566c9', roleKey: 'admin' },
};
