import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { BookListComponent } from './views/books/book-list/book-list.component';
import { CreateBookComponent } from './views/books/create-book/create-book.component';
import { EditBookComponent } from './views/books/edit-book/edit-book.component';
import { SingleBookComponent } from './views/books/single-book/single-book.component';
import { DashboardComponent } from './views/authentication/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './views/authentication/forgot-password/forgot-password.component';
import { SignInComponent } from './views/authentication/sign-in/sign-in.component';
import { SignUpComponent } from './views/authentication/sign-up/sign-up.component';
import { UserBookComponent } from './views/users/user-book/user-book.component';
import { VerifyEmailComponent } from './views/authentication/verify-email/verify-email.component';
import { EditUserComponent } from './views/authentication/edit-user/edit-user.component';


const routes: Routes = [
  // { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: '', component: BookListComponent, canActivate: [AuthGuard]},
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'edit-user', component: EditUserComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'email-verification', component: VerifyEmailComponent },
  { path: 'books', component: BookListComponent, canActivate: [AuthGuard] },
  { path: 'usersbooks', component: UserBookComponent, canActivate: [AuthGuard] },
  { path: 'books/view/:id', component: SingleBookComponent, canActivate: [AuthGuard] },
  { path: 'books/create', component: CreateBookComponent, canActivate: [AuthGuard] },
  { path: 'books/edit/:id', component: EditBookComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
