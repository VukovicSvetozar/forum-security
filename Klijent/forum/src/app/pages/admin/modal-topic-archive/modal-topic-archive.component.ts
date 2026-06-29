import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackendService } from '../../../services/backend.service';

@Component({
  selector: 'app-modal-topic-archive',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './modal-topic-archive.component.html',
  styleUrl: './modal-topic-archive.component.css'
})
export class ModalTopicArchiveComponent {

  constructor(
    private backendService: BackendService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ModalTopicArchiveComponent>,
    @Inject(MAT_DIALOG_DATA) public id: number | null) { }

  public archiveTopic() {
    this.backendService.archiveTopic(this.id!).subscribe({
      next: () => {
        this.snackBar.open('Uspješno ste arhivirali odabranu temu!', 'Zatvori', { duration: 5000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        if (error.status == 500) {
          this.snackBar.open('Nemate dozvolu da arhivirate temu!', 'Zatvori', { duration: 5000 });
        } else {
          this.snackBar.open('Došlo je do greške prilikom arhiviranja teme!', 'Zatvori', { duration: 5000 });
        }
        this.dialogRef.close(true);
      }
    });
  }

}
