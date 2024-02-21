import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthService, NbLoginComponent } from '@nebular/auth';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-teacher-login',
  templateUrl: './teacher-login.component.html',
  styleUrls: ['./teacher-login.component.scss']
})
export class TeacherLoginComponent extends NbLoginComponent{
  studentloginForm: FormGroup;

  constructor(
    cd: ChangeDetectorRef,
    router: Router,
    service: NbAuthService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    super(service, {}, cd, router);
    this.studentloginForm = this.fb.group({
      email: new FormControl(null, [
        Validators.required
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ])
    });
  }

  get f() {
    return this.studentloginForm.controls;
  }

  onSubmit(){
    let data = Object.assign({}, this.studentloginForm.value);
    this.submitted = true;
    if (this.studentloginForm.invalid) {
      this.authService.showSnackbar('Form is invalid', null, 3000);
    }
    this.authService.login(data);
  }
}
