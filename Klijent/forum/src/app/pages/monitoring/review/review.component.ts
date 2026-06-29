import { Component, OnInit, } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MenuComponent } from '../../../layout/menu/menu.component';
import { BackendService } from '../../../services/backend.service';
import { ErrorMessageResponse } from '../../../model/errorMessageResponse';
import { ModalMonitoringInfoComponent } from '../modal-monitoring-info/modal-monitoring-info.component';
import { LogDataResponse } from 'src/app/model/logDataResponse';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [MenuComponent, ReactiveFormsModule, NgClass, DatePipe, MatSidenavModule, MatTabsModule, MatIconModule, MatExpansionModule,
    MatSelectModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, MatPaginatorModule,
    MatToolbarModule, MatTooltip, MatSlideToggleModule],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit {

  filterDataForm!: FormGroup;
  filterLogsForm!: FormGroup;

  errorMessage: ErrorMessageResponse[] = [];
  dataSourceErrorMessage: MatTableDataSource<ErrorMessageResponse>;
  columnsToDisplayErrorMessage = ['status', 'time', 'details'];

  logsMessage: LogDataResponse[] = [];
  dataSourceLogsMessage: MatTableDataSource<LogDataResponse>;
  columnsToDisplayLogsMessage = ['type', 'date', 'message'];

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) {
    this.dataSourceErrorMessage = new MatTableDataSource<ErrorMessageResponse>();
    this.dataSourceLogsMessage = new MatTableDataSource<LogDataResponse>();
  }

  ngOnInit(): void {
    this.getErrorMessages();
    this.filterDataForm = this.formBuilder.group({
      starttime: [null, Validators.required],
      endtime: [null, Validators.required]
    });
    this.filterLogsForm = this.formBuilder.group({
      starttime: [null],
      endtime: [null],
      info: [false],
      trace: [false],
      debug: [false],
      warn: [false],
      error: [false],
      fatal: [false]
    });
  }

  filterErrorMessages(): void {
    if (this.filterDataForm.invalid) {
      return;
    }
    let selectedStartTime = this.filterDataForm.value.starttime;
    let selectedEndTime = this.filterDataForm.value.endtime;
    this.getErrorMessages(selectedStartTime, selectedEndTime);
  }

  resetDataForm() {
    this.filterDataForm.reset();
    this.getErrorMessages();
  }

  searchErrorMessages(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSourceErrorMessage.filter = searchValue.trim().toLowerCase();
  }

  getErrorMessages(startTime?: string, endTime?: string) {
    this.backendService.getErrorMessages(startTime, endTime).subscribe({
      next: (response) => {
        if (response) {
          this.errorMessage = Array.from(response);
          this.errorMessage.sort((a, b) => {
            const timeA = new Date(a.time).getTime();
            const timeB = new Date(b.time).getTime();
            return timeB - timeA;
          });
        } else {
          this.errorMessage = [];
        }
        this.dataSourceErrorMessage = new MatTableDataSource(this.errorMessage);
      },
      error: () => {
        this.snackBar.open('Došlo je do greške prilikom filtriranja poruka!', 'Zatvori', { duration: 4000 });
      }
    });
  }

  showDetails(id: number) {
    this.dialog.open(ModalMonitoringInfoComponent, {
      width: '650px',
      data: id
    });
  }

  filterLogs() {
    if (this.filterLogsForm.invalid) {
      return;
    }
    let selectedInfo = this.filterLogsForm.value.info && 'info';
    let selectedTrace = this.filterLogsForm.value.trace && 'trace';
    let selectedDebug = this.filterLogsForm.value.debug && 'debug';
    let selectedWarn = this.filterLogsForm.value.warn && 'warn';
    let selectedError = this.filterLogsForm.value.error && 'error';
    let selectedFatal = this.filterLogsForm.value.fatal && 'fatal';
    let selectedStartTime = this.filterLogsForm.value.starttime;
    let selectedEndTime = this.filterLogsForm.value.endtime;
    this.getLogs(selectedInfo, selectedTrace, selectedDebug, selectedWarn, selectedError, selectedFatal, selectedStartTime, selectedEndTime);
  }

  resetLogsForm() {
    this.filterLogsForm.reset();
    this.getLogs();
  }

  getLogs(logLevelInfo?: string, logLevelTrace?: string, logLevelDebug?: string, logLevelWarn?: string, logLevelError?: string, logLevelFatal?: string, startTime?: string, endTime?: string) {
    this.backendService.getLogs(logLevelInfo, logLevelTrace, logLevelDebug, logLevelWarn, logLevelError, logLevelFatal, startTime, endTime).subscribe({
      next: (response) => {
        if (response) {
          this.logsMessage = Array.from(response);
        } else {
          this.logsMessage = [];
        }
        this.dataSourceLogsMessage = new MatTableDataSource(this.logsMessage);
      },
      error: () => {
        this.snackBar.open('Došlo je do greške prilikom prikazivanja logovanih poruka!', 'Zatvori', { duration: 4000 });
      }
    });
  }

}
