export class Slot {
    resourceType = 'Slot';
    schedule: { reference: string };
    status: 'busy' | 'free' | 'busy-unavailable' | 'busy-tentative';
    start: string;
    end: string;

    constructor(scheduleId: string, start: string, end: string, status: 'busy' | 'free' | 'busy-unavailable' | 'busy-tentative' = 'free') {
        this.schedule = { reference: `Schedule/${scheduleId}` };
        this.status = status;
        this.start = start;
        this.end = end;
    }
}
