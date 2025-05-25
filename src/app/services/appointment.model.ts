export class Appointment {
  resourceType = 'Appointment';
  status: string;
  start: string;
  end: string;
  participant: any[];
  description?: string;

  constructor(patientId: string, practitionerId: string, locationId: string, start: string, end: string, reason: string) {
    this.status = 'booked';
    if (reason) {
      this.description = reason;
    }
    this.start = start;
    this.end = end;

    this.participant = [
      {
        actor: { reference: `Patient/${patientId}` },
        status: 'accepted',
      },
      {
        actor: { reference: `Practitioner/${practitionerId}` },
        status: 'accepted',
      },
      {
        actor: { reference: `Location/${locationId}` },
        status: 'accepted',
      },
    ];
  }
}
