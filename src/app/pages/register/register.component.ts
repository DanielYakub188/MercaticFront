import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Register } from '../../shared/models/Register';
import { AuthService } from '../../shared/services/auth.service';

// Validador personalizado para comprobar que las contraseñas coinciden
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})


export class RegisterComponent {
  registerForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
    apellido1: new FormControl('', [Validators.required]),
    apellido2: new FormControl(''),
    localidad: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: passwordMatchValidator });

  registrationError: string | null = null;
  registrationSuccess: boolean = false;

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (this.registerForm.valid) {
      const registerRequest: Register = {
        nombre: this.registerForm.value.nombre!,
        apellido1: this.registerForm.value.apellido1!,
        apellido2: this.registerForm.value.apellido2!,
        localidad: this.registerForm.value.localidad!,
        direccion: this.registerForm.value.direccion!,
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!
      };

      this.authService.register(registerRequest).subscribe({
        next: (res) => {
          this.registrationSuccess = true;
          this.registrationError = null;
          console.log('Usuario registrado correctamente:', res);
        },
        error: (err) => {
          this.registrationError = err.error || 'Error al registrar usuario';
          this.registrationSuccess = false;
          console.error(err);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  get nombre() { return this.registerForm.get('nombre'); }
  get apellido1() { return this.registerForm.get('apellido1'); }
  get apellido2() { return this.registerForm.get('apellido2'); }
  get localidad() { return this.registerForm.get('localidad'); }
  get direccion() { return this.registerForm.get('direccion'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}
