import { Component } from '@angular/core';
import { AuthService } from '@/auth/services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { IONIC_STANDALONE_IMPORTS } from '@/ui/ionic-standalone.imports';

@Component({
  selector: 'auth-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...IONIC_STANDALONE_IMPORTS,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule,
    RouterModule
  ]
})

export class LoginComponent {

  loginForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  user: any = null;
  loading = false;

  
  errors: any = {
    email: null,
    password: null
  };

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async submit() {
    this.errors = {
      email: null,
      password: null
    };
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.errors = {
        email: this.emailError(),
        password: this.passwordError()
      };
      return;
    }

    this.loading = true;

    try {

      const { email, password } = this.loginForm.getRawValue();

      const login = await this.auth.login(email, password, true);

      this.user = login.user;
      const redirectUrl = await this.auth.consumeLoginRedirect('/home/help');

      this.router.navigateByUrl(redirectUrl);

    } catch (err: any) {

      this.errors = this.normalizeErrors(err?.error?.errors || {});

      console.log('Login error:', this.errors);

    } finally {

      this.loading = false;

    }

  }

  private emailError(): string | null {
    const control = this.loginForm.controls.email;

    if (control.hasError('required')) {
      return 'E-mail skal udfyldes.';
    }

    if (control.hasError('email')) {
      return 'Indtast en gyldig e-mailadresse.';
    }

    return null;
  }

  private passwordError(): string | null {
    return this.loginForm.controls.password.hasError('required')
      ? 'Kodeord skal udfyldes.'
      : null;
  }

  private normalizeErrors(errors: Record<string, string | string[]>): Record<string, string | null> {
    return {
      email: this.firstError(errors['email']),
      password: this.firstError(errors['password'])
    };
  }

  private firstError(value: string | string[] | undefined): string | null {
    if (Array.isArray(value)) {
      return String(value[0] ?? '');
    }

    return value ? String(value) : null;
  }

}
