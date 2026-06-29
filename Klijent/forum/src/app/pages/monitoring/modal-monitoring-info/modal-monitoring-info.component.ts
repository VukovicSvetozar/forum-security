import { Component, Inject, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { BackendService } from '../../../services/backend.service';
import { ErrorMessageResponse } from 'src/app/model/errorMessageResponse';

@Component({
  selector: 'app-modal-monitoring-info',
  standalone: true,
  imports: [NgStyle, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatCardModule],
  templateUrl: './modal-monitoring-info.component.html',
  styleUrl: './modal-monitoring-info.component.css'
})
export class ModalMonitoringInfoComponent implements OnInit {

  errorMessage!: ErrorMessageResponse;
  constructor(private backendService: BackendService, @Inject(MAT_DIALOG_DATA) public id: string | null) {
  }

  ngOnInit(): void {
    this.getErrorMessage();
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  public getErrorMessage() {
    this.backendService.getErrorMessage(Number(this.id)).subscribe({
      next: (response) => {
        this.errorMessage = response;
      }
    });
  }

}
