import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { first } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

import { MENU_ITEMS } from './pages-menu';
import { STUDENT_ITEMS } from './student-menu';
import { TEACHER_ITEMS } from './teacher-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-sidebar state="collapsed"></nb-sidebar>
      <nb-menu tag="menu-sidebar" *ngIf="admin" [items]="menu"></nb-menu>
      <nb-menu *ngIf="teacher" [items]="tmenu"></nb-menu>
      <nb-menu *ngIf="!teacher && !admin" [items]="smenu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
   animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class PagesComponent implements OnInit {
  admin: any;
  teacher: any;

  constructor(
    private authService: AuthService,
    public afAuth: AngularFireAuth,
    private nbMenuService: NbMenuService,
    private sidebarService: NbSidebarService
  ) {}

  menu = MENU_ITEMS;
  smenu = STUDENT_ITEMS;
  tmenu = TEACHER_ITEMS;

  async ngOnInit() {
    this.admin = await this.getCustomToken();
    console.log('role value from pages console', this.admin);
    this.teacher = await this.getCustomTokenTeacher();
    console.log('teacher value from pages console', this.teacher);

    //added logout function to logout option in the menu using NbMenuService
    this.nbMenuService.onItemClick().subscribe((event) => {
      if (event.item.title === 'Logout') {
        this.authService.logout();
      }
    });
  }



  getCustomToken() {
    return this.afAuth.authState
      .pipe(first())
      .toPromise()
      .then(async (user) => {
        return user.getIdTokenResult().then((data) => {
          if (data.claims.admin) return data.claims.admin;
        });
      });
  }

  getCustomTokenTeacher() {
    return this.afAuth.authState
      .pipe(first())
      .toPromise()
      .then(async (user) => {
        return user.getIdTokenResult().then((data) => {
          if (data.claims.teacher) return data.claims.teacher;
        });
      });
  }
}
