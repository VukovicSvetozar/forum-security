import { Component, OnInit, HostListener, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { StorageService } from '../../services/storage.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, MatToolbarModule, MatButtonModule, MatIcon, MatTooltip],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  loggedIn!: boolean;
  username!: string;
  avatarUrl!: string;
  isAdmin!: boolean;
  largerScreen: boolean = true;
  logoUrl: string = 'assets/logo/logo.png';

  storageService = inject(StorageService);
  backendService = inject(BackendService);

  constructor(private viewportRuler: ViewportRuler, private router: Router, private snackBar: MatSnackBar) {
    if (this.storageService.isVerified()) {
      this.loggedIn = true;
      this.username = this.storageService.getVerificationUsername();
      this.avatarUrl = this.storageService.getAvatarUrl();
      this.isAdmin = this.storageService.hasGroup('ADMIN');
    }
    else {
      this.loggedIn = false;
      this.username = 'guest';
      this.avatarUrl = 'assets/avatars/0.png';
      this.isAdmin = false;
    }
  }

  ngOnInit() {
    this.largerScreen = this.viewportRuler.getViewportSize().width >= 900;
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.largerScreen = this.viewportRuler.getViewportSize().width >= 900;
  }

  odjava2(): void {
    this.storageService.logout();
    this.router.navigate(['/forum/home'], { skipLocationChange: true });
    this.snackBar.open('Uspješno ste se odjavili sa sistema!', 'Zatvori', { duration: 5000 });
  }

  odjava(): void {
    const request = {
      username: this.username
    }
    this.backendService.logout(request).subscribe({
      next: () => {
        this.storageService.logout();
        this.router.navigate(['/forum/home'], { skipLocationChange: true });
        this.snackBar.open('Uspješno ste se odjavili sa sistema!', 'Zatvori', { duration: 5000 });
      },
      error: () => {
        this.snackBar.open('Greška pri odjavi sa sistema!', 'Zatvori', { duration: 5000 });
      }
    });
  }

}
