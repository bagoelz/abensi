import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ApiService } from 'app/services/api.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { JadwalapiService } from '../jadwalapi.service';
import { CreateComponent } from './create/create.component';
@Component({
  selector: 'app-jadwal',
  templateUrl: './jadwal.component.html',
  styleUrls: ['./jadwal.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class JadwalComponent implements OnInit {
  dialogRef: any;
  dataSource: MatTableDataSource<any>;
  namahari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  displayedColumns = ['no', 'keterangan', 'statusabsen', 'harikerja', 'jamkerja', 'bolehabsen', 'toleransi'];
  date: any = [];
  token: string;
  auth: any = [];
  cabang: any = [];
  Capdis: any = [];
  newArray: any = [];
  ListJadwal: any = [];
  filterJadwal: any = [];
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  constructor(
    private API: ApiService,
    public api: JadwalapiService,
    private toastr: ToastrService,
    http: HttpClient,
    private router: Router,
    public _MatDialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.token = JSON.parse(localStorage.getItem('TOKEN'));
    this.auth = JSON.parse(localStorage.getItem('AUTH'));
    this.date = moment().months();
    this.loadJadwal();
    this.getCapdis();
  }

  loadJadwal() {
    this.ListJadwal = []
    this.api.getJadwal().subscribe(result => {
      result['Output'].forEach(element => {
        this.ListJadwal.push({
          id: element.id,
          keterangan: element.keterangan,
          toleransi: element.toleransi,
          stsabsen: element.status,
          jlhHari: element.jlhHari,
          statusAbsen: element.status === 'reg' ? 'Regular' : 'Shift',
          break: element.break === '1' ? true : false,
          detail: element.detail,
          bolehMasuk: element.bolehMasuk,
          jamKerja: +element.jamKerja,
          kerjaSatu: +element.kerjaSatu,
          kerjaDua: +element.kerjaDua,
          kerjaTiga: +element.kerjaTiga,
        })
        this.dataSource = new MatTableDataSource(this.ListJadwal);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    });
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onChange(e) {
    this.filterJadwal = [];
    if (e === 'null') {
      // setTimeout(() => {
      this.ListJadwal.forEach(item => {
        this.filterJadwal.push(item);
      });
      this.dataSource = new MatTableDataSource(this.filterJadwal);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // }, 500);
    } else {
      this.filterJadwal = this.ListJadwal.filter(s => s.idCapdis === e.toString());
      this.dataSource = new MatTableDataSource(this.filterJadwal);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  createJadwal() {
    const dialogRef = this._MatDialog.open(CreateComponent, {
      panelClass: 'dialog',
      width: '90%',
      hasBackdrop: true,
      data: { cabang: this.cabang }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) this.loadJadwal();
    });
  }


  getRow(e) {
    // console.log(e);
    const dialogRef = this._MatDialog.open(CreateComponent, {
      panelClass: 'dialog',
      width: '50%',
      hasBackdrop: true,
      data: { cabang: this.cabang, row: e }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) this.loadJadwal();
    });
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
}

