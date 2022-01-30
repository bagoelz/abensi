import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject, from } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';
import { MatTableDataSource, MatDialog, ErrorStateMatcher, MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent } from '@angular/material';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ApiService } from 'app/services/api.service';
import { FormControl, FormGroupDirective, NgForm, FormGroup, Validators, FormBuilder, AbstractControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';


import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import * as $ from 'jquery';
import { setTimeout } from 'timers';
import * as moment from 'moment';

@Component({
  selector: 'cuti',
  templateUrl: './cuti.component.html',
  styleUrls: ['./cuti.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class CutiComponent implements OnInit {
  dialogRef: any;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['nip', 'nama', 'jabatan', 'capdis'];
  ListCuti: any = [];
  TmpCuti: any = [];
  listMonth: any = [];
  bulan: any;
  date: any = [];
  token: string;
  auth: any = [];
  cabang: any = [];
  Capdis: any = [];
  newArray: any = [];
  ListAbsen: any = [];
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
    // moment.locale('ID');
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
    this.token = JSON.parse(localStorage.getItem('TOKEN'));
    this.auth = JSON.parse(localStorage.getItem('AUTH'));
    this.date = moment().months();
    this.bulan = this.monthNames[this.date];
    this.load(this.bulan);
    this.listMonth = moment.months();
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

  onChange2(e) {
    this.ListAbsen = [];
    if (e === 'null') {
      this.dataSource = new MatTableDataSource(this.newArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.ListAbsen = this.newArray.filter(s => s.id_capdis === e.toString());
      this.dataSource = new MatTableDataSource(this.ListAbsen);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  load(el) {
    this.newArray = [];
    let uniqueObject = {};
    this.API.getCuti().subscribe(result => {
      this.ListCuti = result['Output'];
      this.TmpCuti = this.ListCuti.filter(e => {
        var a = e.mulai.split(' ');
        return a[1] === el;
      });

      let i = 0;
      this.TmpCuti.forEach(item => {
        let user_id = this.TmpCuti[i]['user_id'];
        uniqueObject[user_id] = this.TmpCuti[i];
        i++;
      });

      for (const j in uniqueObject) {
        this.newArray.push(uniqueObject[j]);
      }

      this.dataSource = new MatTableDataSource(this.newArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onChange(event) {
    // console.log(event);
    this.load(event);
  }

  tmbhCuti() {
    this.dialogRef = this._MatDialog.open(dialogCuti, {
      panelClass: 'dialog',
      width: '500px',
      hasBackdrop: true,
      data: {
        lib: this.TmpCuti,
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'update') {
        this.load(this.bulan);
      }
    });
  }

  getRow(e) {
    this.dialogRef = this._MatDialog.open(DetailCuti, {
      // panelClass: 'dialog',
      width: '65%',
      hasBackdrop: true,
      data: { data: e, bulan: this.bulan, lib: this.TmpCuti }
    });

    this.dialogRef.afterClosed().subscribe(result => {

    });
  }
}

@Component({
  selector: 'dialogcuti',
  templateUrl: 'tambahcuti/detailcuti.html',
  styleUrls: ['tambahcuti/detailcuti.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class DetailCuti {
  displayedColumns = ['no', 'mulai', 'selesai', 'keterangan', 'lampiran'];
  dataSource: MatTableDataSource<any>;
  imgUrl = environment.ImageUrl;

  UserData: any = [];
  lib: any = [];
  bulan: any;
  tmp: any = [];
  FinalData: any = [];


  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  gambar: any;
  fullname: string;
  jabatan: string;
  capdis: string;
  /**
 * Constructor
 *
 * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
 */

  constructor(
    http: HttpClient,
    private API: ApiService,
    public _MatDialog: MatDialog,
    public dialogRef: MatDialogRef<DetailCuti>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, turkish);
  }

  ngOnInit(): void {
    this.UserData = this.data.data;
    this.lib = this.data.lib;
    this.bulan = this.data.bulan;
    this.FinalData = this.lib.filter(item => item.user_id === this.UserData.user_id);
    console.log(this.FinalData);
    this.gambar = this.FinalData[0].user_picture;
    this.fullname = this.FinalData[0].fullname;
    this.jabatan = this.FinalData[0].jabatan;
    this.capdis = this.FinalData[0].nama;
    this.dataSource = new MatTableDataSource(this.FinalData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  seePreview(item) {
    window.open(environment.ImageUrl + '/spt/' + item.file, '_blank');
  }
}

@Component({
  selector: 'dialogcuti',
  templateUrl: 'tambahcuti/tambahcuti.html',
  styleUrls: ['tambahcuti/tambahcuti.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class dialogCuti {
  cutiForm: FormGroup;
  title: string;
  ModelCuti: any = [];
  filteredOptions: Observable<UserMenu[]>;

  tmpdata: any[] = [];
  options: UserMenu[] = [];
  tglmulai: Date;
  tglakhir: Date;
  uid: any;
  minDate: Date;
  value2: any;

  filename: string = null;
  base64File: string = null;
  fileList: FileList;
  file: File = null;
  files: any = [];
  previewUrl: any = null;
  capdis: String;
  libCuti: any = [];
  tmpFilterNip: any = [];
  validasiBulan: Boolean;

  color = 'accent';
  mode = 'indeterminate';
  value = 80;
  spinnerWithoutBackdrop = false;
  // fileData: File = null;
  // previewUrl:any = null;
  // fileUploadProgress: string = null;
  // uploadedFilePath: string = null;
  /**
  * Constructor
  *
  * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
  */

  constructor(
    private toastr: ToastrService,
    http: HttpClient,
    private API: ApiService,
    public _MatDialog: MatDialog,
    public dialogRef: MatDialogRef<dialogCuti>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, turkish);
  }

  ngOnInit(): void {
    this.libCuti = this.data.lib;
    var minCurrentDate = new Date();
    this.minDate = minCurrentDate;
    this.cutiForm = new FormGroup({
      nip: new FormControl(''),
      fullname: new FormControl(''),
      jabatan: new FormControl(''),
      capdis: new FormControl(''),
      mulai: new FormControl(''),
      akhir: new FormControl(''),
      ket: new FormControl(''),
    });

    this.getPegawai();
    if (this.data === null) {
      this.title = 'Tambah Cuti';
    } else {
      this.title = 'Edit Cuti';
    }
  }

  onDataChange(newdate) {
    const _ = moment();
    const tmp = moment(newdate).add({ hours: _.hour(), minutes: _.minute(), seconds: _.second() });
    this.tglmulai = tmp.toDate();
    if (this.ModelCuti.mulai !== undefined && this.ModelCuti.akhir !== undefined && this.ModelCuti.nip !== undefined) {
      this.Validate();
    }
  }

  onDataChange2(newdate) {
    const _ = moment();
    const tmp = moment(newdate).add({ hours: _.hour(), minutes: _.minute(), seconds: _.second() });
    this.tglakhir = tmp.toDate();
    if (this.ModelCuti.mulai !== undefined && this.ModelCuti.akhir !== undefined && this.ModelCuti.nip !== undefined) {
      this.Validate();
    }
  }

  // get eventFields()

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.tmpdata = [];
    this.uid = '';
    let pil = event.option.value;

    this.tmpdata = this.options.filter((item) => {
      return item.nip === pil;
    });
    this.uid = this.tmpdata[0].user_id;
    this.capdis = this.tmpdata[0].idcapdis;
  }

  async getPegawai() {
    this.API.getPengguna2().subscribe(result => {
      this.options = result['Output'];
    });
    // this.options = await this.tmp;
    this.filteredOptions = this.cutiForm.controls['nip'].valueChanges.pipe(
      startWith(''),
      map(item => this._filter(item)),
      tap(item => this.value2 = item)
    );

  }

  private _filter(value: string): UserMenu[] {
    const filterValue = value;
    const results = this.options.filter(option => option.nip.includes(filterValue));
    // results.length ? results : ['No data']
    return results;
  }

  _allowSelection(option: string): { [className: string]: boolean } {
    return {
      'no-data': option === 'No data',
    };
  }

  openfile() {
    $('#fileSrc').trigger('click');
  }

  fileChange(event) {
    this.fileList = event.target.files;
    this.file = this.fileList[0];
    var mimeType = this.file.type;
    if (mimeType.match(/pdf\/*/) == null) {
      this.toastr.error('Fila harus berupa PDF', 'informasi')
      return;
    }
    // console.log(this.filename);
    // console.log(this.file);
    this.filename = this.file.name;
    this.files.push(this.file.name);
    // console.log(this.files);

    var reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };

  }

  deleteAttachment(index) {
    this.files.splice(index, 1);
  }

  OpenAfterUpload() {
    // var mimeType = this.file.type;
    // if (mimeType.match(/image\/*/) == null) {
    //   return;
    // }
    // var reader = new FileReader();
    // reader.readAsDataURL(this.file);
    // reader.onload = (_event) => {
    //   this.previewUrl = reader.result;
    // };

    const dialogRef = this._MatDialog.open(tinjauGambar, {
      width: '65%',
      hasBackdrop: true,
      data: this.previewUrl,
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  async Validate() {
    let uid = this.uid;
    let mulai = this.tglmulai.valueOf() / 1000;
    let akhir = this.tglakhir.valueOf() / 1000;
    let hasil;
    this.API.getValidate(uid, mulai, akhir).subscribe(result => {
      const status = result['status'];
      if (!status) {
        this.toastr.warning(result['message'], "Cek tanggal SPT");
        this.validasiBulan = false;
      } else {
        this.validasiBulan = true;
      }
    });
  }

  loadSpinner() {
    this.spinnerWithoutBackdrop = true;
  }
  closeSpinner() {
    this.spinnerWithoutBackdrop = false;
  }

  async simpan() {
    let uid = this.uid;
    let mulai = this.tglmulai.valueOf() / 1000;
    let akhir = this.tglakhir.valueOf() / 1000;
    let ket = this.ModelCuti.ket;
    if (this.file === null) {
      alert('attachment harus di isi/dilampirkan');
      return;
    }
    if (mulai > akhir) {
      this.toastr.warning("Tanggal mulai tidak boleh lebih besar tanggal akhir", "Informasi");
      return;
    }

    // if(!this.validasiBulan){
    //   this.toastr.warning("Tanggal tidak bisa di gunakan", "Cek tanggal SPT");
    //   return;
    // }
    this.loadSpinner();
    this.API.addCuti(uid, mulai, akhir, ket, this.file, this.capdis.toString()).subscribe(result => {
      const status = result['status'];
      const desc = result['desc'];

      if (status === 'OK') {
        this.closeSpinner();
        this.ModelCuti = [];
        this.toastr.success("Data berhasil disimpan", "Informasi");
        this.dialogRef.close({ event: 'update' });
      } else {
        this.closeSpinner();
        this.toastr.error("Data gagal disimpan", "Informasi");
        this.dialogRef.close({ event: 'cancel' });
      }
    });
  }
}

@Component({
  selector: 'dialogcuti',
  templateUrl: 'tambahcuti/imagePreview.html',
  styleUrls: ['tambahcuti/tambahcuti.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class tinjauGambar {

  previewUrl: any;
  /**
  * Constructor
  *
  * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
  */

  constructor(
    http: HttpClient,
    private API: ApiService,
    public _MatDialog: MatDialog,
    public dialogRef: MatDialogRef<tinjauGambar>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, turkish);
  }

  ngOnInit(): void {
    this.previewUrl = this.data;
  }
}

function getUser(nip: string, nama: string, jabatan: string, capdis: string, idcapdis: number): UserMenu {
  return {
    nip: nip,
    nama: nama,
    jabatan: jabatan,
    capdis: capdis,
    idcapdis: idcapdis,
  };
}

function getNip(nip: string): Nip {
  return {
    nip: nip
  };
}

export interface Nip {
  nip: string,
}

export interface UserMenu {
  nip: string;
  nama: string;
  jabatan: string;
  capdis: string;
  idcapdis: number;
}

export const COMPONENT_LIST = [
  CutiComponent,
  dialogCuti,
  DetailCuti,
  tinjauGambar
];