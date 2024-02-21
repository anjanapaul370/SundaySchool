import { ChangeDetectorRef, Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthService, NbRegisterComponent } from '@nebular/auth';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends NbRegisterComponent {
  constructor(
    public router: Router,
    public service: NbAuthService,
    public cd: ChangeDetectorRef,
    private authService: AuthService
  ) {
    super(service, {}, cd, router);
  }

  onSubmit(form: NgForm) {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password,
      name: form.value.name
    });

  }
}
