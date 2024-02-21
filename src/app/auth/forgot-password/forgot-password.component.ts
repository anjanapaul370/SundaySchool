import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthService, NbRequestPasswordComponent } from '@nebular/auth';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent extends NbRequestPasswordComponent {
  //email: any;
  constructor(service: NbAuthService, cd: ChangeDetectorRef, router: Router, private authService: AuthService){
    super(service,{}, cd, router)
  }

  forgotPassword() {
    if (!this.user.email) {
      alert('Type in your email first');
    }
    this.authService.resetPasswordInit(this.user.email)
    .then(
      () => alert('A password reset link has been sent to your email address'),
      (rejectionReason) => alert(rejectionReason))
    .catch(e => alert('An error occurred while attempting to reset your password'));
  }


  request(){
    this.forgotPassword();
  }
}
