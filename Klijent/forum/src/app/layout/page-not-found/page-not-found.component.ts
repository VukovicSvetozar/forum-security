import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';


@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [MenuComponent],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {

}
