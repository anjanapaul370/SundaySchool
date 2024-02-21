import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuService } from '@nebular/theme';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {

  constructor(private menuService: NbMenuService, private router: Router) {
  }

  goToHome() {
    this.router.navigate(['/pages/test']);
  }
}
