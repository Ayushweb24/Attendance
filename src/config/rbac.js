const ROLE_ADMIN = 'admin';
const ROLE_TEACHER = 'teacher';
const ROLE_STUDENT = 'student';
const DEFAULT_ROLE = ROLE_STUDENT;
const VALID_ROLES = [ROLE_ADMIN, ROLE_TEACHER, ROLE_STUDENT];

export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊', roles: [ROLE_ADMIN, ROLE_TEACHER] },
  { to: '/students', label: 'Students', icon: '👥', roles: [ROLE_ADMIN, ROLE_TEACHER] },
  { to: '/attendance', label: 'Attendance', icon: '✅', roles: [ROLE_ADMIN, ROLE_TEACHER] },
  { to: '/reports', label: 'Reports', icon: '📈', roles: [ROLE_ADMIN, ROLE_TEACHER, ROLE_STUDENT] },
  { to: '/leave', label: 'Leave', icon: '📋', roles: [ROLE_ADMIN, ROLE_TEACHER, ROLE_STUDENT] },
  { to: '/profile', label: 'Profile', icon: '👤', roles: [ROLE_ADMIN, ROLE_TEACHER, ROLE_STUDENT] },
];

const ROLE_DEFAULT_ROUTE = {
  [ROLE_ADMIN]: '/dashboard',
  [ROLE_TEACHER]: '/dashboard',
  [ROLE_STUDENT]: '/reports',
};

export const normalizeRole = (role) => (VALID_ROLES.includes(role) ? role : DEFAULT_ROLE);

export const getAllowedPaths = (role) =>
  NAV_ITEMS.filter((item) => item.roles.includes(normalizeRole(role))).map((item) => item.to);

export const getDefaultRoute = (role) => ROLE_DEFAULT_ROUTE[normalizeRole(role)];
