export class Appointment {
  resourceType = 'Appointment';
  status: string;
  start: string;
  end: string;
  participant: any[];
  reasonCode?: any[];

  constructor(patientId: string, practitionerId: string, locationId: string, start: string, end: string, reason: string) {
    this.status = 'booked';
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

    if (reason) {
      this.reasonCode = [
        {
          text: reason,
        },
      ];
    }
  }
}
