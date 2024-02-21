import { NbMenuItem } from '@nebular/theme';

export const TEACHER_ITEMS: NbMenuItem[] = [
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
    title: 'Students',
    icon: 'people',
    link: '/pages/student',
  },
  {
    title: 'Parents',
    icon: 'person-add',
    link: '/pages/parent',
  },
  {
    title: 'MANAGEMENT',
    group: true,
  },
  {
    title: 'Examination',
    icon: 'edit-2',
    link: '/pages/examination',
  },
  {
    title: 'Time Table',
    icon: 'clock',
    link: '/pages/timetable',
  },
  {
    title: 'Attendance',
    icon: 'file-text',
    link: '/pages/attendance/view'
  },
  {
    title: 'REPORTS',
    group: true,
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
    link: '/pages/profile',
  },
  {
    title: 'Logout',
    icon: 'log-out',
    link: '/auth'
  },
];
