import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackendService } from 'src/app/services/backend.service';
import { StorageService } from 'src/app/services/storage.service';
import { OAuth2Request } from 'src/app/model/oAuth2Request';

@Component({
  selector: 'app-oauth2-callback',
  standalone: true,
  imports: [],
  templateUrl: './oauth2-callback.component.html',
  styleUrl: './oauth2-callback.component.css'
})
export class Oauth2CallbackComponent {

  constructor(
    private backendService: BackendService,
    private storageService: StorageService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute) {
    this.loginOAuth2();
  }

  loginOAuth2() {
    this.route.queryParams.subscribe(params => {
      const githubCode = params['code'];
      if (githubCode) {
        const request: OAuth2Request = {
          code: githubCode
        }
        this.backendService.loginOAuth2(request).subscribe({
          next: (response) => {
            if (response) {
              this.storageService.saveLoginData(response);
              const snackBarRef = this.snackBar.open('Provjerite svoj e-mail za dalja uputstva o autentifikaciji.', 'Nastavi autentifikaciju.', { duration: 4000 });
              snackBarRef.onAction().subscribe(() => {
                this.router.navigate(['/auth/verification-code']);
              });
              snackBarRef.afterDismissed().subscribe(() => {
                this.router.navigate(['/auth/verification-code']);
              });
            } else {
              const snackBarRef = this.snackBar.open('Prijava je završena. U slučaju uspješne verifikacije naloga dobićete e-mail odobrenja od strane administratora.', 'Početna strana.', { duration: 7000 });
              snackBarRef.onAction().subscribe(() => {
                this.router.navigate(['/home']);
              });
              snackBarRef.afterDismissed().subscribe(() => {
                this.router.navigate(['/home']);
              });
            }
          },
          error: () => {
            this.snackBar.open('Došlo je do greške prilikom prijave!', 'Zatvori', { duration: 7000 });
            this.router.navigate(['/auth/login']);
          }
        })
      } else {
        this.snackBar.open('Došlo je do greške prilikom rada sa GitHub-om!', 'Zatvori', { duration: 7000 });
        this.router.navigate(['/auth/login']);
      }
    });
  }

}
