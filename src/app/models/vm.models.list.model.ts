export class VmModelsList {
  id: number;
  osName: string;
  versions: string[];

  constructor(id: number, osName: string, versions: Array<string>) {
    this.id = id;
    this.osName = osName;
    this.versions = versions;
  }
}
