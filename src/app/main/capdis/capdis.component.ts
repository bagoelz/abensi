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
import { environment } from '../../../environments/environment';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import * as $ from 'jquery';

@Component({
  selector: 'app-capdis',
  templateUrl: './capdis.component.html',
  styleUrls: ['./capdis.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class CapdisComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns = ['nama', 'lat', 'lng'];
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
    this.getPotongan();
  }

  getPotongan() {
    // this.API.getCapdis().subscribe(result => {
    //   console.log(result['Output']);
    //   this.dataSource = new MatTableDataSource(result['Output']);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // });
  }

  openDialog(): void {
    const dialogRef = this._MatDialog.open(tambahCapdis, {
      width: '500px',
      panelClass: 'dialog',
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.getPotongan();
    });
  }
}

@Component({
  selector: 'sample2-dialog',
  templateUrl: 'tambahcapdis/buatcapdis.html',
  styleUrls: ['tambahcapdis/buatcapdis.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class tambahCapdis {
  ModelCapdis: any = [];
  /**
* Constructor
*
* @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
*/

  constructor(
    http: HttpClient,
    private API: ApiService,
    public _MatDialog: MatDialog,
    public dialogRef: MatDialogRef<tambahCapdis>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, turkish);
  }

  nama = new FormControl('', [Validators.required]);
  lat = new FormControl('', [Validators.required]);
  lng = new FormControl('', [Validators.required]);

  capdisForm: FormGroup = new FormGroup({
    nama: this.nama,
    lat: this.lat,
    lng: this.lng,
  });

  addCapdis() {
    this.API.addCapdis(this.ModelCapdis.nama, this.ModelCapdis.lat, this.ModelCapdis.lng).subscribe(result => {
      const status = result['status'];
      const desc = result['desc'];


      if (status === 'OK') {
        this.ModelCapdis = [];
        // alert('Status OK');
        this.dialogRef.close();
      }
    });
  }

  onClick() {
    this.addCapdis();
  }
}

export const COMPONENT_LIST = [
  CapdisComponent,
  tambahCapdis
];
