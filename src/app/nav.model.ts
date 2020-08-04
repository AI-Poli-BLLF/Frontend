export class NavModel {
  private readonly urlP: string;
  private readonly nameP: string;

  constructor(url: string, name: string) {
    this.urlP = url;
    this.nameP = name;
  }

  get url(): string {
    return this.urlP;
  }

  get name(): string {
    return this.nameP;
  }
}
