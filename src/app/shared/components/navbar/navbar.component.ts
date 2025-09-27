import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isLoggedIn = false;
  userEmail: string | null = null;
  userRole: string | null = null;   // rol
  private sub!: Subscription;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.sub = this.auth.authStatus$.subscribe(status => {
      this.isLoggedIn = status;
      this.userEmail = localStorage.getItem('email');
      this.userRole = localStorage.getItem('role');
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
