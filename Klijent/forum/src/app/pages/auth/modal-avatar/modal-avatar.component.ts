import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-modal-avatar',
  standalone: true,
  imports: [NgClass, MatDialogModule, MatGridListModule, MatButtonModule],
  templateUrl: './modal-avatar.component.html',
  styleUrl: './modal-avatar.component.css'
})
export class ModalAvatarComponent {

  selectedAvatar: string | null = null;
  listAvatars: string[] = [
    'assets/avatars/1.png',
    'assets/avatars/2.png',
    'assets/avatars/3.png',
    'assets/avatars/4.png',
    'assets/avatars/5.png',
    'assets/avatars/6.png',
    'assets/avatars/7.png',
    'assets/avatars/8.png',
    'assets/avatars/9.png',
    'assets/avatars/10.png',
    'assets/avatars/11.png',
    'assets/avatars/12.png',
    'assets/avatars/13.png',
    'assets/avatars/14.png',
    'assets/avatars/15.png',
    'assets/avatars/16.png',
    'assets/avatars/17.png',
    'assets/avatars/18.png',
    'assets/avatars/19.png',
    'assets/avatars/20.png',
    'assets/avatars/21.png',
    'assets/avatars/22.png',
    'assets/avatars/23.png',
    'assets/avatars/24.png',
    'assets/avatars/25.png',
    'assets/avatars/26.png',
    'assets/avatars/27.png',
    'assets/avatars/28.png',
    'assets/avatars/29.png',
    'assets/avatars/30.png',
    'assets/avatars/31.png',
    'assets/avatars/32.png',
    'assets/avatars/33.png',
    'assets/avatars/34.png',
    'assets/avatars/35.png',
    'assets/avatars/36.png'
  ];

  constructor(private dialogRef: MatDialogRef<ModalAvatarComponent>) { }

  selectAvatar(avatar: string) {
    this.selectedAvatar = avatar;
  }

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    this.dialogRef.close(this.selectedAvatar);
  }

}
