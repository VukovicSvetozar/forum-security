import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackendService } from '../../../services/backend.service';
import { CommentDeleteRequest } from '../../../model/commentDeleteRequest';

@Component({
  selector: 'app-modal-comment-delete',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './modal-comment-delete.component.html',
  styleUrl: './modal-comment-delete.component.css'
})
export class ModalCommentDeleteComponent {

  constructor(
    private backendService: BackendService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ModalCommentDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any | null) {
  }

  public deleteComment() {
    const request: CommentDeleteRequest = {
      id: this.data.id,
      commentCreatorUsername: this.data.username
    }
    this.backendService.deleteComment(request).subscribe({
      next: () => {
        this.snackBar.open('Komentar je uspješno obrisan!', 'Zatvori', { duration: 5000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        if (error.status == 500) {
          this.snackBar.open('Nemate dozvolu da brišete komentare!', 'Zatvori', { duration: 5000 });
        } else {
          this.snackBar.open('Došlo je do greške prilikom brisanja komentara!', 'Zatvori', { duration: 4000 });
        }
        this.dialogRef.close(true);
      }
    });
  }

}