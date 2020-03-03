import { Component, OnInit, ViewEncapsulation, ViewChild, Inject, Renderer2, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MatProgressSpinnerModule, MAT_DIALOG_DATA, throwMatDuplicatedDrawerError } from '@angular/material';
import { Subject, from } from 'rxjs';
import { startOfDay, isSameDay, isSameMonth, endOfMonth, subDays } from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { fuseAnimations } from '@fuse/animations';

import { CalendarService } from 'app/main/apps/calendar/calendar.service';
import { CalendarEventModel } from 'app/main/apps/calendar/event.model';
import { CalendarEventFormDialogComponent } from 'app/main/apps/calendar/event-form/event-form.component';
// import { ProgressSpinnerComponent } from 'app/main/apps/calendar/progress-spinner/progress-spinner.component';

//import { DOCUMENT } from '@angular/platform-browser';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
// import { locale as english } from './i18n/en';
// import { locale as turkish } from './i18n/tr';
import { Observable } from 'rxjs';
import { finalize, subscribeOn } from 'rxjs/operators';
import { map } from 'rxjs/operators';
// import { AngularFireDatabase } from '@angular/fire/database';
// import { AngularFireStorage } from '@angular/fire/storage';
import { FuseSplashScreenService } from '../../../../@fuse/services/splash-screen.service';
// import { OverlayService } from '../../../overlay/overlay.module';
// import { ProgressSpinnerComponent } from '../../../progress-spinner/progress-spinner.module';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'app/services/api.service';
declare var jQuery: any;


@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CalendarComponent implements OnInit {
    monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    actions: CalendarEventAction[];
    colors: CalendarEventModel[];

    eventcalender: eventcalender[] = [];
    activeDayIsOpen: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    dialogRef: any;
    events: CalendarEvent[];
    refresh: Subject<any> = new Subject();
    selectedDay: any;
    dday: any;
    view: string;
    viewDate: Date;

    color = 'accent';
    mode = 'indeterminate';
    value = 80;
    spinnerWithoutBackdrop = false;

    tmp = new Date();
    month = this.tmp.getMonth();
    year = this.tmp.getUTCFullYear();

    unixtime: any = 1578900873170;

    getId: any;


    MyColor: any[] = [
        {
            color: {
                primary: '#1e90ff',
                secondary: '#D1E8FF'
            },
        },
        {
            color: {
                primary: '#2e90ff',
                secondary: '#D1E8FF'
            },
        },
    ];


    // tmp_date: any[] = [
    //     {
    //         "id": 1,
    //         "start": new Date("Sun Jan 12 2020 00:00:00 GMT+0700 (Waktu Indonesia Barat)"),
    //         "end": new Date("Tue Jan 14 2020 21:52:45 GMT+0700 (Waktu Indonesia Barat)"),
    //         "title": "A 3 day event",

    //         "meta": {
    //             "location": "Los Angeles",
    //             "notes": "Eos eu verear adipiscing, ex ornat"
    //         }
    //     },
    //     {
    //         "id": 2,
    //         "start": new Date("Sun Jan 17 2020 00:00:00 GMT+0700 (Waktu Indonesia Barat)"),
    //         "end": new Date("Tue Jan 21 2020 21:52:45 GMT+0700 (Waktu Indonesia Barat)"),
    //         "title": "A 3 day event",

    //         "meta": {
    //             "location": "Los Angeles",
    //             "notes": "Eos eu verear adipiscing, ex ornat"
    //         }
    //     }
    // ];

    // viewDatex = new Date();


    // MyEvent: any[] = [
    //     {
    //         id: "1579941278",
    //         title: 'Event 1',
    //         color: {
    //             primary: '#1e90ff',
    //             secondary: '#D1E8FF'
    //         },
    //         start: new Date(),
    //         meta: {
    //             location: 'Medan',
    //             notes: 'oke'
    //         }
    //     },
    //     {
    //         id: "1579941278",
    //         title: "Libur Tahun Baru 2020",
    //         color: {
    //             primary: "#1e90ff",
    //             secondary: "#D1E8FF",
    //         },
    //         start: new Date('Wed Jan 01 2020 00:00:00 GMT+0700 (Waktu Indonesia Barat)'),
    //         end: new Date('Thu Jan 02 2020 00:00:00 GMT+0700 (Waktu Indonesia Barat)'),

    //         meta: {
    //             location: "Medan",
    //             notes: "Libur Cuti Bersama"
    //         },
    //     },
    //     {
    //         id: "1580107233",
    //         title: 'Event 2',
    //         color: {
    //             primary: '#1e90ff',
    //             secondary: '#D1E8FF'
    //         },
    //         start: subDays(endOfMonth(new Date()), 3),
    //         meta: {
    //             location: 'Medan',
    //             notes: 'oke'
    //         }
    //     }
    // ];

    constructor(
        private _matDialog: MatDialog,
        private _calendarService: CalendarService,
        http: HttpClient,
        private API: ApiService,
        public _MatDialog: MatDialog,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ) {
        // Set the defaults
        this.view = 'month';
        this.viewDate = new Date();
        this.activeDayIsOpen = true;
        this.selectedDay = { date: startOfDay(new Date()) };

        // this.color = [{
        //     "primary": "#F44336",
        //     "secondary": "#FFCDD2"
        // }];

        this.actions = [
            {
                label: '<i class="material-icons s-16">edit</i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                    this.editEvent('edit', event);
                }
            },
            {
                label: '<i class="material-icons s-16">delete</i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                    this.deleteEvent(event);
                }
            }
        ];

        /**
         * Get events from service/server
         */
        this.setEvents();
    }

    ubahtgl(str) {
        var date = new Date(str);
        let mnth = ('0' + (date.getMonth() + 1)).slice(-2);
        let day = ('0' + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join('-');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        /**
         * Watch re-render-refresh for updating db
         */
        this.loadCalender();
    }

    loadSpinner() {
        this.spinnerWithoutBackdrop = true;
    }
    closeSpinner() {
        this.spinnerWithoutBackdrop = false;
    }

    // induk, data.key,
    loadCalender() {
        var i = 0;
        this.loadSpinner();
        var temp = [];
        this.eventcalender = [];
        this.API.getCalender().subscribe(result => {
            console.log(result);
            result['Output'].forEach(item => {
                temp.push(getEventCalender(
                    item.id,
                    item.title,
                    item.allDay,
                    item.color,
                    new Date(parseInt(item.start)),
                    new Date(parseInt(item.end)),
                    item.meta
                ));
                // console.log(temp);
            });
            setTimeout(() => {
                this.eventcalender = temp;
                console.log(this.eventcalender);
            }, 500);
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set events
     */
    setEvents(): void {
        this.events = this._calendarService.events.map(item => {
            item.actions = this.actions;
            return new CalendarEventModel(item);
        });
    }

    /**
     * Before View Renderer
     *
     * @param {any} header
     * @param {any} body
     */
    beforeMonthViewRender({ header, body }): void {
        /**
         * Get the selected day
         */
        const _selectedDay = body.find((_day) => {
            return _day.date.getTime() === this.selectedDay.date.getTime();
        });

        if (_selectedDay) {
            /**
             * Set selected day style
             * @type {string}
             */
            _selectedDay.cssClass = 'cal-selected';
        }

    }

    /**
     * Day clicked
     *
     * @param {MonthViewDay} day
     */
    dayClicked(day: CalendarMonthViewDay): void {
        this.dday = day;
        if (day.events.length === 0) {
            this.addEvent();
        }
        const date: Date = day.date;
        const events: CalendarEvent[] = day.events;

        if (isSameMonth(date, this.viewDate)) {
            // console.log(isSameMonth(date, this.viewDate));
            if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
                this.activeDayIsOpen = false;

            }
            else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
        this.selectedDay = day;
        this.refresh.next();
    }

    /**
     * Event times changed
     * Event dropped or resized
     *
     * @param {CalendarEvent} event
     * @param {Date} newStart
     * @param {Date} newEnd
     */
    eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.refresh.next(true);
    }

    /**
     * Delete Event
     *
     * @param event
     */
    deleteEvent(event): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                const eventIndex = this.events.indexOf(event);
                this.events.splice(eventIndex, 1);
                this.refresh.next(true);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * Edit Event
     *
     * @param {string} action
     * @param {CalendarEvent} event
     */
    editEvent(action: string, rest: CalendarEvent): void {
        const eventIndex = this.events.indexOf(rest);
        this.getId = rest.id;
        this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
            panelClass: 'event-form-dialog',
            data: {
                event: rest,
                action: action
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                let data = formData.value;
                console.log(this.getId);
                console.log(actionType);
                console.log(formData);
                switch (actionType) {
                    /**
                     * Save
                     */

                    case 'save':
                        var title = data.title;
                        var start = data.start;
                        var end = data.end;
                        var notifikasi = data.allDay;
                        var notes = data.meta.notes;
                        var freeday = data.meta.freeDay;



                        this.API.UpdateCalender(this.getId, start.valueOf(), end.valueOf(), title, notifikasi, notes, freeday).subscribe(result => {
                            console.log(result);
                            if (result.status === 'OK') {
                                this.loadCalender();
                                this.getId = '';
                            }
                            this.loadCalender();
                        });
                        this.refresh.next(true);

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':
                        var dialog = confirm('Apakah yakin ingin menghapus ?');
                        if (dialog === true) {
                            this.API.DeleteCalender(this.getId).subscribe(
                                result => {
                                    console.log(result);
                                    alert('Data Berhasil Di hapus');
                                    this.getId = '';
                                    this.loadCalender();
                                }
                            );
                        } else {
                            this.refresh.next(true);
                            this.getId = '';
                        }
                        break;
                }
            });
    }

    /**
     * Add Event
     */
    addEvent(): void {
        console.log(this.selectedDay);
        this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
            panelClass: 'event-form-dialog',
            data: {
                action: 'new',
                date: this.dday.date,
            }
        });

        // title: "sadfsa"
        // start: Sat Feb 01 2020 00: 00: 00 GMT + 0700(Waktu Indonesia Barat) { }
        // end: Sat Feb 01 2020 00: 00: 00 GMT + 0700(Waktu Indonesia Barat) { }
        // allDay: false
        // meta:
        // freeDay: true
        // notes: "sadfsaf"
        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                console.log(response);
                if (!response) {
                    return;
                }
                this.loadSpinner();
                const newEvent = response.getRawValue();
                newEvent.actions = this.actions;
                console.log(newEvent);
                var title = response.value.title;
                var notifikasi = response.value.allDay;
                var start = response.value.start;
                var end = response.value.end;
                var notes = response.value.meta.notes;
                var freeDay = response.value.meta.freeDay;

                this.API.addCalender(start.valueOf(), end.valueOf(), title, notifikasi, notes, freeDay).subscribe(result => {
                    if (result.status === 'OK') {
                        alert('Berhasil Disimpan');
                        this.loadCalender();
                    } else {
                        alert('Kesalahan Teknis');
                        this.loadCalender();
                    }
                });
                this.refresh.next(true);
            });
    }
}
export interface eventcalender {
    id: string;
    title: string;
    allDay: boolean;
    color: any[];
    start: any;
    end: any;
    meta: metas[];
}

export interface metas {
    freeDay: boolean;
    notes: string;
}

export interface colors {
    'primary': '#FF9800';
    'secondary': '#FFE0B2';
}

function getEventCalender(id: string, title: string, allDay: boolean, color: any[], startdate: any, enddate: any, meta: any[]): eventcalender {
    return {
        id: id,
        title: title,
        allDay: allDay,
        color: color,
        start: startdate,
        end: enddate,
        meta: meta,
    }
}


