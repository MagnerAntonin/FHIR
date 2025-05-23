export class Practitioner {
  id: string;
  firstName: string;
  lastName: string;
  identifierValue: string;

  constructor(data: any) {
    this.id = data.id || '';

    const name = data.name?.[0];
    this.firstName = name?.given?.join(' ') || '';
    this.lastName = name?.family || '';
    this.identifierValue = data.identifier?.[0]?.value || '';
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}
