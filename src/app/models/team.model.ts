export class Team {
  id: number;
  name: string;
  status: string;


  constructor(id: number, name: string, status: string) {
    this.status = status;
    this.id = id;
    this.name = name;

  }

  toString(){
    return this.name + ' Status: ' + this.status + ' (' + this.id + ')';
  }
}
