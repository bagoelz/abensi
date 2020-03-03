import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject, Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject, from } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';
import { MatTableDataSource, MatDialog, ErrorStateMatcher, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ApiService } from 'app/services/api.service';
import { FormControl, FormGroupDirective, NgForm, FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
// import { ToastrComponent } from 'app/main/toastr/toastr.component';
import { environment } from '../../../environments/environment';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
// import { setTimeout } from 'timers';
import * as moment from 'moment';

@Component({
    selector: 'signout-component',
    templateUrl: './signout.component.html',
    styleUrls: ['./signout.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

@Injectable()
export class Signout {
    imgUrl = environment.ImageUrl;
    dataSource: MatTableDataSource<MenuData>;
    displayedColumns = ['avatar', 'username', 'nama', 'gender', 'status'];
    cabang: any = [];

    color = 'accent';
    mode = 'indeterminate';
    value = 80;
    spinnerWithoutBackdrop = false;
    auth: any = [];
    token: string;

    jadwal: any = [];
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    constructor(
        private toastr: ToastrService,
        http: HttpClient,
        private API: ApiService,
        private router: Router,
        public _MatDialog: MatDialog,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    ngOnInit() {
        this.loadSpinner()
        setTimeout(() => {
        this.closeSpinner();
        localStorage.clear();
        this.router.navigate(['/login'])
         }, 1000);        

    }

    loadSpinner(){
        this.spinnerWithoutBackdrop = true;
        }
        closeSpinner(){
          this.spinnerWithoutBackdrop = false;
        }
}


export interface MenuData {
    username: string;
    password: string;
    salt: string;
    nip: string,
    fullname: string;
    jabatan: string;
    user_picture: string;
    gender: number;
    capdis: string;
    created: any;
    last_login: any;
    status: number;
    level: string;
}

export const COMPONENT_LIST = [
    Signout,
];