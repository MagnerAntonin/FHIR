export class Location {
  id: string;
  name: string;
  type: string;
  parentName: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.type = data.type?.[0]?.coding?.[0]?.display || '';
    this.parentName = data.partOf?.display || '';
  }
}
