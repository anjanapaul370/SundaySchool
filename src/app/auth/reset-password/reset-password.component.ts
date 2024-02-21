
import { ChangeDetectorRef, Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NbAuthService,
  NbResetPasswordComponent,
  passwordStrategyOptions,
} from '@nebular/auth';
import { ClassesService } from '../../pages/classes/classes.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})

export class ResetPasswordComponent extends NbResetPasswordComponent {
  code = this.activatedRoute.snapshot.queryParams['oobCode'];

  constructor(
    cd: ChangeDetectorRef,
    router: Router,
    service: NbAuthService,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private classService: ClassesService,
    private activatedRoute: ActivatedRoute
  ) {
    super(service, {}, cd, router);
  }
  resetPassword(): void {}
}
