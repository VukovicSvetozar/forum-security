import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { MenuComponent } from '../../../layout/menu/menu.component';
import { BackendService } from '../../../services/backend.service';
import { StorageService } from '../../../services/storage.service';
import { ModalCommentAddComponent } from '../modal-comment-add/modal-comment-add.component';
import { TopicDataResponse } from '../../../model/topicDataResponse';
import { CommentInfoResponse } from '../../../model/commentInfoResponse';
import { DatePipe } from '@angular/common';
import { ModalCommentDeleteComponent } from '../modal-comment-delete/modal-comment-delete.component';
import { ModalCommentEditComponent } from '../modal-comment-edit/modal-comment-edit.component';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [MenuComponent, RouterLink, DatePipe, MatButtonModule, MatIconModule, MatFormFieldModule,
    MatSelectModule, MatPaginatorModule, MatToolbarModule, MatTooltip],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit {

  topics: TopicDataResponse[] = [];
  topicId!: number;
  topicName!: string;
  username!: string;

  comments: CommentInfoResponse[] = [];
  currentPage: number = 0;
  totalElements: number = 0;
  totalPages: number = 0;
  numberOfElements: number = 5;

  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService,
    private storageService: StorageService,
    private paginatorIntl: MatPaginatorIntl,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.params.subscribe(prm => {
      this.topicId = prm['topic-id'];
      this.topicName = prm['topic-name'];
      this.username = this.storageService.getVerificationUsername();
      this.getTopics();
      this.getAllCommentsByTopic(this.currentPage, this.numberOfElements);
      this.paginatorIntl.itemsPerPageLabel = 'Broj komentara po stranici:';
      this.paginatorIntl.nextPageLabel = 'Sledeća stranica';
      this.paginatorIntl.previousPageLabel = 'Prethodna stranica';
    });
  }

  getTopics() {
    this.backendService.getTopics().subscribe({
      next: (response) => {
        if (response) {
          this.topics = Array.from(response);
        } else {
          this.topics = [];
        }
      }
    });
  }

  getAllCommentsByTopic(currentPage: number, numberOfElements: number) {
    this.backendService.getAllCommentsByTopic(this.topicId, currentPage, numberOfElements).subscribe({
      next: (response) => {
        this.comments = response.comments;
        this.currentPage = response.currentPage;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      }
    });
  }

  changePage(event: PageEvent) {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    this.getAllCommentsByTopic(pageIndex, pageSize);
  }

  openModalAddComment(): void {
    const dialogRef = this.dialog.open(ModalCommentAddComponent, {
      width: '500px',
      data: { topicId: this.topicId, username: this.username }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getAllCommentsByTopic(this.currentPage, this.numberOfElements);
      }
    });
  }

  formatDateTime(dateTime: Date): { date: string, time: string } {
    const datePipe = new DatePipe('en-US');
    const date = datePipe.transform(dateTime, 'yyyy-MM-dd')!;
    const time = datePipe.transform(dateTime, 'HH:mm:ss')!;
    return { date, time };
  }

  openModalCorrectComment(id: number, commentCreatorUsername: string) {
    const dialogRef = this.dialog.open(ModalCommentEditComponent, {
      width: '500px',
      data: { id: id, correctionUsername: this.username, commentCreatorUsername: commentCreatorUsername }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllCommentsByTopic(this.currentPage, this.numberOfElements);
      }
    });
  }

  openModalDeleteComment(id: number, username: string): void {
    const dialogRef = this.dialog.open(ModalCommentDeleteComponent, {
      width: '400px',
      data: { id: id, username: username }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getAllCommentsByTopic(this.currentPage, this.numberOfElements);
      }
    });
  }

}
