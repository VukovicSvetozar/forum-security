import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BackendService } from '../../../services/backend.service';
import { StorageService } from '../../../services/storage.service';
import { AuthenticationRequest } from '../../../model/authenticationRequest';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatIcon, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  passwordView: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private storageService: StorageService,
    private snackBar: MatSnackBar,
    private router: Router) {
    this.passwordView = true;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]*$'), Validators.minLength(3), Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.pattern(/^(?!.*[<>\"'\\\/])(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*_=+\-])(?=\S+$).{8,}$/), Validators.minLength(8)]]
    });
  }

  changeVisibilityPassword(input: any) {
    input.type = this.passwordView ? 'text' : 'password';
    this.passwordView = !this.passwordView;
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }
    const request: AuthenticationRequest = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }
    this.backendService.login(request).subscribe({
      next: (response) => {
        this.storageService.saveLoginData(response);
        const snackBarRef = this.snackBar.open('Provjerite svoj e-mail za dalja uputstva o autentifikaciji.', 'Nastavi autentifikaciju.', { duration: 4000 });
        snackBarRef.onAction().subscribe(() => {
          this.router.navigate(['/auth/verification-code']);
        });
        snackBarRef.afterDismissed().subscribe(() => {
          this.router.navigate(['/auth/verification-code']);
        });
      },
      error: () => {
        this.snackBar.open('Došlo je do greške prilikom prijave!', 'Zatvori', { duration: 6000 });
        this.loginForm.reset();
      }
    })
  }

  gitHubLogin(): void {
    const clientId = 'Ov23li5g0AM8ku4JiuZv';
    const redirectUri = 'https://localhost:4200/auth/oauth2-callback';
    const scope = 'user:email';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  }

}
