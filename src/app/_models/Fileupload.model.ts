export class FileUpload {
    key: string | any;
    url: string | any;
    file: File | any;
  
    constructor(file: File) {
      this.file = file;
    }
}