import { Injectable } from '@angular/core';
import { Book } from '../_models/Book.model';
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class BooksService {

  books: Book[] = []; //arret local
  booksSubject = new Subject<Book[]>();

  constructor(
    private afDatabase: AngularFireDatabase,

  ) { }

  emitBooks() {
    this.booksSubject.next(this.books); // prend le contenu de l'arret books et l'emettra a travers le subject
  }


  saveBooks() {
    this.afDatabase.database.ref('/books').set(this.books); // this.books enregistré dans '/books'
  }

  getBooks() {
    this.afDatabase.database.ref('/books')
      .on('value', (data) => { // '.on' permet de réagir à des modification de la BDD. '(data) contient la propriété 'val' qui retourne la valeur des données du serveur 
        this.books = data.val() ? data.val() : [];
        this.emitBooks();
      })
  }

  getSingleBook(id: number) {
    return new Promise((resolve, reject) => {
      this.afDatabase.database.ref('/books/' + id).once('value').then(
        (data) => {
          resolve(data.val());
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  updateBook(id: number, book: Book) {
    this.afDatabase.database.ref('/books/' + id).update(book);
    //this.saveBooks();
    //this.emitBooks();
  }


  createNewBook(newBook: Book) {
    this.books.push(newBook);
    this.saveBooks();
    //this.emitBooks();
  }

  removeBook(book: Book) {
    const bookIndexToRemove = this.books.findIndex(
      (bookEl) => {
        if(bookEl === book) {
          return true;
        } else {
          return false;
        }
      }
    );
    this.books.splice(bookIndexToRemove, 1);
    this.saveBooks();
    this.emitBooks();
  }
}
