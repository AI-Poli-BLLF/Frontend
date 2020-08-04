export class Team {
  id: number;
  name: string;
  status: number;


  constructor(id: number, name: string, status: number) {
    this.status = status;
    this.id = id;
    this.name = name;

  }

  toString(){
    return this.name + ' Status: ' + this.status + ' (' + this.id + ')';
  }
}
