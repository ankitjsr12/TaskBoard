import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoginMode = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  hidePassword = true;

  authForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: [''],
    confirmPassword: [''],
  });

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = null;
    this.successMessage = null;
    this.authForm.reset();
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    const { email, password, fullName, confirmPassword } = this.authForm.value;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.isLoginMode) {
      this.authService.login(email!, password!).subscribe({
        next: () => {
          this.router.navigate(['/board']);
        },
        error: (err) => {
          this.errorMessage = err.message || 'An error occurred during login.';
        },
      });
    } else {
      if (!fullName || fullName.trim() === '') {
        this.errorMessage = 'Full Name is required.';
        return;
      }
      if (password !== confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }

      this.authService.signUp(email!, password!, fullName).subscribe({
        next: () => {
          this.successMessage = 'Registration successful! Logged in.';
          // Automatically log them in
          this.authService.login(email!, password!).subscribe(() => {
            this.router.navigate(['/board']);
          });
        },
        error: (err) => {
          this.errorMessage = err.message || 'An error occurred during registration.';
        },
      });
    }
  }
}
