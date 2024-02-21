import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NbAuthModule, NbAuthService } from '@nebular/auth';
import { NbSecurityModule } from '@nebular/security';
import {
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbThemeModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import { environment } from '../environments/environment';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import {
  AngularFireFunctions,
  AngularFireFunctionsModule,
} from '@angular/fire/compat/functions';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AuthService } from './auth/auth.service';
import { ClassesService } from './pages/classes/classes.service';
import { PagesModule } from './pages/pages.module';
import { TeacherService } from './pages/teacher/teacher.service';
import { StudentService } from './pages/student/student.service';
import { HttpClientModule } from '@angular/common/http';
import { AttendanceService } from './pages/attendance/attendance.service';
import { ParentService } from './pages/parent/parent.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NbMenuModule,
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    NbSecurityModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbAuthModule.forRoot(),
    NbThemeModule.forRoot(),
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    PagesModule,
    HttpClientModule,
    AngularFireFunctionsModule,
    FlexLayoutModule
  ],
  providers: [
    AuthService,
    NbAuthService,
    ClassesService,
    StudentService,
    ParentService,
    TeacherService,
    AngularFireFunctions,
    AttendanceService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
