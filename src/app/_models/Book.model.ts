export class Book {
    url: string | undefined;
    key: string | any;
    name: string | any;
    file: File | any;

    constructor(public title: string, public author: string) {}
}