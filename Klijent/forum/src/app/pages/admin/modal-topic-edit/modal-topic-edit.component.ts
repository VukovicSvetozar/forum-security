import { Component, Inject, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackendService } from '../../../services/backend.service';
import { TopicChangeRequest } from '../../../model/topicChangeRequest';
import { TopicInfoResponse } from '../../../model/topicInfoResponse';

@Component({
  selector: 'app-modal-topic-edit',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, MatDialogModule, MatGridListModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIcon],
  templateUrl: './modal-topic-edit.component.html',
  styleUrl: './modal-topic-edit.component.css'
})
export class ModalTopicEditComponent implements OnInit {

  topicForm!: FormGroup;
  topicName!: string;
  selectedImage: string | null = null;

  listTopicImage: string[] = [
    'assets/topics/1.png',
    'assets/topics/2.png',
    'assets/topics/3.png',
    'assets/topics/4.png',
    'assets/topics/5.png',
    'assets/topics/6.png',
    'assets/topics/7.png',
    'assets/topics/8.png',
    'assets/topics/9.png',
    'assets/topics/10.png',
    'assets/topics/11.png',
    'assets/topics/12.png'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ModalTopicEditComponent>,
    @Inject(MAT_DIALOG_DATA) public id: number | null) { }

  ngOnInit(): void {
    this.topicForm = this.formBuilder.group({
      topicName: ["", Validators.required],
      selectedImage: [null, Validators.required]
    });
    this.backendService.getTopicInfo(this.id!).subscribe((response: TopicInfoResponse) => {
      const topic = {
        topicName: response.name,
        selectedImage: response.imageUrl
      }
      this.topicForm.patchValue(topic);
      this.topicName = response.name;
    });
  }

  selectImage(image: string) {
    this.selectedImage = image;
    this.topicForm.get('selectedImage')?.setValue(image);
  }

  checkNameAvailability(): void {
    const checkName = this.topicForm.get('topicName');
    console.log(checkName?.value, this.topicName);
    if (checkName && checkName.value && checkName.value != this.topicName && checkName.value.length >= 3) {
      this.backendService.checkTopicNameAvailability(checkName.value).subscribe((available) => {
        if (!available) {
          checkName.setErrors({ topicNameNotAvailable: true });
        }
      });
    }
  }

  createTopic() {
    const request: TopicChangeRequest = {
      id: this.id!,
      name: this.topicForm.value.topicName,
      imageUrl: this.topicForm.value.selectedImage
    }
    this.backendService.changeTopic(request).subscribe({
      next: () => {
        this.snackBar.open('Uspješno ste uredili odabranu temu!', 'Zatvori', { duration: 5000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        if (error.status == 500) {
          this.snackBar.open('Nemate dozvolu da uređujete temu!', 'Zatvori', { duration: 5000 });
        } else {
          this.snackBar.open('Došlo je do greške prilikom uređivanja teme!', 'Zatvori', { duration: 5000 });
        }
        this.dialogRef.close(true);
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}

