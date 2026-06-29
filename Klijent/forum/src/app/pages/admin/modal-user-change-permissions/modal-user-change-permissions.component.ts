import { Component, Inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackendService } from '../../../services/backend.service';
import { ChangePermissionsRequest } from '../../../model/changePermissionsRequest';

@Component({
  selector: 'app-modal-user-change-permissions',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, CdkDropListGroup, CdkDropList, CdkDrag],
  templateUrl: './modal-user-change-permissions.component.html',
  styleUrl: './modal-user-change-permissions.component.css'
})
export class ModalUserChangePermissionsComponent implements OnInit {

  groupPermissions: string[] = [];
  userPermissions: string[] = [];
  availablePermissions: string[] = [];

  constructor(
    private backendService: BackendService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ModalUserChangePermissionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any | null) {
  }

  ngOnInit(): void {
    this.getAvailablePermissions();
  }

  public getGroupPermissions() {
    this.backendService.getGroupPermissions(this.data.groupName!).subscribe({
      next: (response) => {
        this.groupPermissions = Array.from(response);
      }
    });
  }

  public getUserPermissions() {
    this.backendService.getUserPermissions(this.data.id!).subscribe({
      next: (response) => {
        this.userPermissions = Array.from(response);
      }
    });
  }

  public getAvailablePermissions() {
    forkJoin([
      this.backendService.getGroupPermissions(this.data.groupName!),
      this.backendService.getUserPermissions(this.data.id!)
    ]).subscribe({
      next: ([groupPermissions, userPermissions]) => {
        this.groupPermissions = Array.from(groupPermissions);
        this.userPermissions = Array.from(userPermissions);
        this.availablePermissions = this.groupPermissions.filter(permission => !this.userPermissions.includes(permission));
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  public changePermissions() {
    let request: ChangePermissionsRequest = {
      userId: this.data.id,
      newPermissions: this.userPermissions
    };
    this.backendService.changePermissions(request).subscribe({
      next: () => {
        this.getAvailablePermissions();
        this.snackBar.open('Uspješno su promjenjene permisije korisnika!', 'Zatvori', { duration: 5000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        if (error.status == 500) {
          this.snackBar.open('Nemate dozvolu da promjenite permisije korisnika!', 'Zatvori', { duration: 5000 });
        } else {
          this.snackBar.open('Došlo je do greške prilikom promjene permisija korisnika!', 'Zatvori', { duration: 5000 });
        }
        this.dialogRef.close(true);
      }
    });
  }

}
