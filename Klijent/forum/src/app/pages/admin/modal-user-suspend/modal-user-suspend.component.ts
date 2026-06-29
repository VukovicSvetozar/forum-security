import { Component, Inject, ViewChild } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BackendService } from '../../../services/backend.service';
import { SuspendUserRequest } from '../../../model/suspendUserRequest';

@Component({
  selector: 'app-modal-user-suspend',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatButtonModule, DatePipe, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './modal-user-suspend.component.html',
  styleUrl: './modal-user-suspend.component.css'
})
export class ModalUserSuspendComponent {

  @ViewChild('picker') picker!: MatDatepicker<Date>;
  selectedDate: Date | null = null;

  constructor(
    private backendService: BackendService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ModalUserSuspendComponent>,
    @Inject(MAT_DIALOG_DATA) public id: string | null) { }

  public suspendUser() {
    if (this.selectedDate) {
      const datePipe = new DatePipe('en-US');

      const formattedDate = datePipe.transform(this.selectedDate, 'yyyy-MM-dd');

      let request: SuspendUserRequest = {
        userId: Number.parseInt(this.id!),
        suspendExpiration: formattedDate!
      };
      this.backendService.suspendUser(request).subscribe({
        next: () => {
          this.snackBar.open('Uspješno ste suspendovali korisnika!', 'Zatvori', { duration: 5000 });
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open('Došlo je do greške prilikom suspenzije korisnika!', 'Zatvori', { duration: 4000 });
        }
      });
    } else {
      this.snackBar.open('Molimo odaberite datum suspenzije!', 'Zatvori', { duration: 4000 });
    }
  }

  onDateChange(date: Date | null) {
    this.selectedDate = date;
  }

}
