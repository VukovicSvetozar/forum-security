import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { BackendService } from '../../../services/backend.service';
import { UserVerificationRequest } from '../../../model/userVerificationRequest';

@Component({
  selector: 'app-modal-user-verification',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogTitle,
    MatFormFieldModule, MatButtonModule, MatSelectModule],
  templateUrl: './modal-user-verification.component.html',
  styleUrl: './modal-user-verification.component.css'
})
export class ModalUserVerificationComponent implements OnInit {

  verificationForm!: FormGroup;

  groupNames: string[] = [];

  constructor(
    private backendService: BackendService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ModalUserVerificationComponent>,
    @Inject(MAT_DIALOG_DATA) public id: string | null) { }

  ngOnInit(): void {
    this.getAllGroupNames();
    this.verificationForm = this.formBuilder.group({
      status: [null, Validators.required],
      group: [null, Validators.required]
    });
  }

  getAllGroupNames(): void {
    this.backendService.getAllGroupNames().subscribe({
      next: (response) => {
        if (response)
          this.groupNames = Array.from(response).filter(group => group != "GUEST");
      },
      error: () => {
        this.snackBar.open('Došlo je do greške prilikom odabira grupe!', 'Zatvori', { duration: 4000 });
      }
    })
  }

  public verifyUserAccount() {
    let statusValue = this.verificationForm.value.status;
    let isApproved = statusValue === 'approved';

    let request: UserVerificationRequest = {
      userId: Number.parseInt(this.id!),
      approved: isApproved,
      group: this.verificationForm.value.group
    };
    this.backendService.verifyUserAccount(request).subscribe({
      next: () => {
        this.snackBar.open('Korisnik je uspješno verifikovan!', 'Zatvori', { duration: 5000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        if (error.status == 500) {
          this.snackBar.open('Nemate dozvolu da verifikujete korisnika!', 'Zatvori', { duration: 5000 });
        } else {
          this.snackBar.open('Došlo je do greške prilikom verifikacije korisnika!', 'Zatvori', { duration: 5000 });
        }
        this.dialogRef.close(true);
      }
    });
  }

}
