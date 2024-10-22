export class Team {
  id: number;
  name: string;
  status: string;
  proposerId: string;

  constructor(id: number, name: string, status: string) {
    this.status = status;
    this.id = id;
    this.name = name;
  }

  toString(){
    return this.name + ', Id: ' + this.id + ', Status: ' + this.status;
  }
}
