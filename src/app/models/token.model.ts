export class Token {
  id: string;
  teamId: number;
  studentId: number;
  expiryDate: string;

  constructor(id: string, teamId: number, studentId: number, expiryDate: string) {
    this.id = id;
    this.teamId = teamId;
    this.studentId = studentId;
    this.expiryDate = expiryDate;
  }

  toString(){
    return this.id;
  }
}
