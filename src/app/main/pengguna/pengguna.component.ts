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
    selector: 'contacts-contact-list',
    templateUrl: './pengguna.component.html',
    styleUrls: ['./pengguna.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

@Injectable()
export class Pengguna {
    imgUrl = environment.ImageUrl;
    dataSource: MatTableDataSource<MenuData>;
    displayedColumns = ['avatar', 'username', 'nama', 'gender', 'status'];
    cabang: any = [];

    list_table: MenuData[] = [];
    list_cabang: any = [];
    list_admin: MenuData[] = [];
    list_pengguna: MenuData[] = [];
    listadmin: MenuData[] = [];
    listpengguna: MenuData[] = [];
    Capdis:any=[];
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
        this.initUser();
        this.loadJadwal();
    }


    loadJadwal() {
        this.API.getJadwal(this.token).subscribe(result => {
            this.jadwal = result['Output'];
        });
    }

    async initUser() {
        this.listadmin=[];
        this.listpengguna=[];
        this.cabang=[];
        this.auth = JSON.parse(localStorage.getItem('AUTH'));
        this.token = JSON.parse(localStorage.getItem('TOKEN'));
        if(this.auth.level === undefined || this.auth.level === null ){
            localStorage.clear();
            this.router.navigate(['/login']);
        }
        this.getUser();
        this.getCapdis();
        this.getAdmin();
    }

    getUser() {
        this.list_table = [];
        this.API.getPengguna(this.token).subscribe(result => {
            if(this.auth.level ==2){
                result['Output'].forEach((item)=>{
                    if(item['capdis'] === this.auth.idCapdis){
                        this.listpengguna.push(item);
                        this.list_table.push(item);
                    }
                });
            }else{
                this.listpengguna = result['Output'];
                this.list_table = result['Output'];
            }
           
            this.dataSource = new MatTableDataSource(this.listpengguna);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }

    getAdmin() {
        this.API.getAdmin(this.token).subscribe(result => {
            if(this.auth.level ==2){
                result['Output'].forEach((item)=>{
                    if(item['capdis'] === this.auth.idCapdis){
                        this.listadmin.push(item);
                    }
                })  
            }else{
                this.listadmin = result['Output'];
            }
           
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
                this.getAdmin();
                this.getUser();
                this.dataSource = new MatTableDataSource(this.list_table);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }, 500);
        } else {
            this.list_cabang = [];
            this.list_cabang = this.list_table.filter(s => s.capdis === e.toString());
            this.dataSource = new MatTableDataSource(this.list_cabang);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }
    }

    admin() {
        this.list_table = [];
        if(this.Capdis.pilih == undefined || this.Capdis.pilih === null){
            this.list_table = this.listadmin.filter(s => s.level === "2");
        }else{
            this.list_table = this.listadmin.filter(s => s.level === "2" && s.capdis === this.Capdis.pilih);
        }
        //this.list_table=this.listadmin;
        setTimeout(() => {
            this.dataSource = new MatTableDataSource(this.list_table);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }, 500);
    }

    sadmin() {
        this.list_table = [];
        if(this.Capdis.pilih === undefined || this.Capdis.pilih === null){
            this.list_table = this.listadmin.filter(s => s.level === "1");
        }else{
            this.list_table = this.listadmin.filter(s => s.level === "1" && s.capdis === this.Capdis.pilih);
           
        }
        //this.list_table=this.listadmin;
        setTimeout(() => {
            this.dataSource = new MatTableDataSource(this.list_table);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }, 500);
    }

    pengguna() {
        this.list_table = [];
        if(this.Capdis.pilih == undefined || this.Capdis.pilih === null){
            this.list_table = this.listpengguna.filter(s => s.level === "3");
        }else{
            this.list_table = this.listpengguna.filter(s => s.level === "3" && s.capdis === this.Capdis.pilih);
        }
        
        //this.list_table = this.listpengguna;
        // console.log(this.list_admin);
        setTimeout(() => {
            this.dataSource = new MatTableDataSource(this.list_table);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }, 500);
    }

    SaveToaster() {
        this.toastr.success("Data Berhasil Disimpan", "Informasi");
    }

    EditToaster() {
        this.toastr.success("Data Berhasil Disimpan", "Informasi");
    }

    getRow(item): void {
        const dialogRef = this._MatDialog.open(tambahPengguna, {
            panelClass: 'dialog',
            width: '500px',
            hasBackdrop: true,
            data: item,
        });

        dialogRef.afterClosed().subscribe(result => {
            // this.getUser();
            // this.getCapdis();
            // this.getAdmin();
            if(result.event !== 'cancel'){
                this.initUser();
            }
        });
    }

    openDialog(): void {
        const dialogRef = this._MatDialog.open(tambahPengguna, {
            panelClass: 'dialog',
            width: '500px',
            hasBackdrop: true,
            // data: this.auth,
        });

        dialogRef.afterClosed().subscribe(result => {
            // this.getUser();
            // this.getCapdis();
            // this.getAdmin();
            if(result.event !== 'cancel'){
                this.initUser();
            }
            
        });
    }

    openKalendar() {
        this.router.navigate(['/apps/calendar']);
    }

    openJadwal() {
        const dialogRef = this._MatDialog.open(jadwal, {
            panelClass: 'dialog',
            width: '400px',
            hasBackdrop: true,
            data: this.jadwal
        });

        dialogRef.afterClosed().subscribe(result => {
            this.loadJadwal();
        });
    }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
        const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

        return (invalidCtrl || invalidParent);
    }
}


@Component({
    selector: 'jadwal-dialog',
    templateUrl: 'tambahpengguna/jadwal.html',
    styleUrls: ['tambahpengguna/buatpengguna.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class jadwal {
    dataSource: MatTableDataSource<any>;
    displayedColumns = ['hari', 'masuk', 'keluar'];
    namahari=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat'];
    ListJadwal:any=[];
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
        public _MatDialog: MatDialog,
        public dialogRef: MatDialogRef<jadwal>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
    }

    ngOnInit(): void {
        this.data.forEach(item => {
            this.ListJadwal.push({
                'id':item.id,
                'masuk':item.masuk,
                'pulang':item.pulang,
                'hari':this.namahari[item.id],
            })
        });
        this.dataSource = new MatTableDataSource(this.ListJadwal);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    update(e) {
        const dialogRef = this._MatDialog.open(SettingJadwal, {
            panelClass: 'dialog',
            width: '35%',
            hasBackdrop: true,
            data: e
        });

        dialogRef.afterClosed().subscribe(result => {
            this.dialogRef.close();
        });
    }
}

@Component({
    selector: 'settings-dialog',
    templateUrl: 'tambahpengguna/settingjadwal.html',
    styleUrls: ['tambahpengguna/buatpengguna.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class SettingJadwal {
    jadwalForm: FormGroup;
    timeArr: any = [];
    timeArr2: any = [];
    starttime: any;
    endtime: any;
    token:any;
    toggle: boolean = false;
    buttonDisabled: boolean = true;
    constructor(
        private toastr: ToastrService,
        http: HttpClient,
        private API: ApiService,
        public _MatDialog: MatDialog,
        public dialogRef: MatDialogRef<SettingJadwal>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);

        // console.log(this.data);

        let masuk = this.data.masuk;
        let pulang = this.data.pulang;

        this.timeArr = masuk.split(':');
        this.timeArr2 = pulang.split(':');

        var date = new Date().setHours(this.timeArr[0], this.timeArr[1], this.timeArr[2]);
        var date2 = new Date().setHours(this.timeArr2[0], this.timeArr2[1], this.timeArr2[2]);

        this.starttime = moment(date).format("HH:mm");

        this.endtime = moment(date2).format("HH:mm");

        this.jadwalForm = this.createEventForm();
       
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Create the event form
     *
     * @returns {FormGroup}
     */
    ngOnInit(): void {
        this.token = JSON.parse(localStorage.getItem('TOKEN'));
    }
    createEventForm(): FormGroup {
        return new FormGroup({
            activex: new FormControl(this.toggle),
            start: new FormControl({ value: this.starttime, disabled: true }),
            end: new FormControl({ value: this.endtime, disabled: true }),
        });
    }


    //     activex: true
    // start: "07:35"
    // end: "16:00"
    onUpdate() {
        let masuk = this.jadwalForm.value.start;
        let pulang = this.jadwalForm.value.end;
        // console.log(masuk);
        this.API.updateJadwal(this.token,this.data.id, masuk, pulang).subscribe(result => {
            if (result.status === 200) {
                this.dialogRef.close();
            }
        });
    }

    onDelete() {
        this.dialogRef.close();
    }

    changeDisable(e) {
        if (e.checked) {
            this.buttonDisabled = false;
            this.jadwalForm.controls['start'].enable();
            this.jadwalForm.controls['end'].enable();
        } else {
            this.jadwalForm.controls['start'].disable();
            this.jadwalForm.controls['end'].disable();
        }
    }


    // ngOnInit(): void {
    //     console.log(this.data);
    //     let masuk = this.data[0].masuk;
    //     let pulang = this.data[0].pulang;

    //     this.timeArr = masuk.split(':');
    //     this.timeArr2 = pulang.split(':');

    //     var date = new Date().setHours(this.timeArr[0], this.timeArr[1], this.timeArr[2]);
    //     var date2 = new Date().setHours(this.timeArr2[0], this.timeArr2[1], this.timeArr2[2]);

    //     this.starttime = moment(date).format("h:mm:ss");
    //     console.log(this.starttime);

    //     this.endtime = moment(date2).format("h:mm:ss");
    //     console.log(this.endtime);
    // }
}


@Component({
    selector: 'sample2-dialog',
    templateUrl: 'tambahpengguna/buatpengguna.html',
    styleUrls: ['tambahpengguna/buatpengguna.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class tambahPengguna {
    ModelPengguna: any = [];
    cabang: any = [];
    jabatan: any = [];
    imageChangedEvent: any = '';
    gambar: any;
    imgUrl = environment.ImageUrl;

    file: any;
    fileData: File = null;
    previewUrl: any = null;
    fileUploadProgress: string = null;
    uploadedFilePath: string = null;
    auth: any = [];
    matcher = new MyErrorStateMatcher();
    token:string;
    title: string;

    flag: boolean = false;

    editable: boolean;

    action: any = [];


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
        public dialogRef: MatDialogRef<tambahPengguna>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
    }


    nipFormControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9.,]+$')]);
    namalengkapFormControl = new FormControl('', [Validators.required]);
    jkControl = new FormControl('', [Validators.required]);
    cpControl = new FormControl('', [Validators.required]);
    jbtnControl = new FormControl('', [Validators.required]);
    hpControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9.,]+$')]);
    lvlControl = new FormControl('', [Validators.required]);
    usernameControl = new FormControl('', [Validators.required]);
    passControl = new FormControl('', [Validators.required, (control) => this.validatePasswords(control, 'passControl')]);
    confpassControl = new FormControl('', [Validators.required, (control) => this.validatePasswords(control, 'confpassControl')]);


    penggunaForm: FormGroup = new FormGroup({
        nipGroup: this.nipFormControl,
        namalengkapGroup: this.namalengkapFormControl,
        jkControlGroup: this.jkControl,
        lvlControlGroup: this.lvlControl,
        usernameControlGroup: this.usernameControl,
        passControlGroup: this.passControl,
        confpassControlGroup: this.confpassControl,
        cpControlGroup: this.cpControl,
        jbtnControlGroup: this.jbtnControl,
        hpControlGroup: this.hpControl,
    });

    ngOnInit() {
        // this.getCapdis();
        // this.getJabatan();
        this.auth = JSON.parse(localStorage.getItem('AUTH'));
        this.token = JSON.parse(localStorage.getItem('TOKEN'));
        console.log(this.data)
        if (this.data !== null) {
            this.title = 'Edit Pengguna';
            this.flag = true;
            this.ModelPengguna.username = this.data.username;
            this.ModelPengguna.nip = this.data.nip;
            this.ModelPengguna.nama_lengkap = this.data.fullname;
            this.ModelPengguna.jabatan = this.data.jabatan;
            this.ModelPengguna.gender = this.data.gender;
            this.ModelPengguna.hp = this.data.hp;
            this.ModelPengguna.capdis = this.data.capdis;
            this.ModelPengguna.level = this.data.level;
            this.editable = true;
            if (this.data.user_picture === null) {
                this.gambar = '';
            }
            else if (this.data.user_picture !== null) {
                this.gambar = this.imgUrl + this.data.user_picture;
            }
            
            this.getCapdis();
            this.getJabatan();
        } else {
            this.editable = false;
            this.title = 'Tambah Pengguna';
            this.flag = false;
            // this.auth = this.data.auth;
            this.ModelPengguna = [];
            this.getCapdis();
            this.getJabatan();
        }
    }

    validatePasswords(control: AbstractControl, name: string) {
        if (this.penggunaForm === undefined || this.passControl.value === '' || this.confpassControl.value === '') {
            return null;
        } else if (this.passControl.value === this.confpassControl.value) {
            if (name === 'password1' && this.confpassControl.hasError('passwordMismatch')) {
                this.passControl.setErrors(null);
                this.confpassControl.updateValueAndValidity();
            } else if (name === 'password2' && this.passControl.hasError('passwordMismatch')) {
                this.confpassControl.setErrors(null);
                this.passControl.updateValueAndValidity();
            }
            return null;
        } else {
            return {
                'passwordMismatch': { value: 'Password tidak sama' }
            };
        }
    }

    PassUpdate(e) {
        const dialogRef = this._MatDialog.open(UpdatePassword, {
            panelClass: 'dialog',
            width: '250px',
            hasBackdrop: true,
            data: e
        });

        dialogRef.afterClosed().subscribe(result => {
            location.reload();
        });
    }

    getCapdis() {
        this.API.getCapdis(this.token).subscribe(result => {
            result['Output'].forEach((item) => {
                if(this.auth.level == 2){
                    if(item.id_capdis === this.auth.idCapdis){
                        this.cabang.push({
                        'id': item.id_capdis,
                        'nama': item.nama,
                    });
                    }
                }else{
                    this.cabang.push({
                        'id': item.id_capdis,
                        'nama': item.nama,
                    });
                }
               
            });
        });
    }

    getJabatan() {
        this.API.getTunjangan2(this.token).subscribe(result => {
            result['Output'].forEach((item) => {
                this.jabatan.push({
                    'id': item.id_ttp,
                    'jabatan': item.jabatan,
                });
            })
        });
    }

    approve() {
        let a = '1';
        this.action = ['approve', 0];
        const dialogRef = this._MatDialog.open(ConfirmDialogComponent, {
            panelClass: 'dialog',
            hasBackdrop: true,
            data: this.action,
        });
        
            this.API.approve(this.token,this.data.user_id, a).subscribe(result => {
                if(result.status='200'){
                    dialogRef.close();
                location.reload();
                }else{
                    this.toastr.error(result.message,'Validasi gagal')
                }
                
            });
       
    }

    get password1(): AbstractControl {
        return this.penggunaForm.get('passControl');
    }

    get password2(): AbstractControl {
        return this.penggunaForm.get('confpassControl');
    }

    SaveToaster() {
        this.toastr.success("Data Berhasil Disimpan", "Informasi");
    }

    ErrorToaster(val) {
        this.toastr.error(val);
    }

    EditToaster() {
        this.toastr.success("Data Berhasil Diubah", "Informasi");
    }

    getRequiredErrorMessage(field: any) {
        return this.penggunaForm.get(field).hasError('required') ? 'Data belum diisi' : '';
    }

    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        let pass = group.controls.password.value;
        let confirmPass = group.controls.confirmPassword.value;

        return pass === confirmPass ? null : { notSame: true };
    }

    addPengguna() {
        this.API.addUser(this.token,this.ModelPengguna.username, this.ModelPengguna.password,this.ModelPengguna.hp, this.ModelPengguna.nama_lengkap, this.ModelPengguna.nip,
            this.ModelPengguna.jabatan, this.ModelPengguna.gender, this.ModelPengguna.capdis, this.ModelPengguna.level, this.file).subscribe(result => {
                const status = result['status'];
                const desc = result['message'];

                if (status === 200) {
                    this.ModelPengguna = [];
                    this.dialogRef.close({event:'save'});
                    this.SaveToaster();
                }else{
                    this.dialogRef.close({event:'cancel'});
                    this.ErrorToaster(desc);
                }
            });
    }

    addPengguna2() {
        this.API.addUser2(this.token,this.ModelPengguna.username, this.ModelPengguna.password, this.ModelPengguna.nama_lengkap, this.ModelPengguna.nip,
            this.ModelPengguna.jabatan, this.ModelPengguna.gender, this.ModelPengguna.capdis, this.ModelPengguna.level).subscribe(result => {
                const status = result['status'];
                const desc = result['message'];

                if (status === 200) {
                    this.ModelPengguna = [];
                    this.dialogRef.close({event:'save'});
                    this.SaveToaster();
                }else{
                    this.dialogRef.close({event:'cancel'});
                    this.ErrorToaster(desc);
                    
                }
            });
        //this.dialogRef.close();
        
    }

    hapusPengguna(){
        this.API.deleteUser(this.token,this.data.user_id,this.ModelPengguna.user_picture,this.ModelPengguna.level).subscribe(result=>{
            const status = result['status'];
            const desc = result['message'];
            if (status === 200) {
                this.dialogRef.close({event:'delete'});
            }else{
                this.dialogRef.close({event:'cancel'});
                this.ErrorToaster(desc);
            }
        });
    }
    updatePengguna() {
        if (this.file === undefined) {
            this.API.updateUser(this.token,this.data.user_id,this.ModelPengguna.hp, this.ModelPengguna.username, this.ModelPengguna.nama_lengkap, this.ModelPengguna.nip, this.ModelPengguna.jabatan,
                this.ModelPengguna.gender, this.ModelPengguna.capdis, this.ModelPengguna.level).subscribe(result => {
                    const status = result['status'];
                    const desc = result['desc'];
                    if (status === 200) {
                        this.dialogRef.close({event:'update'});
                    }else{
                        this.dialogRef.close({event:'cancel'});
                        this.ErrorToaster(desc);
                    }

                });
        } else {
            this.API.updateUser2(this.data.user_id,this.ModelPengguna.user_picture,this.ModelPengguna.hp, this.ModelPengguna.username, this.ModelPengguna.nama_lengkap, this.ModelPengguna.nip, this.ModelPengguna.jabatan,
                this.ModelPengguna.gender,this.ModelPengguna.capdis, this.ModelPengguna.level, this.file).subscribe(result => {
                    const status = result['status'];
                    const desc = result['desc'];
                    if (status === 200) {
                        this.dialogRef.close({event:'update'});
                    }else{
                        this.dialogRef.close({event:'cancel'});
                        this.ErrorToaster(desc);
                    }
                });
        }
       
    }

    onClick(): void {
        if(this.ModelPengguna.username === undefined){
            alert('username tidak boleh kosong');
            return;
        }

        if(this.file === undefined){
            alert('gambar harus dipilih');
            return;
        }
        this.addPengguna();
        // this.action = ['simpan', 0];
        // const dialogRef = this._MatDialog.open(ConfirmDialogComponent, {
        //     panelClass: 'dialog',
        //     hasBackdrop: true,
        //     data: this.action,
        // });
        // dialogRef.afterClosed().subscribe(dialogResult => {
        //     if (dialogResult) {
        //         if (this.file !== undefined) {
        //             this.addPengguna();
        //         } else {
        //             this.addPengguna2();
        //         }
        //     }
        // });
    }

    onUpdate(): void {
        this.action = ['ubah', 0];
        const dialogRef = this._MatDialog.open(ConfirmDialogComponent, {
            panelClass: 'dialog',
            hasBackdrop: true,
            data: this.action,
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
            if (dialogResult) {
                this.updatePengguna();
            }
        });
    }

    onDelete() {
        this.action = ['hapus', 1];
        const dialogRef = this._MatDialog.open(ConfirmDialogComponent, {
            panelClass: 'dialog',
            hasBackdrop: true,
            data: this.action,
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
            this.hapusPengguna();
        });
    }

    preview() {
        // Show preview 
        var mimeType = this.fileData.type;
        if (mimeType.match(/image\/*/) == null) {
            return;
        }

        var reader = new FileReader();
        reader.readAsDataURL(this.fileData);
        reader.onload = (_event) => {
            this.previewUrl = reader.result;
        }
    }

    openfile() {
        $('#imgupload').trigger('click');
    }

    getFileAttachment(event: any) {
        if (event.target.files && event.target.files[0]) {
            this.file = event.target.files[0];

            const reader = new FileReader();
            reader.onload = e => this.gambar = reader.result;
            // console.log(reader.readAsDataURL(file));

            reader.readAsDataURL(this.file);
        }
    }

    addUser() {

    }
}


@Component({
    selector: 'sample2-dialog',
    templateUrl: 'tambahpengguna/updatepass.html',
    styleUrls: ['tambahpengguna/buatpengguna.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class UpdatePassword {
    newpassword: string;
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
        public dialogRef: MatDialogRef<UpdatePassword>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
    }

    passControl = new FormControl('', [Validators.required, (control) => this.validatePasswords(control, 'passControl')]);
    confpassControl = new FormControl('', [Validators.required, (control) => this.validatePasswords(control, 'confpassControl')]);


    UpdatePassForm: FormGroup = new FormGroup({
        passControlGroup: this.passControl,
        confpassControlGroup: this.confpassControl,
    });

    ngOnInit(): void {
    }

    getRequiredErrorMessage(field: any) {
        return this.UpdatePassForm.get(field).hasError('required') ? 'Data belum diisi' : '';
    }

    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        let pass = group.controls.password.value;
        let confirmPass = group.controls.confirmPassword.value;

        return pass === confirmPass ? null : { notSame: true };
    }

    validatePasswords(control: AbstractControl, name: string) {
        if (this.UpdatePassForm === undefined || this.passControl.value === '' || this.confpassControl.value === '') {
            return null;
        } else if (this.passControl.value === this.confpassControl.value) {
            if (name === 'password1' && this.confpassControl.hasError('passwordMismatch')) {
                this.passControl.setErrors(null);
                this.confpassControl.updateValueAndValidity();
            } else if (name === 'password2' && this.passControl.hasError('passwordMismatch')) {
                this.confpassControl.setErrors(null);
                this.passControl.updateValueAndValidity();
            }
            return null;
        } else {
            return {
                'passwordMismatch': { value: 'Password tidak sama' }
            };
        }
    }

    SaveToaster() {
        this.toastr.success("Password Berhasil Diubah", "Informasi");
    }

    onUpdate() {
        this.API.updatepass(this.data.user_id, this.newpassword, this.data.level).subscribe(result => {
            if (result.status == 'OK') {
                this.dialogRef.close();
                location.reload()
            }else{
                this.toastr.success("Ganti Password gagal", "Warning");
            }
            
        });
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
    Pengguna,
    tambahPengguna,
    SettingJadwal,
    UpdatePassword,
    jadwal
];