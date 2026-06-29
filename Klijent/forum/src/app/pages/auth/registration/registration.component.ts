import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ModalAvatarComponent } from '../modal-avatar/modal-avatar.component';
import { BackendService } from '../../../services/backend.service';
import { UserRegistrationRequest } from '../../../model/userRegistrationRequest';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatIcon, MatButtonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit {

  registrationForm!: FormGroup;
  passwordView: boolean;
  avatarUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private backendService: BackendService,
    private snackBar: MatSnackBar,
    private router: Router) {
    this.passwordView = true;
    this.avatarUrl = 'assets/avatars/0.png';
  }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]*$'), Validators.minLength(3), Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.pattern(/^(?!.*[<>\"'\\\/])(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*_=+\-])(?=\S+$).{8,}$/), Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.maxLength(100), Validators.email]],
      avatarUrl: [this.avatarUrl]
    });
  }

  changeVisibilityPassword(input: any) {
    input.type = this.passwordView ? 'text' : 'password';
    this.passwordView = !this.passwordView;
  }

  openAvatarDialog(): void {
    const dialogRef = this.dialog.open(ModalAvatarComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        this.avatarUrl = result;
      }
    });
  }

  checkUsernameAvailability(): void {
    const checkUsername = this.registrationForm.get('username');
    if (checkUsername && checkUsername.value && checkUsername.value.length >= 3) {
      this.backendService.checkUsernameAvailability(checkUsername.value).subscribe((available) => {
        if (!available) {
          checkUsername.setErrors({ usernameNotAvailable: true });
        }
      });
    }
  }

  checkEmailAvailability(): void {
    const checkEmail = this.registrationForm.get('email');
    if (checkEmail && checkEmail.value) {
      this.backendService.checkEmailAvailability(checkEmail.value).subscribe((available) => {
        if (!available) {
          checkEmail.setErrors({ emailNotAvailable: true });
        }
      });
    }
  }

  registrationUser(): void {
    if (this.registrationForm.invalid) {
      return;
    }
    const request: UserRegistrationRequest = {
      username: this.registrationForm.value.username,
      password: this.registrationForm.value.password,
      email: this.registrationForm.value.email,
      avatarUrl: this.avatarUrl
    }
    this.backendService.registrationUser(request).subscribe({
      next: () => {
        const snackBarRef = this.snackBar.open('Registracija je završena. U slučaju uspješne verifikacije naloga dobićete e-mail odobrenja od strane administratora.', 'Početna strana.', { duration: 5000 });
        snackBarRef.onAction().subscribe(() => {
          this.router.navigate(['/home']);
        });
        snackBarRef.afterDismissed().subscribe(() => {
          this.router.navigate(['/home']);
        });
        this.registrationForm.reset();
      },
      error: (error) => {
        this.snackBar.open('Došlo je do greške prilikom registracije!', 'Zatvori', { duration: 5000 });
      }
    });
  }

}
