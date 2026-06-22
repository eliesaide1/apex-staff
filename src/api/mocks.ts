import { registerMocks, mockError, setMockLatency, Role } from '@apex/shared';

/**
 * Staff-app offline seed. Registers stub responses for the routes the staff
 * screens call through clientProxy (see ./index.ts). Same one shared backend
 * contract; data mirrors apex-staff-app.html. Real wiring: screens ->
 * clientProxy -> axios -> interceptors -> this seed.
 */
export function registerStaffMocks(): void {
  setMockLatency(250);

  registerMocks({
    // --- Auth: role travels in the JWT claims (CONVENTIONS §2) ---
    'POST /auth/login': (req) => {
      const body = (req.body ?? {}) as { email?: string; password?: string; role?: Role };
      if (!body.email) {
        mockError(422, 'VALIDATION_ERROR', 'Staff ID is required.', 'معرّف الطاقم مطلوب.');
      }
      // Echo the chosen demo role back as a claim; real backend derives it.
      const role: Role = body.role ?? 'teacher';
      return { token: `mock.staff.${Date.now()}`, role };
    },

    // --- DailyOps: classes + attendance ---
    'GET /staff/classes': () => [
      { id: 'cl1', name: 'Grade 6-B · Math', period: '3', room: '204', attendanceTaken: false },
      { id: 'cl2', name: 'Grade 9-A · Math', period: '5', room: '110', attendanceTaken: true },
    ],
    'GET /staff/classes/:id/roster': () => [
      { id: 's1', name: 'Lara Khalil', status: 'present' },
      { id: 's2', name: 'Omar Khalil', status: 'late' },
      { id: 's3', name: 'Sara Nasr', status: 'present' },
      { id: 's4', name: 'Karim Aziz', status: 'absent' },
    ],
    'POST /staff/classes/:id/attendance': () => null,
    'POST /staff/classes/:id/skip': () => null,

    // --- DailyOps: incidents / nurse (for Today pending + other screens) ---
    'GET /staff/incidents': () => [],
    'GET /staff/nurse/visits': () => [],

    // --- Communication: meetings ---
    'GET /staff/meetings': () => [
      { id: 'm1', type: 'Parent–Teacher meeting', who: 'Khalil family · Tue 16 June, 2:00 PM', when: 'Tue 16 June, 2:00 PM', status: 'pending' },
    ],
  });
}
