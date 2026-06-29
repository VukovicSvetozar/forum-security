import { Routes } from '@angular/router';
import { canActivateGroup, canActivateForLoginAndRegistration, canActivateForVerificationCode } from './services/guard.service';
import { HomeComponent } from './pages/forum/home/home.component';
import { CommentComponent } from './pages/forum/comment/comment.component';
import { MainComponent } from './pages/admin/main/main.component';
import { TopicComponent } from './pages/forum/topic/topic.component';
import { MemberComponent } from './pages/user/member/member.component';
import { ProfileComponent } from './pages/user/profile/profile.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegistrationComponent } from './pages/auth/registration/registration.component';
import { VerificationCodeComponent } from './pages/auth/verification-code/verification-code.component';
import { ReviewComponent } from './pages/monitoring/review/review.component';
import { Oauth2CallbackComponent } from './pages/auth/oauth2-callback/oauth2-callback.component';
import { PageNotFoundComponent } from './layout/page-not-found/page-not-found.component';

export const routes: Routes = [

    {
        path: 'forum/home',
        component: HomeComponent
    },
    {
        path: 'forum/topic',
        component: TopicComponent, canActivate: [canActivateGroup], data: { expectedGroup: 'MEMBER' }
    },
    {
        path: 'forum/comment/:topic-name/:topic-id',
        component: CommentComponent, canActivate: [canActivateGroup], data: { expectedGroup: 'MEMBER' }
    },
    {
        path: 'admin/main',
        component: MainComponent, canActivate: [canActivateGroup], data: { expectedGroup: 'ADMIN' }
    },
    {
        path: 'monitoring/review',
        component: ReviewComponent, canActivate: [canActivateGroup], data: { expectedGroup: 'ADMIN' }
    },
    {
        path: 'user/member',
        component: MemberComponent, canActivate: [canActivateGroup], data: { expectedGroup: 'MEMBER' }
    },
    {
        path: 'user/profile',
        component: ProfileComponent, canActivate: [canActivateGroup], data: { expectedGroup: 'MEMBER' }
    },
    {
        path: 'auth/login',
        component: LoginComponent, canActivate: [canActivateForLoginAndRegistration]
    },
    {
        path: 'auth/registration',
        component: RegistrationComponent, canActivate: [canActivateForLoginAndRegistration]
    },
    {
        path: 'auth/verification-code',
        component: VerificationCodeComponent, canActivate: [canActivateForVerificationCode]
    },
    {
        path: 'auth/oauth2-callback',
        component: Oauth2CallbackComponent
    },
    {
        path: '',
        component: HomeComponent
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }

];
