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
    this.book = new Book('','');
    if (this.user) {
      const id = this.user;
      console.log("user book id" + this.user);
      this.booksService.getSingleBook(+id).then(
        (book) => {
          this.book = book;
        }
      );
    }
  }
}
