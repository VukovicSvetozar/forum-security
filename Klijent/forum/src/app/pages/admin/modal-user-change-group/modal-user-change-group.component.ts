import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BackendService } from '../../../services/backend.service';
import { ChangeUserGroupRequest } from '../../../model/changeUserGroupRequest';

@Component({
  selector: 'app-modal-user-change-group',
  standalone: true,
  imports: [ReactiveFormsModule, MatSelectModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './modal-user-change-group.component.html',
  styleUrl: './modal-user-change-group.component.css'
})
export class ModalUserChangeGroupComponent implements OnInit {

  groupForm!: FormGroup;

  groupNames: string[] = [];

  constructor(
    private backendService: BackendService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ModalUserChangeGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public id: string | null) { }

  ngOnInit(): void {
    this.getAllGroupNames();
    this.groupForm = this.formBuilder.group({
      newGroup: [null, Validators.required]
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

  public changeUserGroup() {
    let request: ChangeUserGroupRequest = {
      userId: Number.parseInt(this.id!),
      newGroup: this.groupForm.value.newGroup
    };
    this.backendService.changeUserGroup(request).subscribe({
      next: () => {
        this.snackBar.open('Uspješno je promjenjena grupa korisnika!', 'Zatvori', { duration: 5000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        if (error.status == 400) {
          this.snackBar.open('Korisnikova grupa nije promjenjena!', 'Zatvori', { duration: 5000 });
        } else if (error.status == 500) {
          this.snackBar.open('Nemate dozvolu da mijenjate grupu korisnika!', 'Zatvori', { duration: 5000 });
        } else {
          this.snackBar.open('Došlo je do greške prilikom promjene grupe!', 'Zatvori', { duration: 5000 });
        }
        this.dialogRef.close(true);
      }
    });
  }

}
