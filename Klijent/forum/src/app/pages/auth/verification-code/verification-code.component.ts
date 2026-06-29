import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../../services/storage.service';
import { BackendService } from '../../../services/backend.service';
import { CodeVerificationRequest } from '../../../model/codeVerificationRequest';

@Component({
  selector: 'app-verification-code',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatIcon, MatButtonModule],
  templateUrl: './verification-code.component.html',
  styleUrl: './verification-code.component.css'
})
export class VerificationCodeComponent implements OnInit {

  verificationForm!: FormGroup;
  username: string = "";
  loginJwtToken: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private storageService: StorageService,
    private snackBar: MatSnackBar,
    private router: Router) {
    if (storageService.isLoggedIn()) {
      this.username = storageService.getLoginUsername();
      this.loginJwtToken = storageService.getLoginToken();
    }
  }

  ngOnInit(): void {
    this.verificationForm = this.formBuilder.group({
      secretCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  verificationSecretCode(): void {
    if (this.verificationForm.invalid) {
      return;
    }
    const request: CodeVerificationRequest = {
      username: this.username,
      secretCode: this.verificationForm.value.secretCode,
      loginJwtToken: this.loginJwtToken
    }
    this.backendService.verifyCode(request).subscribe({
      next: (response) => {
        this.storageService.saveVerificationData(response);
        const snackBarRef = this.snackBar.open('Uspješno ste prijavljeni.', 'Početna strana.', { duration: 4000 });
        snackBarRef.onAction().subscribe(() => {
          this.router.navigate(['/forum/topic']);
        });
        snackBarRef.afterDismissed().subscribe(() => {
          this.router.navigate(['/forum/topic']);
        });
        this.verificationForm.reset();
        this.storageService.finishLogin();
      },
      error: () => {
        this.snackBar.open('Došlo je do greške prilikom verifikacije naloga!', 'Zatvori', { duration: 4000 });
        this.verificationForm.reset();
      }
    });
  }

}
