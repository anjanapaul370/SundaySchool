import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthModule } from '@nebular/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbMenuModule,
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbInputModule,
  NbThemeModule,
  NbIconModule,
  NbFormFieldModule,
} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import {  MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { TeacherLoginComponent } from './teacher-login/teacher-login.component';
import { StudentLoginComponent } from './student-login/student-login.component';

//import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { NbFirebasePasswordStrategy } from '@nebular/firebase-auth';
@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    TeacherLoginComponent,
    StudentLoginComponent,
  ],
  imports: [
    CommonModule,
    ThemeModule,
    NbThemeModule,
    AuthRoutingModule,
    NbAuthModule,
    NbAlertModule,
    FormsModule,
    NbInputModule,
    NbIconModule,
    NbButtonModule,
    NbCheckboxModule,
    NbCardModule,
    NbMenuModule,
    NbFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthModule {}
