export class Practitioner {
  id: string;
  fullName: string;
  identifierValue: string;

  constructor(data: any) {
    this.id = data.id || '';

    const name = data.name?.[0];
    const firstName = name?.given?.join(' ') || '';
    const lastName = name?.family || '';
    this.fullName = `${firstName} ${lastName}`.trim();

    this.identifierValue = data.identifier?.[0]?.value || '';
  }
}
