import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackendService } from '../../../services/backend.service';

@Component({
  selector: 'app-modal-user-deactivate',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './modal-user-deactivate.component.html',
  styleUrl: './modal-user-deactivate.component.css'
})
export class ModalUserDeactivateComponent {

  constructor(
    private backendService: BackendService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ModalUserDeactivateComponent>,
    @Inject(MAT_DIALOG_DATA) public username: string | null) { }

  public deactivateUser() {
    this.backendService.deactivateUser(this.username!).subscribe({
      next: () => {
        this.snackBar.open('Uspješno su obrisali korisnika!', 'Zatvori', { duration: 5000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        if (error.status == 500) {
          this.snackBar.open('Nemate dozvolu da obrišete korisnika!', 'Zatvori', { duration: 5000 });
        } else {
          this.snackBar.open('Došlo je do greške prilikom brisanja korisnika!', 'Zatvori', { duration: 4000 });
        }
        this.dialogRef.close(true);
      }
    });
  }

}
