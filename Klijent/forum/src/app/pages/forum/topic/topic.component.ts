import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MenuComponent } from '../../../layout/menu/menu.component';
import { BackendService } from '../../../services/backend.service';
import { TopicDataResponse } from '../../../model/topicDataResponse';

@Component({
  selector: 'app-topic',
  standalone: true,
  imports: [MenuComponent, DatePipe, MatTableModule, MatIconModule],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.css'
})
export class TopicComponent implements OnInit {

  topics: TopicDataResponse[] = [];
  dataSourceTopic: MatTableDataSource<TopicDataResponse>;

  columnsToDisplayTopic = ['name', 'totalComments', 'lastCommentTime'];

  constructor(
    private backendService: BackendService,
    private router: Router,
    private snackBar: MatSnackBar) {
    this.dataSourceTopic = new MatTableDataSource<TopicDataResponse>();
  }

  ngOnInit(): void {
    this.getTopics();
  }

  getTopics() {
    this.backendService.getTopics().subscribe({
      next: (response) => {
        if (response) {
          this.topics = Array.from(response);
        } else {
          this.topics = [];
        }
        this.dataSourceTopic = new MatTableDataSource(this.topics);
      },
      error: () => {
        this.snackBar.open('Došlo je do greške prilikom prikazivanja tema!', 'Zatvori', { duration: 4000 });
      }
    });
  }

  navigateToComments(element: TopicDataResponse) {
    const topicName = element.name;
    const topicId = element.id;
    this.router.navigate([`/forum/comment/${topicName}/${topicId}`]);
  }

}
