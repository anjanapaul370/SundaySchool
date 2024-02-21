import { NbMenuItem } from '@nebular/theme';

export const STUDENT_ITEMS: NbMenuItem[] = [
  {
    title: 'MAIN MENU',
    group: true,
  },
  {
    title: 'Dashboard',
    icon: 'home',
    link: '/pages/test',
  },
  {
    title: 'MANAGEMENT',
    group: true,
  },
  {
    title: 'Examination',
    icon: 'edit-2',
    link: '/pages/exam',

  },
  {
    title: 'Time Table',
    icon: 'clock',
    link: '/pages/time-table',
  },

  {
    title: 'REPORTS',
    group: true,
  },
  {
    title: 'Attendance',
    icon: 'file-text',
    link: '/pages/attendance/students'
  },
  {
    title: 'Marks',
    icon: 'percent',
    link: '/pages/marks',
  },
  {
    title: 'USER',
    group: true,
  },
  {
    title: 'Profile',
    icon: 'smiling-face',
    link: '/pages/profile'
  },
  {
    title: 'Logout',
    icon: 'log-out',
    link: '/auth'
  }
];
