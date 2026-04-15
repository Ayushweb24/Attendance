export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['admin', 'teacher'] },
  { to: '/students', label: 'Students', icon: '👥', roles: ['admin', 'teacher'] },
  { to: '/attendance', label: 'Attendance', icon: '✅', roles: ['admin', 'teacher'] },
  { to: '/reports', label: 'Reports', icon: '📈', roles: ['admin', 'teacher', 'student'] },
  { to: '/leave', label: 'Leave', icon: '📋', roles: ['admin', 'teacher', 'student'] },
  { to: '/profile', label: 'Profile', icon: '👤', roles: ['admin', 'teacher', 'student'] },
];

const DEFAULT_ROLE = 'student';

const ROLE_DEFAULT_ROUTE = {
  admin: '/dashboard',
  teacher: '/dashboard',
  [DEFAULT_ROLE]: '/reports',
};

export const normalizeRole = (role) => (ROLE_DEFAULT_ROUTE[role] ? role : DEFAULT_ROLE);

export const getAllowedPaths = (role) =>
  NAV_ITEMS.filter((item) => item.roles.includes(normalizeRole(role))).map((item) => item.to);

export const getDefaultRoute = (role) => ROLE_DEFAULT_ROUTE[normalizeRole(role)];
