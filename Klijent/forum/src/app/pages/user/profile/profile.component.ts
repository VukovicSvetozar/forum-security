import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuComponent } from '../../../layout/menu/menu.component';
import { ModalAvatarComponent } from '../../auth/modal-avatar/modal-avatar.component';
import { BackendService } from '../../../services/backend.service';
import { StorageService } from '../../../services/storage.service';
import { UserProfileResponse } from '../../../model/userProfileResponse';
import { UserProfileRequest } from '../../../model/userProfileRequest';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MenuComponent, ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatIcon, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  updateForm!: FormGroup;

  oldPasswordView: boolean;
  newPasswordView: boolean;
  avatarUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private backendService: BackendService,
    private storageService: StorageService,
    private snackBar: MatSnackBar,
    private router: Router) {
    this.oldPasswordView = true;
    this.newPasswordView = true;
    this.avatarUrl = this.storageService.getAvatarUrl();
  }

  ngOnInit(): void {
    this.updateForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]*$'), Validators.minLength(3), Validators.maxLength(30)]],
      oldPassword: ['', [Validators.pattern(/^(?!.*[<>\"'\\\/])(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*_=+\-])(?=\S+$).{8,}$/), Validators.minLength(8)]],
      newPassword: ['', [Validators.pattern(/^(?!.*[<>\"'\\\/])(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*_=+\-])(?=\S+$).{8,}$/), Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.maxLength(100), Validators.email]],
      avatarUrl: [this.avatarUrl]
    });
    const username = this.storageService.getVerificationUsername();
    this.backendService.getUserProfile(username).subscribe((userProfile: UserProfileResponse) => {
      this.updateForm.patchValue(userProfile);
    });
  }

  changeVisibilityOldPassword(input: any) {
    input.type = this.oldPasswordView ? 'text' : 'password';
    this.oldPasswordView = !this.oldPasswordView;
  }

  changeVisibilityNewPassword(input: any) {
    input.type = this.oldPasswordView ? 'text' : 'password';
    this.oldPasswordView = !this.oldPasswordView;
  }

  checkEmailAvailability(): void {
    const checkEmail = this.updateForm.get('email');
    if (checkEmail && checkEmail.value) {
      this.backendService.checkEmailAvailability(checkEmail.value).subscribe((available) => {
        if (!available) {
          checkEmail.setErrors({ emailNotAvailable: true });
        }
      });
    }
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

  updateUser(): void {
    if (this.updateForm.invalid) {
      return;
    }
    const request: UserProfileRequest = {
      username: this.storageService.getVerificationUsername(),
      newPassword: this.updateForm.value.newPassword,
      oldPassword: this.updateForm.value.oldPassword,
      email: this.updateForm.value.email,
      avatarUrl: this.avatarUrl
    }
    this.backendService.changeUserProfile(request).subscribe({
      next: (response) => {
        this.storageService.saveVerificationData(response);
        const snackBarRef = this.snackBar.open('Podaci su uspješno ažurirani.', 'Početna strana.', { duration: 2000 });
        snackBarRef.onAction().subscribe(() => {
          this.router.navigate(['/forum/topic']);
        });
        snackBarRef.afterDismissed().subscribe(() => {
          this.router.navigate(['/forum/topic']);
        });
        this.updateForm.reset();
      },
      error: () => {
        this.snackBar.open('Došlo je do greške prilikom ažuriranja podataka!', 'Zatvori', { duration: 4000 });
      }
    });
  }

}
