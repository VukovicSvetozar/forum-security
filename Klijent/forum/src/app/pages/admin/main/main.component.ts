import { Component, OnInit, } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { MenuComponent } from '../../../layout/menu/menu.component';
import { ModalUserVerificationComponent } from '../modal-user-verification/modal-user-verification.component';
import { ModalUserChangeGroupComponent } from '../modal-user-change-group/modal-user-change-group.component';
import { ModalUserChangePermissionsComponent } from '../modal-user-change-permissions/modal-user-change-permissions.component';
import { ModalUserSuspendComponent } from '../modal-user-suspend/modal-user-suspend.component';
import { ModalUserDeactivateComponent } from '../modal-user-deactivate/modal-user-deactivate.component';
import { ModalTopicAddComponent } from '../modal-topic-add/modal-topic-add.component';
import { ModalTopicArchiveComponent } from '../modal-topic-archive/modal-topic-archive.component';
import { ModalTopicEditComponent } from '../modal-topic-edit/modal-topic-edit.component';
import { BackendService } from '../../../services/backend.service';
import { UserDataResponse } from '../../../model/userDataResponse';
import { TopicInfoResponse } from '../../../model/topicInfoResponse';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MenuComponent, ReactiveFormsModule, NgClass, MatSidenavModule, MatTabsModule, MatIconModule, MatExpansionModule,
    MatSelectModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, MatPaginatorModule, MatToolbarModule, MatTooltip],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  filterForm!: FormGroup;
  groupNames: string[] = [];
  statusNames: string[] = [];

  users: UserDataResponse[] = [];
  dataSourceUser: MatTableDataSource<UserDataResponse>;

  columnsToDisplayUser = ['username', 'group', 'status', 'lastVisit'];
  columnHeaders: { [key: string]: string } = {
    'username': 'Ime',
    'group': 'Grupa',
    'status': 'Status',
    'lastVisit': 'Poslednja posjeta'
  };
  columnsToDisplayUserWithExpand = [...this.columnsToDisplayUser, 'expand'];
  expandedElement!: UserDataResponse | null;

  topics: TopicInfoResponse[] = [];
  dataSourceTopic: MatTableDataSource<TopicInfoResponse>;

  columnsToDisplayTopic = ['name', 'status', 'actions'];

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) {
    this.dataSourceUser = new MatTableDataSource<UserDataResponse>();
    this.dataSourceTopic = new MatTableDataSource<TopicInfoResponse>();
  }

  ngOnInit(): void {
    this.getUsers();
    this.getAllGroupNames();
    this.getAllStatusNames();
    this.getTopicInfo();
    this.filterForm = this.formBuilder.group({
      groupNames: [null],
      statusNames: [null]
    });
  }

  getUsers() {
    this.backendService.getUsers().subscribe({
      next: (response) => {
        if (response) {
          this.users = Array.from(response);
        } else {
          this.users = [];
        }
        this.dataSourceUser = new MatTableDataSource(this.users);
      }
    });
  }

  getAllGroupNames(): void {
    this.backendService.getAllGroupNames().subscribe({
      next: (response) => {
        if (response)
          this.groupNames = Array.from(response);
      },
      error: () => {
        this.snackBar.open('Došlo je do greške prilikom odabira grupe!', 'Zatvori', { duration: 4000 });
      }
    })
  }

  getAllStatusNames(): void {
    this.backendService.getAllStatusNames().subscribe({
      next: (response) => {
        if (response)
          this.statusNames = Array.from(response);
      },
      error: () => {
        this.snackBar.open('Došlo je do greške prilikom odabira statusa!', 'Zatvori', { duration: 4000 });
      }
    })
  }

  filterUsers(): void {
    if (this.filterForm.invalid) {
      return;
    }
    let selectedGroupName = this.filterForm.value.groupNames;
    let selectedStatusName = this.filterForm.value.statusNames;
    this.backendService.getUsers(selectedGroupName, selectedStatusName).subscribe({
      next: (response) => {
        if (response) {
          this.users = Array.from(response);
        } else {
          this.users = [];
        }
        this.dataSourceUser = new MatTableDataSource(this.users);
      },
      error: () => {
        this.snackBar.open('Došlo je do greške prilikom filtriranja korisnika!', 'Zatvori', { duration: 4000 });
      }
    });
  }

  resetForm() {
    this.filterForm.reset();
  }

  searchUsers(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSourceUser.filter = searchValue.trim().toLowerCase();
  }

  openModalVerificationUser(id: string): void {
    const dialogRef = this.dialog.open(ModalUserVerificationComponent, {
      width: '400px',
      data: id
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true)
        this.getUsers();
    });
  }

  openModalChangeUserGroup(id: string): void {
    const dialogRef = this.dialog.open(ModalUserChangeGroupComponent, {
      width: '400px',
      data: id
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getUsers();
      }
    });
  }

  openModalChangePermissions(id: string, groupName: string): void {
    const dialogRef = this.dialog.open(ModalUserChangePermissionsComponent, {
      width: '1050px',
      data: { id: id, groupName: groupName }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getUsers();
      }
    });
  }

  openModalSuspendUser(id: string): void {
    const dialogRef = this.dialog.open(ModalUserSuspendComponent, {
      width: '400px',
      data: id
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getUsers();
      }
    });
  }

  openModalDeactivateUser(username: string): void {
    const dialogRef = this.dialog.open(ModalUserDeactivateComponent, {
      width: '400px',
      data: username
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getUsers();
      }
    });
  }

  getTopicInfo() {
    this.backendService.getTopicInfoList().subscribe({
      next: (response) => {
        if (response) {
          this.topics = Array.from(response);
        } else {
          this.topics = [];
        }
        this.dataSourceTopic = new MatTableDataSource(this.topics);
      }
    });
  }

  createTopic() {
    const dialogRef = this.dialog.open(ModalTopicAddComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getTopicInfo();
      }
    });
  }

  editTopic(id: number, active: boolean) {
    if (active) {
      const dialogRef = this.dialog.open(ModalTopicEditComponent, {
        width: '500px',
        data: id
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.getTopicInfo();
        }
      });
    } else {
      this.snackBar.open('Arhivirana tema se ne može uređivati!', 'Zatvori', { duration: 3000 });
    }
  }

  archiveTopic(id: number, active: boolean) {
    if (active) {
      const dialogRef = this.dialog.open(ModalTopicArchiveComponent, {
        width: '400px',
        data: id
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.getTopicInfo();
        }
      });
    } else {
      this.snackBar.open('Tema je već arhivirana!', 'Zatvori', { duration: 3000 });
    }
  }

}
