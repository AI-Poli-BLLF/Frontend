export class VmModel {
  id: string;
  os: string;
  version: string;

  constructor(id: string, os: string, version: string) {
    this.id = id;
    this.os = os;
    this.version = version;
  }
}
