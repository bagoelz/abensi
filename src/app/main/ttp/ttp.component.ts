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
import { Router } from '@angular/router';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

import { environment } from 'environments/environment';
//pdf generate
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-ttp',
  templateUrl: './ttp.component.html',
  styleUrls: ['./ttp.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class TtpComponent implements OnInit {
  BaseURL = environment.BaseUrl;
  dataSource: MatTableDataSource<any>;
  token:string;
  auth:any=[];
  Capdis:any=[]
  cabang:any=[];
  ListTtp:any=[];
  ListTemp:any=[];
  displayedColumns = ['nama', 'tpm', 'tpk', 'pkp', 'tpot', 'tpend'];

  itemCetak: any = [];
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
    public _MatDialog: MatDialog, private router: Router,
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
    this.token = JSON.parse(localStorage.getItem('TOKEN'));
    this.auth = JSON.parse(localStorage.getItem('AUTH'));
    if(this.auth.level === undefined || this.auth.level === null ){
      localStorage.clear();
      this.router.navigate(['/login']);
  }
    this.getTtp();
    this.getReport();
    this.getCapdis();
  }

  getTtp() {
    this.API.getTunjangan(this.token).subscribe(result => {
      this.ListTtp=result['Output'];
      console.log(this.ListTtp)
      this.dataSource = new MatTableDataSource(this.ListTtp);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
onChange(e) {
  if (e === 'null') {
      setTimeout(() => {
          this.getTtp();
          this.dataSource = new MatTableDataSource(this.ListTtp);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      }, 500);
  } else {
    this.ListTemp =  this.ListTtp.filter(s => s.capdis === e.toString());
    this.dataSource = new MatTableDataSource(this.ListTemp);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}

  getReport() {
    this.API.ReportTTP(this.token).subscribe(result => {
      this.itemCetak = result['Output'];
    });
  }

  cetak(id) {
    console.log(id);
    var myWindow = window.open(this.BaseURL + 'Cetakindividual/tampil/' + id.user_id, '_blank', 'width=100%');
  }

  generatePdf(action = 'open') {
    // const documentDefinition = { content: 'This is an sample PDF printed with pdfMake' };
    // pdfMake.createPdf(documentDefinition).open();

    const documentDefinition = this.getDocumentDefinition();

    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;

      default: pdfMake.createPdf(documentDefinition).open(); break;
    }

  }

  getDocumentDefinition() {
    // sessionStorage.setItem('user', JSON.stringify(this.listUser));
    return {
      content: [
        {
          text: 'Data TTP',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },

        // {
        //   text: 'Education',
        //   style: 'header'
        // },
        this.getEducationObject(this.itemCetak),

      ],


      info: {
        title: 'TTP',
        author: 'Dinas Pendidikan Pemprov Sumut',
        subject: 'sumut',
        keywords: 'sumut, sumut PDF',
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: 'underline'
        },
        name: {
          fontSize: 16,
          bold: true
        },
        jobTitle: {
          fontSize: 14,
          bold: true,
          italics: true
        },
        sign: {
          margin: [0, 50, 0, 10],
          alignment: 'right',
          italics: true
        },
        tableHeader: {
          bold: true,
        }

      }
    };
  }

  getEducationObject(user: any[]) {
    return {
      table: {
        widths: ['*', '*', '*', '*'],
        // widths: ['*', 'auto', 100, '*'],
        // alignment: 'rogj',
        body: [
          [
            {
              text: 'Nama',
              style: 'tableHeader'
            },
            {
              text: 'NSP',
              style: 'tableHeader',
              // alignment: 'right'
            },
            {
              text: 'POTONGAN',
              style: 'tableHeader',
              // alignment: 'right'
            },
            {
              text: 'JUMLAH',
              style: 'tableHeader',
              // alignment: 'right'
            },
          ],
          ...user.map(ed => {
            return [
              ed.nama,
              ed.nsp,
              ed.pot,
              ed.jlh
            ];
          })
        ]
      }
    };
  }

}
export const COMPONENT_LIST = [
  TtpComponent
];