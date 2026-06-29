import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackendService } from '../../../services/backend.service';
import { CommentCorrectionRequest } from '../../../model/commentCorrectionRequest';
import { CommentInfoResponse } from '../../../model/commentInfoResponse';

@Component({
  selector: 'app-modal-comment-edit',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './modal-comment-edit.component.html',
  styleUrl: './modal-comment-edit.component.css'
})
export class ModalCommentEditComponent implements OnInit {

  commentForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ModalCommentEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, correctionUsername: string, commentCreatorUsername: string }) { }

  ngOnInit(): void {
    this.commentForm = this.formBuilder.group({
      content: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(300), Validators.pattern('^[a-zA-Z0-9_ .,!?čćžđšČĆŽĐŠ\n\r]*$')]]
    });
    this.backendService.getCommentInfo(this.data.id).subscribe((response: CommentInfoResponse) => {
      const content = {
        content: response.content
      }
      this.commentForm.patchValue(content);
    });
  }

  editComment() {
    if (this.commentForm.invalid) {
      return;
    }
    const request: CommentCorrectionRequest = {
      id: this.data.id,
      content: this.commentForm.value.content,
      correctionUsername: this.data.correctionUsername,
      commentCreatorUsername: this.data.commentCreatorUsername
    }
    this.backendService.correctComment(request!).subscribe({
      next: (response) => {
        this.snackBar.open('Komentar je uspješno uređen!', 'Zatvori', { duration: 5000 });
        this.commentForm.reset();
        this.dialogRef.close(response);
      },
      error: (error) => {
        if (error.status == 500) {
          this.snackBar.open('Nemate dozvolu da uređujete odabrani komentar!', 'Zatvori', { duration: 5000 });
        } else {
          this.snackBar.open('Došlo je do greške prilikom uređivanja komentara!', 'Zatvori', { duration: 5000 });
        }
        this.commentForm.reset();
        this.dialogRef.close();
      }
    });
  }

  cancel() {
    this.commentForm.reset();
    this.dialogRef.close();
  }

}
