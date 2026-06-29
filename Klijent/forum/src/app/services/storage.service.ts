import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CodeVerificationResponse } from '../model/codeVerificationResponse';
import { LoginVerificationResponse } from '../model/loginVerificationResponse';
import { TokenRefreshResponse } from '../model/tokenRefreshResponse';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly platform_id = inject(PLATFORM_ID);

  public static readonly LOGIN_DATA = "LOGIN_DATA";
  public static readonly VERIFICATION_DATA = "VERIFICATION_DATA";


  constructor() { }

  public saveLoginData(data: LoginVerificationResponse) {
    if (isPlatformBrowser(this.platform_id)) {
      localStorage.setItem(StorageService.LOGIN_DATA, JSON.stringify(data));
    }
  }

  public finishLogin(): void {
    if (isPlatformBrowser(this.platform_id)) {
      localStorage.removeItem(StorageService.LOGIN_DATA);
    }
  }

  private getLoginData(): LoginVerificationResponse | null {
    let data = null;
    if (isPlatformBrowser(this.platform_id)) {
      const storedData = localStorage.getItem(StorageService.LOGIN_DATA);
      if (storedData) {
        data = JSON.parse(storedData);
      }
    }
    return data;
  }

  public isLoggedIn(): boolean {
    return this.getLoginData() !== null;
  }

  public getLoginUsername(): string {
    return this.getLoginData()!.username;
  }

  public getLoginToken(): string {
    return this.getLoginData()!.loginJwtToken;
  }

  public saveVerificationData(data: CodeVerificationResponse | TokenRefreshResponse) {
    if (isPlatformBrowser(this.platform_id)) {
      localStorage.setItem(StorageService.VERIFICATION_DATA, JSON.stringify(data));
    }
  }

  public logout(): void {
    if (isPlatformBrowser(this.platform_id)) {
      localStorage.removeItem(StorageService.VERIFICATION_DATA);
    }
  }

  public removeVerificationData(): void {
    if (isPlatformBrowser(this.platform_id)) {
      localStorage.removeItem(StorageService.VERIFICATION_DATA);
    }
  }

  private getVerificationData(): CodeVerificationResponse | TokenRefreshResponse | null {
    let data = null;
    if (isPlatformBrowser(this.platform_id)) {
      const storedData = localStorage.getItem(StorageService.VERIFICATION_DATA);
      if (storedData) {
        data = JSON.parse(storedData);
      }
    }
    return data;
  }

  public isVerified(): boolean {
    return this.getVerificationData() !== null;
  }

  public getVerificationUsername(): string {
    return this.getVerificationData()!.username;
  }

  public getAvatarUrl(): string {
    return this.getVerificationData()!.avatarUrl;
  }

  public getRefreshJwtToken(): string {
    return this.getVerificationData()!.refreshJwtToken;
  }

  private getVerificationGroup(): string {
    return this.getVerificationData()!.group;
  }

  public hasGroup(expectedGroup: string): boolean {
    const group = this.getVerificationGroup();
    const groupHierarchy = ['GUEST', 'MEMBER', 'MODERATOR', 'ADMIN'];
    const groupIndex = groupHierarchy.indexOf(group ?? 'GUEST');
    const expectedGroupIndex = groupHierarchy.indexOf(expectedGroup);
    return groupIndex >= expectedGroupIndex;
  }

  public getJwtToken(): string | null {
    const verificationData = this.getVerificationData();
    return verificationData ? verificationData.jwtToken : null;
  }

  public checkIfLoggedIn(): Observable<boolean> {
    return of(this.isLoggedIn());
  }

  public checkIfVerified(): Observable<boolean> {
    return of(this.isVerified());
  }

}
