import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MenuComponent } from '../../../layout/menu/menu.component';
import { BackendService } from '../../../services/backend.service';
import { UserDataResponse } from '../../../model/userDataResponse';
import { ModalUserInfoComponent } from '../modal-user-info/modal-user-info.component';

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [MenuComponent, MatFormFieldModule, MatTableModule, MatInputModule],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  templateUrl: './member.component.html',
  styleUrl: './member.component.css'
})
export class MemberComponent {

  users: UserDataResponse[] = [];
  dataSource: MatTableDataSource<UserDataResponse>;

  columnsToDisplay = ['profile', 'username', 'group', 'totalPosts', 'accessDate'];
  columnHeaders: { [key: string]: string } = {
    'profile': 'Profil',
    'username': 'Ime',
    'group': 'Grupa',
    'totalPosts': 'Postovi',
    'accessDate': 'Pridružio se'
  };

  constructor(private backendService: BackendService, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<UserDataResponse>();
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.backendService.getUsers().subscribe({
      next: (response) => {
        if (response) {
          this.users = Array.from(response);
        } else {
          this.users = [];
        }
        this.dataSource = new MatTableDataSource(this.users);
      }
    });
  }

  searchUsers(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim().toLowerCase();
  }

  openModalInfoUser(id: string): void {
    this.dialog.open(ModalUserInfoComponent, {
      width: '400px',
      data: id
    });
  }


}
