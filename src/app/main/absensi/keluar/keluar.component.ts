import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
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


import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

@Component({
  selector: 'absensikeluar',
  templateUrl: './keluar.component.html',
  styleUrls: ['./keluar.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class KeluarComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['tglJam', 'telat', 'plgCpt', 'lokasi'];
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
    http: HttpClient,
    private API: ApiService,
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
    this.getData();
  }

  getData() {
    this.API.getAbsensiKeluar().subscribe(result => {
      console.log(result['Output']);
      this.dataSource = new MatTableDataSource(result['Output']);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
export const COMPONENT_LIST = [
  KeluarComponent
];

