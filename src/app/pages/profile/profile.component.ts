import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthService, NbResetPasswordComponent } from '@nebular/auth';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/user.model';
import { AdminData } from '../admin.model';
import { StudentData } from '../student/student.model';
import { TeacherData } from '../teacher/teacher.model';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent
  extends NbResetPasswordComponent
  implements OnInit
{
  changeForm: FormGroup;
  submitted: boolean = false;
  user: User;
  teacher: boolean;
  student: boolean;
  admin: boolean;
  change: boolean;
  loginUser: any;

  constructor(
    private fb: FormBuilder,
    cd: ChangeDetectorRef,
    router: Router,
    service: NbAuthService,
    private authService: AuthService,
    private profileService: ProfileService,
    public afAuth: AngularFireAuth
  ) {
    super(service, {}, cd, router);
    this.changeForm = this.fb.group(
      {
        oldpassword: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        newpassword: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirmpassword: new FormControl(null, [Validators.required]),
      },
      {
        validators: this.MustMatch('newpassword', 'confirmpassword'),
      }
    );
  }

  get f() {
    return this.changeForm.controls;
  }

  async ngOnInit() {
    let user = await this.afAuth.currentUser;
    console.log('user', user);

    if ((await user.getIdTokenResult()).claims['admin']) {
      console.log('user is admin');
      this.loginUser = await this.authService.getAdmin(user.email);
      this.admin = true;
    }

    if ((await user.getIdTokenResult()).claims['teacher']) {
      this.loginUser = await this.authService.getTeacher(user.email);
      this.teacher = true;
    }

    if ((await user.getIdTokenResult()).claims['student']) {
      this.loginUser = await this.authService.getStudent(user.email);
      console.log('user is student');
      this.student = true;
    }
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.MustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ MustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  profileSubmit() {}

  onSubmit() {
    let data = Object.assign({}, this.changeForm.value);
    this.submitted = true;
    if (this.changeForm.invalid) {
      this.authService.showSnackbar('Form is invalid', null, 3000);
    }
    this.authService.changePassword(data).then(() => {
      this.change = true;
    });
    this.changeForm.reset();
  }
}
