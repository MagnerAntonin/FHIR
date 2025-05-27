export class Schedule {
    resourceType = 'Schedule';
    actor: { reference: string; display?: string }[];
    planningHorizon: { start: string; end: string };
    comment?: string;

    constructor(practitionerId: string, locationId: string, start: string, end: string, comment?: string) {
        this.actor = [
            { reference: `Practitioner/${practitionerId}` },
            { reference: `Location/${locationId}` },
        ];
        this.planningHorizon = { start, end };

        if (comment) {
            this.comment = comment;
        }
    }
}
