export class Book {
    url: string | undefined;
    key: string | any;
    file: File | any;

    constructor(public title: string, public author: string) {}
}