export class Course {
  name: string;
  enabled: boolean;
  min: number;
  max: number;
  acronym: string;

  constructor(name: string, enabled: boolean, min: number, max: number, acronym: string) {
    this.name = name;
    this.enabled = enabled;
    this.min = min;
    this.max = max;
    this.acronym = acronym;
  }

  toString(){
    return this.name + ' (' + this.enabled + ')';
  }
}
