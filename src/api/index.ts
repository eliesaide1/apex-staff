import { clientProxy, Paginated, Role } from '@apex/shared';

/**
 * Staff-app API surface. Every call goes through the shared clientProxy — no
 * screen ever touches axios directly. Mirrors the backend bounded contexts used
 * by staff roles (DailyOps attendance/incident/nurse, Communication meetings).
 */

export interface ClassDto {
  id: string;
  name: string;
  period: string;
  room: string;
  attendanceTaken: boolean;
}

export interface RosterStudent {
  id: string;
  name: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

export interface IncidentDto {
  id: string;
  studentName: string;
  type: string;
  priority: 'high' | 'med' | 'low';
  notes: string;
}

export interface NurseVisitDto {
  id: string;
  studentName: string;
  reason: string;
  time: string;
}

export interface StaffMeetingDto {
  id: string;
  type: string;
  who: string;
  when: string;
  status: 'confirmed' | 'pending';
}

export const api = {
  // Auth (role is returned in the JWT claims — see CONVENTIONS §2). The demo
  // role is sent so the offline seed can echo it back as a claim; a live backend
  // derives the role from credentials and ignores the hint.
  login: (email: string, password: string, role?: Role) =>
    clientProxy.post<{ token: string; role: Role }>('/auth/login', { email, password, role }),

  // DailyOps — attendance / classes
  myClasses: () => clientProxy.get<ClassDto[]>('/staff/classes'),
  roster: (classId: string) => clientProxy.get<RosterStudent[]>(`/staff/classes/${classId}/roster`),
  saveAttendance: (classId: string, marks: Array<{ studentId: string; status: string }>) =>
    clientProxy.post<void>(`/staff/classes/${classId}/attendance`, { marks }),
  flagSkip: (classId: string, studentId: string) =>
    clientProxy.post<void>(`/staff/classes/${classId}/skip`, { studentId }),

  // DailyOps — incidents
  recentIncidents: () => clientProxy.get<IncidentDto[]>('/staff/incidents'),
  reportIncident: (body: { studentId: string; type: string; priority: string; notes: string; notifyParent: boolean }) =>
    clientProxy.post<IncidentDto>('/staff/incidents', body),

  // DailyOps — nurse
  recentVisits: () => clientProxy.get<NurseVisitDto[]>('/staff/nurse/visits'),
  logVisit: (body: { studentId: string; reason: string; actionTaken: string; time: string }) =>
    clientProxy.post<NurseVisitDto>('/staff/nurse/visits', body),

  // Communication — meetings
  meetings: () => clientProxy.get<StaffMeetingDto[]>('/staff/meetings'),
  requestMeeting: (body: { type: string; with: string; preferredTime: string; note?: string }) =>
    clientProxy.post<StaffMeetingDto>('/staff/meetings', body),
  respondMeeting: (id: string, action: 'accept' | 'decline' | 'propose') =>
    clientProxy.post<StaffMeetingDto>(`/staff/meetings/${id}/${action}`),

  // Foundation — students (RBAC-scoped server-side)
  searchStudents: (q: string) =>
    clientProxy.get<Paginated<{ id: string; name: string; grade: string }>>(`/staff/students`, { params: { q } }),

  // Communication — direct staff -> parent notification (POST /api/staff/notify).
  // Backend resolves the student's parents and pushes a 'notification' socket
  // event to each; returns how many were sent.
  notifyParent: (body: {
    studentId: string;
    title: string;
    body: string;
    category?: string;
    priority?: 'high' | 'medium' | 'low';
  }) => clientProxy.post<{ sent: number }>('/staff/notify', body),
};
