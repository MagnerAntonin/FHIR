import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FhirService } from '../services/fhir.service';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/interaction';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core';

import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, RouterModule, FullCalendarModule],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss',
})

export class CalendarViewComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private fhirService: FhirService, private changeDetector: ChangeDetectorRef, private router: Router) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  isBrowser = false;
  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    events: [], // Add
    weekends: false,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });
  currentEvents = signal<EventApi[]>([]);

  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect(selectInfo: DateSelectArg): void {
    const start = selectInfo.startStr;
    const end = selectInfo.endStr;
    this.router.navigate(['/form'], {
      queryParams: {
        start,
        end
      }
    });
  }

  handleEventClick(info: any): void {
    info.jsEvent.preventDefault(); // ✅ évite comportement par défaut
    const eventId = info.event.id;
    this.router.navigate(['/details', eventId]);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  // Add 
  loadAppointmentsIntoCalendar() {
    this.fhirService.getAppointments().subscribe({
      next: async (data) => {
        const entries = data?.entry || [];
        const mappedAppointments = entries.map((entry: any) => entry.resource);

        const enrichments = mappedAppointments.map(async (appt: any) => {
          const participants: any[] = appt.participant || [];

          const patientRef = participants.find((p: any) =>
            p.actor.reference.startsWith('Patient/')
          )?.actor.reference;

          const [patient] = await Promise.all([
            patientRef ? this.fhirService.getResourceByReference(patientRef).toPromise() : null,
          ]);

          return {
            id: appt.id,
            title: `${appt.description} ${patient ? '- ' + patient.name?.[0]?.given?.[0] + ' ' + patient.name?.[0]?.family : ''}`,
            start: appt.start,
            end: appt.end
          };
        });

        const calendarEvents = await Promise.all(enrichments);

        this.calendarOptions.update((options) => ({
          ...options,
          events: calendarEvents
        }));
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des RDVs :', err);
      }
    });
  }

  ngOnInit(): void {
    this.loadAppointmentsIntoCalendar();
  }
}
