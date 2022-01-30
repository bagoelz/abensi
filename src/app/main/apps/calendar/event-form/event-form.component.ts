import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';

import { MatColors } from '@fuse/mat-colors';

import { CalendarEventModel } from 'app/main/apps/calendar/event.model';

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
import { FuseSplashScreenService } from '../../../../../@fuse/services/splash-screen.service';
import { OverlayService } from '../../../../overlay/overlay.module';
import { ProgressSpinnerComponent } from '../../../../progress-spinner/progress-spinner.module';
//import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';
//import undefined = require('firebase/empty-import');
declare var jQuery: any;
// import { saveAs } from 'file-saver';

@Component({
    selector: 'calendar-event-form-dialog',
    templateUrl: './event-form.component.html',
    styleUrls: ['./event-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CalendarEventFormDialogComponent {
    action: string;
    event: CalendarEvent;
    // event2: CalendarEvent2;
    eventForm: FormGroup;
    dialogTitle: string;
    presetColors = MatColors.presets;
    checked: number;

    /**
     * Constructor
     *
     * @param {MatDialogRef<CalendarEventFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        // private db: AngularFireDatabase,
        // private storage: AngularFireStorage,
        public matDialogRef: MatDialogRef<CalendarEventFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
    ) {
        console.log(_data);
        this.event = _data.event;
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = this.event.title;
        }
        else {
            this.dialogTitle = 'Buat Agenda';
            this.event = new CalendarEventModel({
                start: _data.date,
                end: _data.date
            });

            // this.eventForm = this.createEventForm();
        }

        this.eventForm = this.createEventForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Create the event form
     *
     * @returns {FormGroup}
     */
    createEventForm(): FormGroup {
        return new FormGroup({
            title: new FormControl(this.event.title),
            start: new FormControl(this.event.start),
            end: new FormControl(this.event.end),

            allDay: new FormControl(this.event.allDay),
            // draggable: new FormControl(this.event.draggable),
            // color: this._formBuilder.group({
            //     primary: new FormControl(this.event.color.primary),
            //     secondary: new FormControl(this.event.color.secondary)
            // }),
            meta:
                this._formBuilder.group({
                    // agenda: new FormControl(this.event.meta.agenda),
                    freeDay: new FormControl(this.event.meta.freeDay),
                    notes: new FormControl(this.event.meta.notes)
                })
        });
    }

    // setValue(i, e) {
    //     if (e.checked) {
    //         this.event.draggable = '1'
    //     } else {
    //         this.event.draggable.value = '0'
    //     }
    //     console.log(this.agent.attributes[i].value)
    // }

    // onChange(value) {
    //     if (value.checked === true) {
    //         this.checked = 1;
    //         console.log(1);
    //         return 1;
    //     } else {
    //         this.checked = 0;
    //         console.log(0);
    //         return 0;
    //     }
    // }

    // EditEventForm(): FormGroup {
    //     return new FormGroup({
    //         id: new FormControl(this.event.id),
    //         title: new FormControl(this.event.title),
    //         start: new FormControl(this.event.start),
    //         end: new FormControl(this.event.end),
    //         allDay: new FormControl(this.event.allDay),
    //         color: this._formBuilder.group({
    //             primary: new FormControl(this.event.color.primary),
    //             secondary: new FormControl(this.event.color.secondary)
    //         }),
    //         meta:
    //             this._formBuilder.group({
    //                 location: new FormControl(this.event.meta.location),
    //                 notes: new FormControl(this.event.meta.notes)
    //             })
    //     });
    // }
}
