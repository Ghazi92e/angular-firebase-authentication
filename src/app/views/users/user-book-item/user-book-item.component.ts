import { Component, Input, OnInit } from '@angular/core';
import { Book } from 'src/app/_models/Book.model';
import { User } from 'src/app/_models/User.model';
import { BooksService } from 'src/app/_services/books.service';
import { NgAuthService } from 'src/app/_services/ng-auth.service';
import { UsersService } from 'src/app/_services/users.service';

@Component({
  selector: 'app-user-book-item',
  templateUrl: './user-book-item.component.html',
  styleUrls: ['./user-book-item.component.css']
})
export class UserBookItemComponent implements OnInit {

  @Input() user: User | any;
  book: Book | any;


  constructor(private booksService: BooksService, private ngAuthService: NgAuthService, private userService: UsersService) { }

  ngOnInit(): void {

    if(this.user.id == this.ngAuthService.user.uid) {
      this.book = new Book('','');
      const id = this.user.book;
      console.log("salut c'est l'id" + id);
      this.booksService.getSingleBook(+id).then(
        (book) => {
          this.book = book;
          console.log(this.book);
        }
      );
    } else {
      console.log("erreur d'utilisateur");
    }
  }


  onDeleteBook(user: User) {
    this.userService.removeUser(user);
  }
}
