import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NbAuthModule } from '@nebular/auth';
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbInputModule,
  NbMenuModule,
  NbSidebarModule,

} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { TestComponent } from './test/test.component';
import { ClassesComponent, PopupComponent } from './classes/classes.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  TeacherComponent,
  TeacherdialogComponent,
} from './teacher/teacher.component';
import {
  StudentComponent,
  StudentdialogComponent,
} from './student/student.component';
import { ProfileComponent } from './profile/profile.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { NotFoundComponent } from './not-found/not-found.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { StudentsComponent } from './attendance/students/students.component';
import { TeachersComponent } from './attendance/teachers/teachers.component';
import { MatNativeDateModule } from '@angular/material/core';
import { ViewStudentComponent } from './attendance/view-student/view-student.component';
import {
  ParentComponent,
  ParentdialogComponent,
} from './parent/parent.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbCardModule,
    NbAuthModule,
    NbAlertModule,
    FormsModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
    MatMenuModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatCardModule,
    MatSortModule,
    NbSidebarModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  declarations: [
    PagesComponent,
    TestComponent,
    ClassesComponent,
    PopupComponent,
    StudentComponent,
    StudentdialogComponent,
    TeacherComponent,
    TeacherdialogComponent,
    ProfileComponent,
    NotFoundComponent,
    StudentsComponent,
    TeachersComponent,
    ViewStudentComponent,
    ParentComponent,
    ParentdialogComponent,
  ],
  providers: [MatDatepickerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PagesModule {}
