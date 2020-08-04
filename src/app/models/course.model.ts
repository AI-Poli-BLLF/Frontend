export class Course {
  name: string;
  enabled: boolean;
  min: number;
  max: number;

  constructor(name: string, enabled: boolean, min: number, max: number) {
    this.name = name;
    this.enabled = enabled;
    this.min = min;
    this.max = max;
  }

  toString(){
    return this.name + ' (' + this.enabled + ')';
  }
}
