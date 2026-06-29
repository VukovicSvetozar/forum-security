import { CanActivateFn, CanActivateChildFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, map, switchMap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { Observable, of } from 'rxjs';

export const canActivateGroup: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const storageService = inject(StorageService);
  const router = inject(Router);
  const expectedGroup = route.data['expectedGroup'];

  return storageService.checkIfVerified().pipe(
    map((isVerified) => {
      if (isVerified) {
        if (storageService.hasGroup(expectedGroup)) {
          return true;
        } else {
          return router.createUrlTree(['forum/home']);
        }
      } else {
        return router.createUrlTree(['forum/home']);
      }
    }),
    catchError(() => {
      return of(router.createUrlTree(['forum/home']));
    })
  );
};

export const canActivateGroupChild: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => canActivateGroup(route, state);

export const canActivateForLoginAndRegistration: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const storageService = inject(StorageService);
  const router = inject(Router);
  return storageService.checkIfVerified().pipe(
    map(isVerified => {
      if (!isVerified) {
        return true;
      } else {
        return router.createUrlTree(['forum/home']);
      }
    })
  );
};

export const canActivateForLoginAndRegistrationChild: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => canActivateForLoginAndRegistration(route, state);

export const canActivateForVerificationCode: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const storageService = inject(StorageService);
  const router = inject(Router);
  return storageService.checkIfLoggedIn().pipe(
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      } else {
        return router.createUrlTree(['forum/home']);
      }
    })
  );
};

export const canActivateForVerificationCodeChild: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => canActivateForVerificationCode(route, state);
