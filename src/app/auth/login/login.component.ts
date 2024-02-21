import { ChangeDetectorRef, Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthService, NbLoginComponent } from '@nebular/auth';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent extends NbLoginComponent {
  constructor(
    cd: ChangeDetectorRef,
    router: Router,
    service: NbAuthService,
    private authService: AuthService,
    public afAuth: AngularFireAuth
  ) {
    super(service, {}, cd, router);
  }

  onSubmit(form: NgForm) {
    this.authService.login({
      email: form.value.email,
      password: form.value.password,
      name: 'null',
    });
    //console.log(form.value.email)
  }
}
