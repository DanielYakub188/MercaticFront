import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ErrorModalComponent } from '../../shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from '../../shared/components/success-modal/success-modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, ErrorModalComponent, SuccessModalComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private auth: AuthService, private router: Router) { }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  // 👇 control del modal
  showError = false;
  errorMessage = '';

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value as { email: string; password: string };
      this.auth.login(email, password).subscribe({
        next: (res) => {
          this.auth.setSession(res);
          this.router.navigate(['/']);
        },
        error: () => {
          this.errorMessage = 'Credenciales inválidas. Por favor, revisa tu email y contraseña.';
          this.showError = true;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  // 👇 método para cerrar modal
  closeErrorModal() {
    this.showError = false;
  }
}
