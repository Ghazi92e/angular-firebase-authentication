import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './views/authentication/dashboard/dashboard.component';
import { SignInComponent } from './views/authentication/sign-in/sign-in.component';
import { SignUpComponent } from './views/authentication/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './views/authentication/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './views/authentication/verify-email/verify-email.component';
import { NgAuthService } from './_services/ng-auth.service';
import { BookListComponent } from './views/books/book-list/book-list.component';
import { SingleBookComponent } from './views/books/single-book/single-book.component';
import { BookFormComponent } from './layout/book-form/book-form.component';
import { HeaderComponent } from './layout/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BooksService } from './_services/books.service';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { UploadFileService } from './_services/upload-file.service';
import { EditBookComponent } from './views/books/edit-book/edit-book.component';
import { BookItemsComponent } from './layout/book-item/book-item.component';
import { CreateBookComponent } from './views/books/create-book/create-book.component';
import { UserBookComponent } from './views/users/user-book/user-book.component';
import { UsersService } from './_services/users.service';
import { UserBookItemComponent } from './views/users/user-book-item/user-book-item.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditUserComponent } from './views/authentication/edit-user/edit-user.component';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    BookListComponent,
    SingleBookComponent,
    BookFormComponent,
    HeaderComponent,
    EditBookComponent,
    BookItemsComponent,
    CreateBookComponent,
    UserBookComponent,
    UserBookItemComponent,
    EditUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [NgAuthService, BooksService, UploadFileService, UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
