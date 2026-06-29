import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackendService } from '../../../services/backend.service';
import { CommentAddRequest } from '../../../model/commentAddRequest';

@Component({
  selector: 'app-modal-comment-add',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './modal-comment-add.component.html',
  styleUrl: './modal-comment-add.component.css'
})
export class ModalCommentAddComponent implements OnInit {

  commentForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ModalCommentAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { topicId: number | null, username: string }) { }

  ngOnInit(): void {
    this.commentForm = this.formBuilder.group({
      content: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(300), Validators.pattern('^[a-zA-Z0-9_ .,!?čćžđšČĆŽĐŠ\n\r]*$')]]
    });
  }

  addComment() {
    if (this.commentForm.invalid) {
      return;
    }
    const request: CommentAddRequest = {
      content: this.commentForm.value.content,
      username: this.data.username,
      topicId: Number(this.data.topicId)
    }
    this.backendService.addComment(request!).subscribe({
      next: () => {
        this.snackBar.open('Komentar je uspješno dodat!', 'Zatvori', { duration: 5000 });
        this.commentForm.reset();
        this.dialogRef.close(true);
      },
      error: (error) => {
        if (error.status == 500) {
          this.snackBar.open('Nemate dozvolu da komentarišete temu!', 'Zatvori', { duration: 5000 });
        } else {
          this.snackBar.open('Došlo je do greške prilikom dodavanja komentara!', 'Zatvori', { duration: 5000 });
        }
        this.commentForm.reset();
        this.dialogRef.close(true);
      }
    });
  }

  cancel() {
    this.commentForm.reset();
    this.dialogRef.close();
  }

}