import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
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
    title: 'Teachers',
    icon: 'person',
    link: '/pages/teacher',
  },
  {
    title: 'Students',
    icon: 'people',
    link: '/pages/student'
  },
  {
    title: 'Parents',
    icon: 'person-add',
    link: '/pages/parent',
  },
  {
    title: 'Classes',
    icon: 'book-open',
    link: '/pages/classes',
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
    title: 'REPORTS',
    group: true,
  },
  {
    title: 'Attendance',
    icon: 'file-text',
    link: '/pages/attendance/view'
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
