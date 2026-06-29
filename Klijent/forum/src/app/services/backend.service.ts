import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationRequest } from '../model/authenticationRequest';
import { Observable, catchError, throwError } from 'rxjs';
import { LoginVerificationResponse } from '../model/loginVerificationResponse';
import { CodeVerificationRequest } from '../model/codeVerificationRequest';
import { CodeVerificationResponse } from '../model/codeVerificationResponse';
import { UserDataResponse } from '../model/userDataResponse';
import { UserVerificationRequest } from '../model/userVerificationRequest';
import { UserRegistrationRequest } from '../model/userRegistrationRequest';
import { ChangeUserGroupRequest } from '../model/changeUserGroupRequest';
import { ChangePermissionsRequest } from '../model/changePermissionsRequest';
import { SuspendUserRequest } from '../model/suspendUserRequest';
import { UserProfileResponse } from '../model/userProfileResponse';
import { UserProfileRequest } from '../model/userProfileRequest';
import { UserInfoResponse } from '../model/userInfoResponse';
import { TopicAddRequest } from '../model/topicAddRequest';
import { TopicInfoResponse } from '../model/topicInfoResponse';
import { TopicChangeRequest } from '../model/topicChangeRequest';
import { TopicDataResponse } from '../model/topicDataResponse';
import { CommentAddRequest } from '../model/commentAddRequest';
import { CommentDeleteRequest } from '../model/commentDeleteRequest';
import { CommentCorrectionRequest } from '../model/commentCorrectionRequest';
import { CommentInfoResponse } from '../model/commentInfoResponse';
import { CommentCorrectionResponse } from '../model/commentCorrectionResponse';
import { ErrorMessageResponse } from '../model/errorMessageResponse';
import { TokenRefreshRequest } from '../model/tokenRefreshRequest';
import { TokenRefreshResponse } from '../model/tokenRefreshResponse';
import { LogoutRequest } from '../model/logoutRequest';
import { OAuth2Request } from '../model/oAuth2Request';
import { LogDataResponse } from '../model/logDataResponse';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private static readonly API_URL = "https://localhost:8443/api/";

  constructor(private http: HttpClient) { }

  // Registracija i autentifikacija

  public checkUsernameAvailability(username: string): Observable<boolean> {
    const url = BackendService.API_URL + `public/availability-username/${username}`;
    return this.http.get<boolean>(url);
  }

  public checkEmailAvailability(email: string): Observable<boolean> {
    const url = BackendService.API_URL + `public/availability-email/${email}`;
    return this.http.get<boolean>(url);
  }

  public registrationUser(request: UserRegistrationRequest) {
    return this.http.post(BackendService.API_URL + 'public/registration', request).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error)
      })
    );
  }

  public login(request: AuthenticationRequest): Observable<LoginVerificationResponse> {
    return this.http.post<LoginVerificationResponse>(BackendService.API_URL + 'public/login', request).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error)
      })
    );
  }

  public verifyCode(request: CodeVerificationRequest): Observable<CodeVerificationResponse> {
    return this.http.post<CodeVerificationResponse>(BackendService.API_URL + 'public/verification-code', request).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error)
      })
    );
  }

  public refreshToken(request: TokenRefreshRequest): Observable<TokenRefreshResponse> {
    return this.http.post<TokenRefreshResponse>(BackendService.API_URL + 'public/refresh-token', request).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error)
      })
    );
  }

  public logout(request: LogoutRequest) {
    return this.http.post(BackendService.API_URL + 'member/logout', request).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error)
      })
    );
  }

  public loginOAuth2(request: OAuth2Request): Observable<LoginVerificationResponse> {
    return this.http.post<LoginVerificationResponse>(BackendService.API_URL + 'public/login-oauth2', request).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error)
      })
    );
  }

  // Admin

  public getAllGroupNames(): Observable<Set<string>> {
    const url = BackendService.API_URL + 'admin/groups';
    return this.http.get<Set<string>>(url);
  }

  public getAllStatusNames(): Observable<Set<string>> {
    const url = BackendService.API_URL + 'admin/statuses';
    return this.http.get<Set<string>>(url);
  }

  public verifyUserAccount(request: UserVerificationRequest) {
    return this.http.post(BackendService.API_URL + 'admin/verification-account', request).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error)
      })
    );
  }

  public changeUserGroup(request: ChangeUserGroupRequest) {
    const url = BackendService.API_URL + 'admin/change-group';
    return this.http.put(url, request);
  }

  public getGroupPermissions(groupName: string): Observable<Set<string>> {
    const url = BackendService.API_URL + `admin/groups/${groupName}/permissions`;
    return this.http.get<Set<string>>(url);
  }

  public getUserPermissions(userId: string): Observable<Set<string>> {
    const url = BackendService.API_URL + `admin/user-permissions/${userId}`;
    return this.http.get<Set<string>>(url);
  }

  public changePermissions(request: ChangePermissionsRequest) {
    const url = BackendService.API_URL + 'admin/change-permissions';
    return this.http.put(url, request);
  }

  public suspendUser(request: SuspendUserRequest) {
    const url = BackendService.API_URL + 'admin/user-suspend';
    return this.http.put(url, request);
  }

  public deactivateUser(username: string) {
    const url = BackendService.API_URL + `admin/user-deactivate/${username}`;
    return this.http.put(url, {});
  }

  // Korisnici

  public getUsers(group?: string, status?: string): Observable<Set<UserDataResponse>> {
    let params = new HttpParams();
    if (group) {
      params = params.append('group', group);
    }
    if (status) {
      params = params.append('status', status);
    }
    const url = BackendService.API_URL + 'member/users';
    return this.http.get<Set<UserDataResponse>>(url, { params });
  }

  public getUserProfile(username: string): Observable<UserProfileResponse> {
    const url = BackendService.API_URL + `member/user-profile/${username}`;
    return this.http.get<UserProfileResponse>(url);
  }

  public changeUserProfile(request: UserProfileRequest): Observable<CodeVerificationResponse> {
    const url = BackendService.API_URL + 'member/user-profile/change';
    return this.http.put<CodeVerificationResponse>(url, request);
  }

  public getUserInfo(id: number): Observable<UserInfoResponse> {
    const url = BackendService.API_URL + `member/user-info/${id}`;
    return this.http.get<UserInfoResponse>(url);
  }

  // Teme

  public createTopic(request: TopicAddRequest) {
    return this.http.post(BackendService.API_URL + 'admin/topic-add', request).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error)
      })
    );
  }

  public checkTopicNameAvailability(name: string): Observable<boolean> {
    const url = BackendService.API_URL + `admin/topic-availability-name/${name}`;
    return this.http.get<boolean>(url);
  }

  public getTopicInfoList(): Observable<Set<TopicInfoResponse>> {
    const url = BackendService.API_URL + 'admin/topic-info-list';
    return this.http.get<Set<TopicInfoResponse>>(url);
  }

  public getTopicInfo(id: number): Observable<TopicInfoResponse> {
    const url = BackendService.API_URL + `admin/topic-info/${id}`;
    return this.http.get<TopicInfoResponse>(url);
  }

  public changeTopic(request: TopicChangeRequest) {
    const url = BackendService.API_URL + 'admin/topic-change';
    return this.http.put(url, request);
  }

  public archiveTopic(id: number) {
    const url = BackendService.API_URL + `admin/topic-archive/${id}`;
    return this.http.put(url, {});
  }

  public getTopics(): Observable<Set<TopicDataResponse>> {
    const url = BackendService.API_URL + 'member/topic';
    return this.http.get<Set<TopicDataResponse>>(url);
  }

  // Komentari

  public addComment(request: CommentAddRequest) {
    return this.http.post(BackendService.API_URL + 'member/comment-add', request).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error)
      })
    );
  }

  public correctComment(request: CommentCorrectionRequest): Observable<CommentCorrectionResponse> {
    const url = BackendService.API_URL + 'member/comment-correct';
    return this.http.put<CommentCorrectionResponse>(url, request);
  }

  public deleteComment(request: CommentDeleteRequest): Observable<void> {
    const url = BackendService.API_URL + 'member/comment-delete';
    return this.http.delete<void>(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: request
    });
  }

  public getAllCommentsByTopic(topicId: number, currentPage: number, elementsPerPage: number) {
    const params = new HttpParams()
      .set('currentPage', currentPage.toString())
      .set('elementsPerPage', elementsPerPage.toString());
    return this.http.get<any>(BackendService.API_URL + `member/comment-topic/${topicId}`, { params });
  }

  public getCommentInfo(id: number): Observable<CommentInfoResponse> {
    const url = BackendService.API_URL + `member/comment-info/${id}`;
    return this.http.get<CommentInfoResponse>(url);
  }

  // Monitoring

  public getErrorMessages(startTime?: string, endTime?: string): Observable<Set<ErrorMessageResponse>> {
    let params = new HttpParams();
    if (startTime) {
      params = params.append('startTime', startTime);
    }
    if (endTime) {
      params = params.append('endTime', endTime);
    }
    const url = BackendService.API_URL + 'monitoring/errors';
    return this.http.get<Set<ErrorMessageResponse>>(url, { params });
  }

  public getErrorMessage(id: number): Observable<ErrorMessageResponse> {
    const url = BackendService.API_URL + `monitoring/error/${id}`;
    return this.http.get<ErrorMessageResponse>(url);
  }

  public getLogs(logLevelInfo?: string, logLevelTrace?: string, logLevelDebug?: string, logLevelWarn?: string, logLevelError?: string, logLevelFatal?: string, startTime?: string, endTime?: string): Observable<Set<LogDataResponse>> {
    let params = new HttpParams();

    if (logLevelInfo) {
      params = params.append('logLevelInfo', logLevelInfo);
    }
    if (logLevelTrace) {
      params = params.append('logLevelTrace', logLevelTrace);
    }
    if (logLevelDebug) {
      params = params.append('logLevelDebug', logLevelDebug);
    }
    if (logLevelWarn) {
      params = params.append('logLevelWarn', logLevelWarn);
    }
    if (logLevelError) {
      params = params.append('logLevelError', logLevelError);
    }
    if (logLevelFatal) {
      params = params.append('logLevelFatal', logLevelFatal);
    }
    if (startTime) {
      params = params.append('startTime', startTime);
    }
    if (endTime) {
      params = params.append('endTime', endTime);
    }

    return this.http.get<Set<LogDataResponse>>(BackendService.API_URL + 'monitoring/data', { params });
  }

}
