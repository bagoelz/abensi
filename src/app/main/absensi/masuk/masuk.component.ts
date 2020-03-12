import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject, from } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';
import { MatTableDataSource, MatDialog, ErrorStateMatcher, MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ApiService } from 'app/services/api.service';
import { FormControl, FormGroupDirective, NgForm, FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
// import { ToastrComponent } from 'app/main/toastr/toastr.component';


import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Router } from '@angular/router';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { environment } from 'environments/environment';
import { tmpdir } from 'os';
import * as moment from 'moment';

@Component({
  selector: 'absensimasuk',
  templateUrl: './masuk.component.html',
  styleUrls: ['./masuk.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class MasukComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['nip', 'nama', 'tgl', 'jm_masuk', 'jm_keluar', 'status', 'keterangan'];
  auth: any = [];
  ListAbsen:any=[];
  fullAbsen:any = [];
  token: string;
  Capdis:any=[];
  cabang:any=[];
  DateNow:any;
  DateNow2:any;
  dateFilter:any = [];
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
    this.DateNow = new Date();
    this.DateNow2 = moment(new Date()).format('DD MMMM YYYY').toString();
    console.log(this.Capdis.pilih)
    this.initUser();
  }
  async initUser() {
    this.auth = JSON.parse(localStorage.getItem('AUTH'));
    this.token= JSON.parse(localStorage.getItem('TOKEN'));
    if(this.auth.level === undefined || this.auth.level === null ){
      localStorage.clear();
      this.router.navigate(['/login']);
  }
    this.getData();
    this.getCapdis();
  }

  getCapdis() {
    this.API.getCapdis(this.token).subscribe(result => {
        result['Output'].forEach((item) => {
            this.cabang.push({
                'id': item.id_capdis,
                'nama': item.nama,
            });
        });
    });
  }

  getData() {
    this.ListAbsen, this.fullAbsen = [];
    this.API.getAbsensiMasuk(this.token).subscribe(result => {
      this.fullAbsen = result['Output'];
      // console.log(this.fullAbsen);
      if(this,this.auth.level===2){
       this.fullAbsen.forEach(item => {
          if(item.capdis === this.auth.idCapdis && item.tanggal === this.DateNow2){
            this.ListAbsen.push(item);
          }
        });
      }else{
       this.fullAbsen.forEach(item => {
          if(item.tanggal === this.DateNow2){
            this.ListAbsen.push(item);
          }
        });
        // this.ListAbsen = result['Output'];
        // console.log(this.ListAbsen);
      }
      this.dataSource = new MatTableDataSource(this.ListAbsen);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openKalendar(){
    this.router.navigate(['/cuti']);
  }

  onDateSelected(newdate){
    const _ = moment();
    const tmp = moment(newdate).add({ hours: _.hour(), minutes: _.minute(), seconds: _.second() });
    let tmpselected =  moment(tmp.toDate()).format('DD MMMM YYYY').toString(); ;
    // console.log(tmpselected);
    this.ListAbsen = [];
    if(this,this.auth.level===2){
      this.fullAbsen.forEach(item => {
         if(item.capdis === this.auth.idCapdis && item.tanggal === tmpselected){
           this.ListAbsen.push(item);
         }
       });
     }else{
      if(this.Capdis.pilih === undefined || this.Capdis.pilih === 'null'){
        this.fullAbsen.forEach(item => {
          if(item.tanggal === tmpselected){
            this.ListAbsen.push(item);
          }
        });
      }else{
        this.fullAbsen.forEach(item => {
          if(item.tanggal === tmpselected && item.capdis === this.Capdis.pilih){
            this.ListAbsen.push(item);
          }
        });
      }

       // this.ListAbsen = result['Output'];
      //  console.log(this.ListAbsen);
     }
     this.dataSource = new MatTableDataSource(this.ListAbsen);
     this.dataSource.paginator = this.paginator;
     this.dataSource.sort = this.sort;
    // setTimeout(() => {
    //   this.getData();
    // }, 500);
    // let tmp = moment(e).format('DD MMMM YYYY').toString();
    // console.log(tmp);
    // this.ListAbsen =  this.fullAbsen.filter(s => s.tanggal === tmp);
    // this.dataSource = new MatTableDataSource(this.ListAbsen);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  onChange(e) {
    console.log(e);
    this.ListAbsen = [];
    const _ = moment();
    const tmp = moment(this.DateNow).add({ hours: _.hour(), minutes: _.minute(), seconds: _.second() });
    let tmpselected =  moment(tmp.toDate()).format('DD MMMM YYYY').toString(); ;
    if (e === 'null') {
        setTimeout(() => {
          this.fullAbsen.forEach(item => {
            if(item.tanggal === tmpselected){
              this.ListAbsen.push(item);
            }
          });
            this.dataSource = new MatTableDataSource(this.ListAbsen);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }, 500);
    } else {
      this.ListAbsen =  this.fullAbsen.filter(s => s.capdis === e.toString() && s.tanggal === tmpselected);
      this.dataSource = new MatTableDataSource(this.ListAbsen);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  DetailAbsensi(e) {
    // console.log(e);
    const dialogRef = this._MatDialog.open(DetailAbsensi, {
      panelClass: 'dialog',
      width: '500px',
      hasBackdrop: true,
      data: e,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'update' || result.event == 'reject'){
        this.initUser();
      }
    });
  }
}

@Component({
  selector: 'detailAbsensi-dialog',
  templateUrl: 'detail/detailAbsensi.html',
  styleUrls: ['detail/detailAbsensi.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class DetailAbsensi {
  imgUrl = environment.ImageUrl;
  uid: any;
  DtAbsensi: any = [];
  absensi: any = [];
  tmp: any = [];
  gambar: any;
  status: any;
  token:string;
  auth:any=[];
  buttonDisabled: boolean = true;
  // absensiForm: FormGroup;
  constructor(
    http: HttpClient,
    private API: ApiService,
    public _MatDialog: MatDialog,
    public dialogRef: MatDialogRef<DetailAbsensi>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, turkish);
  }

  absensiForm: FormGroup = new FormGroup({
    nip: new FormControl('', [Validators.required]),
    jabatan: new FormControl('', [Validators.required]),
    JamMasuk: new FormControl('', [Validators.required]),
    JamKeluar: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.token = JSON.parse(localStorage.getItem('TOKEN'));
    this.auth = JSON.parse(localStorage.getItem('AUTH'));
    this.uid = this.data.user_id;
    this.status = this.data.status;

    if (this.status === '2') {
      this.data.jam_masuk = '';
      this.data.jam_keluar = '';
    }
  }

  onChange(e) {
    this.buttonDisabled = false;
  }

  Cancel() {
    this.API.BatalAbsensi(this.token,this.data.pkp,this.data.idMasuk).subscribe(result => {
      const status = result['status'];
      const desc = result['message'];

      if (status === 200) {
        this.dialogRef.close({event:'reject'});
      }else{
        this.dialogRef.close({event:'cancel'});
        alert(desc);
      }
    });
  }
  // new Date('2012.08.10').getTime() / 1000
  OnUpdate() {
    this.API.UpdateStatus(this.data.id_absensi, this.data.status, (new Date(this.data.tanggal).getTime() / 1000)).subscribe(result => {
      const Status = result.status;
      if (Status === 0) {
        alert('Permintaan Ditolak');
        this.dialogRef.close({event:'cancel'});
      } else {
        this.dialogRef.close({event:'update'});
        alert('Data Diubah');
      }
    });
  }
}

export const COMPONENT_LIST = [
  MasukComponent, DetailAbsensi
];
