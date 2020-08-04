export class Professor {
  id: string;
  name: string;
  firstName: string;
  photoName: string;
  courseNames: string[];

  constructor(id: string, name: string, firstName: string, photoName: string, courseNames: string[]) {
    this.id = id;
    this.name = name;
    this.firstName = firstName;
    this.photoName = photoName;
    this.courseNames = courseNames;
  }

  toString(){
    return this.firstName + ' ' + this.name + ' (' + this.id + ')';
  }
}
