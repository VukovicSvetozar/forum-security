import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { StorageService } from './storage.service';
import { BackendService } from './backend.service';
import { TokenRefreshRequest } from '../model/tokenRefreshRequest';
import { TokenRefreshResponse } from '../model/tokenRefreshResponse';

export const tokenInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const storageService = inject(StorageService);
  const backendService = inject(BackendService);

  if (!request.url.includes('/public')) {
    const jwtToken = storageService.getJwtToken();
    if (jwtToken) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${jwtToken}`)
      });
      return next(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && error.error?.message === 'Token has expired.') {

            const refreshTokenRequest: TokenRefreshRequest = {
              refreshJwtToken: storageService.getRefreshJwtToken()
            }
            return backendService.refreshToken(refreshTokenRequest).pipe(
              switchMap((response: TokenRefreshResponse) => {
                storageService.saveVerificationData(response);
                const retryRequest = request.clone({
                  headers: request.headers.set('Authorization', `Bearer ${response.jwtToken}`)
                });
                return next(retryRequest);
              }),
              catchError(err => {
                storageService.removeVerificationData();
                return throwError(() => err);
              })
            );
          }
          return throwError(() => error);
        })
      );
    }
  }
  return next(request);
};
