export class Student {
  id: number;
  name: string;
  firstName: string;
  group: string;
  courseId: number;
  selected: boolean;

  constructor(id: number, name: string, firstName: string, group: string, courseId: number) {
    this.selected = false;
    this.id = id;
    this.name = name;
    this.firstName = firstName;
    this.group = group;
    this.courseId = courseId;
  }

  toString(){
    return this.firstName + ' ' + this.name + ' (' + this.id + ')';
  }
}
