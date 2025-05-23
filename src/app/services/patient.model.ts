export class Patient {
  id: string;
  firstName: string;
  lastName: string;

  constructor(data: any) {
    this.id = data.id || '';

    const name = data.name?.[0];
    this.firstName = name?.given?.join(' ') || '';
    this.lastName = name?.family || '';
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }


}
