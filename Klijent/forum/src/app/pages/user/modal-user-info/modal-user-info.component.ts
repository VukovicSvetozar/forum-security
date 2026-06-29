import { Component, Inject, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { BackendService } from '../../../services/backend.service';
import { UserInfoResponse } from '../../../model/userInfoResponse';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-modal-user-info',
  standalone: true,
  imports: [NgStyle, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatCardModule],
  templateUrl: './modal-user-info.component.html',
  styleUrl: './modal-user-info.component.css'
})
export class ModalUserInfoComponent implements OnInit {

  userInfo!: UserInfoResponse;
  constructor(private backendService: BackendService, private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public id: string | null) {
  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  public getUserInfo() {
    this.backendService.getUserInfo(Number(this.id)).subscribe({
      next: (response) => {
        this.userInfo = response;
      },
      error: () => {
        this.snackBar.open('Došlo je do greške prilikom prikaza profila korisnika!', 'Zatvori', { duration: 4000 });
      }
    });
  }

}
