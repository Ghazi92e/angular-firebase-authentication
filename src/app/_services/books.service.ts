import { Injectable } from '@angular/core';
import { Book } from '../_models/Book.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class BooksService {
  bookFire: AngularFirestoreCollection<Book>;
  dbPath = 'books'
  
  constructor( private afStore: AngularFirestore ) { this.bookFire = this.afStore.collection(this.dbPath) }

  getSingleBookFirestore(bookid: string) {
    return this.bookFire.doc(bookid).ref.get();
  }

  getBooksFirestore() {
    return this.bookFire.ref.get()
  }

  updateBook(id: string, book: Book) {
    this.bookFire.doc(id).set(book);
  }

  createNewBook(newBook: Book) {
    this.bookFire.add(newBook);
  }

  deleteBookFirestore(id: string) {
    this.bookFire.doc(id).delete()
  }
}
