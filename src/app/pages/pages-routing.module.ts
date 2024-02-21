import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassesComponent } from './classes/classes.component';
import { PagesComponent } from './pages.component';
import { TeacherComponent } from './teacher/teacher.component';
import { ProfileComponent } from './profile/profile.component';
import { StudentComponent } from './student/student.component';

import { TestComponent } from './test/test.component';
import { StudentsComponent } from './attendance/students/students.component';
import { TeachersComponent } from './attendance/teachers/teachers.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ViewStudentComponent } from './attendance/view-student/view-student.component';
import { ParentComponent } from './parent/parent.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'test',
        component: TestComponent,
      },
      {
        path: 'classes',
        component: ClassesComponent,
      },
      {
        path: 'teacher',
        component: TeacherComponent,
      },
      {
        path: 'student',
        component: StudentComponent,
      },
      {
        path: 'parent',
        component: ParentComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: '404',
        component: NotFoundComponent,
      },
      {
        path: 'attendance',
        children: [
          {
            path: 'students',
            component: StudentsComponent
          },
          {
            path: 'teachers',
            component: TeachersComponent
          },
          {
            path: 'view',
            component: ViewStudentComponent
          },
        ]
      },
      { path: '', redirectTo: 'test', pathMatch: 'full' },
      { path: '**', redirectTo: '404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
