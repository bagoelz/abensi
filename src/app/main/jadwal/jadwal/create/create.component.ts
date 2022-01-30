import { C, SHIFT } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatChipInputEvent, MatDialog, MatDialogRef, MatSlideToggleChange, MAT_DIALOG_DATA } from '@angular/material';
import * as internal from 'assert';
import { JadwalapiService } from '../../jadwalapi.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  @ViewChild('createJadwalForm', { static: true }) createJadwalForm: NgForm;

  daftarHari: any = [
    { id: 1, hari: 'Senin' },
    { id: 2, hari: 'Selasa' },
    { id: 3, hari: 'Rabu' },
    { id: 4, hari: 'Kamis' },
    { id: 5, hari: 'Jumat' },
    { id: 6, hari: 'Sabtu' },
    { id: 7, hari: 'Minggu' },
  ]
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  bundle: String = 'Tidak';
  crateJadwal: FormGroup;
  breakReg: any = [];
  breakSatu: any = [];
  breakDua: any = [];
  breakTiga: any = [];
  selectedJumlah: number = 0;
  listReguler: any = []
  listShift: any = []
  jumlahHariReg: number;
  jumlahHariShift: number;
  load: string;
  constructor(private _formBuilder: FormBuilder, public _MatDialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public api: JadwalapiService, public dialogRef: MatDialogRef<CreateComponent>,) { }

  ngOnInit() {
    if (this.data.row !== undefined) {
      // this.listShift = JSON.parse(this.data.row.detail)
      // this.listReguler = JSON.parse(this.data.row.listReguler)
      if (this.data.row.stsabsen === 'reg') {
        this.jumlahHariReg = +this.data.row.jlhHari;
        this.breakReg = JSON.parse(this.data.row.detail[0].break_reg);
        this.data.row.detail.forEach(element => {
          this.listReguler.push({
            jam: element.jamKerja / 60,
            jamKerja: element.jamKerja,
            hari: this.daftarHari.find((item) => item.id == +element.noHari),
            break: +element.break ? true : false, masuk: element.masuk, breakReg: JSON.parse(element.break_reg),
            bolehMasuk: +element.boleh_masuk, toleransi: +element.toleransi, noHari: +element.noHari
          })
        });
      } else {
        this.jumlahHariShift = +this.data.row.jlhHari;
        this.breakSatu = JSON.parse(this.data.row.detail[0].break_satu);
        this.breakDua = JSON.parse(this.data.row.detail[0].break_dua);
        this.breakTiga = JSON.parse(this.data.row.detail[0].break_tiga);
        this.data.row.detail.forEach(element => {
          this.listShift.push({
            jam: element.jamKerja / 60,
            hari: this.daftarHari.find((item) => item.id == +element.noHari),
            jamKerja: element.jamKerja,
            kerjaSatu: element.jamKerjaSatu,
            kerjaDua: element.jamKerjaDua,
            kerjaTiga: element.jamKerjaTiga,
            break: +element.break ? true : false,
            satuMasuk: element.satu_masuk,
            duaMasuk: element.dua_masuk,
            tigaMasuk: element.tiga_masuk,
            breakSatu: JSON.parse(element.break_satu), breakDua: JSON.parse(element.break_dua), breakTiga: JSON.parse(element.break_tiga),
            bolehMasuk: +element.boleh_masuk, toleransi: +element.toleransi, noHari: +element.noHari
          })
        });
      }
      this.crateJadwal = this._formBuilder.group({
        stsabsen: [this.data.row.stsabsen, [Validators.required]],
        keteranganJadwal: [this.data.row.keterangan, [Validators.required]],
        break: [this.data.row.break, [Validators.required]],
        jamKerja: [+this.data.row.jamKerja],
        kerjaSatu: [+this.data.row.kerjaSatu],
        kerjaDua: [+this.data.row.kerjaDua],
        kerjaTiga: [+this.data.row.kerjaTiga],
        regular: [],
        shift: [],
        bolehMasuk: [this.data.row.bolehMasuk, [Validators.required]],
        toleransi: [this.data.row.toleransi, [Validators.required]],
        istirahat: this.data.row.istirahat,
        masuk: this.data.row.detail[0].masuk,
        satuMasuk: this.data.row.stsabsen === 'shift' ? this.data.row.detail[0].satu_masuk : '',
        duaMasuk: this.data.row.stsabsen === 'shift' ? this.data.row.detail[0].dua_masuk : '',
        tigaMasuk: this.data.row.stsabsen === 'shift' ? this.data.row.detail[0].tiga_masuk : '',

      });
    } else {
      this.crateJadwal = this._formBuilder.group({
        stsabsen: ['reg', [Validators.required]],
        keteranganJadwal: ['', Validators.required],
        jamKerja: [0],
        kerjaSatu: [0],
        kerjaDua: [0],
        kerjaTiga: [0],
        break: [false, Validators.required],
        regular: this.listReguler,
        shift: this.listShift,
        bolehMasuk: [0, Validators.required],
        toleransi: [0, Validators.required],
        istirahatKeluar: [],
        istirahatMasuk: [],
        istirahat: [],
        masuk: [],
        pulang: [],
        satuMasuk: [],
        satuPulang: [],
        duaMasuk: [],
        duaPulang: [],
        tigaMasuk: [],
        tigaPulang: []
      });
    }

  }
  resetList() {
    this.listReguler = [];
    this.listShift = [];
  }
  onChangeBundle(event: MatSlideToggleChange) {
    this.bundle = event.checked ? 'Ya' : 'Tidak';
  }
  onUpdate() {

    if (this.crateJadwal.value.stsabsen === 'reg') {
      if (this.crateJadwal.value.jamKerja === 0) {
        alert('Jam kerja tidak boleh kosong')
        return
      }
      if (this.listReguler.length === 0) {
        alert('Jadwal jumlah hari kerja belum di pilih');
        return
      }
    }
    if (this.crateJadwal.value.stsabsen === 'shift') {
      if (this.crateJadwal.value.jamKerjaSatu === 0) {
        alert('Jam kerja shift satu tidak boleh kosong');
        return
      }
      if (this.crateJadwal.value.jamKerjaDua === 0) {
        alert('Jam kerja shift dua tidak boleh kosong');
        return
      }
      if (this.crateJadwal.value.jamKerjaTiga === 0) {
        alert('Jam kerja shift tiga tidak boleh kosong');
        return
      }
      if (this.listShift.length === 0) {
        alert('Jadwal jumlah hari kerja belum di pilih');
        return
      }
    }
    this.crateJadwal.disable()
    if (this.data.row !== undefined) {
      this.api
        .rubahJadwal({
          id: this.data.row.id,
          stsabsen: this.crateJadwal.value.stsabsen,
          keteranganJadwal: this.crateJadwal.value.keteranganJadwal,
          jamKerja: +this.crateJadwal.value.jamKerja,
          kerjaSatu: +this.crateJadwal.value.kerjaSatu,
          kerjaDua: +this.crateJadwal.value.kerjaDua,
          kerjaTiga: +this.crateJadwal.value.kerjaTiga,
          bolehMasuk: this.crateJadwal.value.bolehMasuk,
          toleransi: this.crateJadwal.value.toleransi,
          jlhHari: this.selectedJumlah,
          break: this.crateJadwal.value.break,
          regular: this.listReguler,
          shift: this.listShift,
        })
        .subscribe(
          (result) => {
            this.crateJadwal.enable();
            this.createJadwalForm.resetForm();
            this.load = 'load';
            this.dialogRef.close(this.load);
          },
          (response) => {
            this.crateJadwal.enable();
          }
        );
    } else {
      this.api
        .saveJadwal({
          stsabsen: this.crateJadwal.value.stsabsen,
          keteranganJadwal: this.crateJadwal.value.keteranganJadwal,
          jlhHari: this.selectedJumlah,
          jamKerja: +this.crateJadwal.value.jamKerja,
          kerjaSatu: +this.crateJadwal.value.kerjaSatu,
          kerjaDua: +this.crateJadwal.value.kerjaDua,
          kerjaTiga: +this.crateJadwal.value.kerjaTiga,
          bolehMasuk: this.crateJadwal.value.bolehMasuk,
          toleransi: this.crateJadwal.value.toleransi,
          break: this.crateJadwal.value.break,
          regular: this.listReguler,
          shift: this.listShift,
        })
        .subscribe(
          (result) => {
            this.crateJadwal.enable();
            this.createJadwalForm.resetForm();
            this.load = 'load';
            this.dialogRef.close(this.load);
          },
          (response) => {
            this.crateJadwal.enable();
          }
        );
    }


  }
  buatJadwalHari(item) {
    this.selectedJumlah = item.value;
    this.listReguler = [];
    this.listShift = [];
    for (let i = 1; i <= this.selectedJumlah; i++) {
      if (this.crateJadwal.value.stsabsen === 'reg') {
        this.listReguler.push({
          jam: +this.crateJadwal.value.jamKerja,
          jamKerja: +this.crateJadwal.value.jamKerja,
          hari: this.daftarHari.find((item) => item.id == i),
          break: this.bundle.toLowerCase() === 'ya' ? true : false, masuk: this.crateJadwal.value.masuk, breakReg: this.crateJadwal.value.break ? this.breakReg : [],
          bolehMasuk: this.crateJadwal.value.bolehMasuk, toleransi: this.crateJadwal.value.toleransi, noHari: i.toString()
        })
      } else {
        this.listShift.push({
          jam: +this.crateJadwal.value.jamKerja,
          hari: this.daftarHari.find((item) => item.id == i),
          jamKerja: +this.crateJadwal.value.jamKerja,
          kerjaSatu: +this.crateJadwal.value.kerjaSatu,
          kerjaDua: +this.crateJadwal.value.kerjaDua,
          kerjaTiga: +this.crateJadwal.value.kerjaTiga,
          break: this.bundle.toLowerCase() === 'ya' ? true : false,
          satuMasuk: this.crateJadwal.value.satuMasuk,
          duaMasuk: this.crateJadwal.value.duaMasuk,
          tigaMasuk: this.crateJadwal.value.tigaMasuk,
          breakSatu: this.breakSatu, breakDua: this.breakDua, breakTiga: this.breakTiga,
          bolehMasuk: this.crateJadwal.value.bolehMasuk, toleransi: this.crateJadwal.value.toleransi, noHari: i.toString()
        })
      }
    }
  }
  onDelete() {
    this.api
      .deleteJadwal(this.data.row.id,)
      .subscribe(
        (result) => {
          this.crateJadwal.enable();
          this.createJadwalForm.resetForm();
          this.load = 'load';
          this.dialogRef.close(this.load);
        },
        (response) => {
          this.crateJadwal.enable();
        }
      );
  }
  remove(data: breakModel, shift?: number): void {
    if (shift === 1) {
      const index = this.breakSatu.indexOf(data);

      if (index >= 0) {
        this.breakSatu.splice(index, 1);
      }
    } else if (shift === 2) {
      const index = this.breakDua.indexOf(data);

      if (index >= 0) {
        this.breakDua.splice(index, 1);
      }
    } else if (shift === 3) {
      const index = this.breakTiga.indexOf(data);

      if (index >= 0) {
        this.breakTiga.splice(index, 1);
      }
    } else {
      const index = this.breakReg.indexOf(data);

      if (index >= 0) {
        this.breakReg.splice(index, 1);
      }
    }

  }


  addWaktu(shift?: number) {
    const dialogRef = this._MatDialog.open(AddWaktu, {
      panelClass: 'dialog',
      width: '50%',
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      const value = result.dari + '-' + result.sampai;
      if (shift === 1) {
        if ((value || '')) {
          this.breakSatu.push({ value });
        }
      } else if (shift === 2) {
        if ((value || '')) {
          this.breakDua.push({ value });
        }
      } else if (shift === 3) {
        if ((value || '')) {
          this.breakTiga.push({ value });
        }

      } else {
        if ((value || '')) {
          this.breakReg.push({ value });
        }
      }
    });
  }

  editDay(item, status, index) {
    const dialogRef = this._MatDialog.open(Editorday, {
      panelClass: 'dialog',
      width: '50%',
      hasBackdrop: true,
      data: { item: item, stsabsen: status }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (status === 'reg') {
        this.listReguler[index] = result.item;
      } else {
        this.listShift[index] = result.item;
      }
    });
  }
}

@Component({
  selector: 'app-addwaktu',
  templateUrl: './addwaktu.component.html',
  styleUrls: ['./create.component.scss']
})
export class AddWaktu implements OnInit {
  tambahWaktu: any = [];
  constructor(public dialogRef: MatDialogRef<AddWaktu>) {

  }
  ngOnInit() {

  }
  onSave() {
    this.dialogRef.close(this.tambahWaktu);
  }
}


@Component({
  selector: 'app-editdays',
  templateUrl: './editorday.component.html',
  styleUrls: ['./create.component.scss']
})
export class Editorday implements OnInit {
  Jadwal: any = [];
  JamKerja: number;
  selectable = true;
  removable = true;
  constructor(public dialogRef: MatDialogRef<Editorday>, @Inject(MAT_DIALOG_DATA) public data: any, public _MatDialog: MatDialog,) {

  }
  ngOnInit() {
    this.Jadwal = this.data;
    this.JamKerja = this.Jadwal.item.jamKerja;

  }

  resetList() {
    this.Jadwal.item.jamKerja = this.JamKerja * 60;
    this.Jadwal.item.jam = this.JamKerja;
  }

  onSave() {
    this.dialogRef.close(this.Jadwal);
  }


  remove(data: breakModel, shift?: number): void {
    if (shift === 1) {
      const index = this.Jadwal.item.breakSatu.indexOf(data);

      if (index >= 0) {
        this.Jadwal.item.breakSatu.splice(index, 1);
      }
    } else if (shift === 2) {
      const index = this.Jadwal.item.breakDua.indexOf(data);

      if (index >= 0) {
        this.Jadwal.item.breakDua.splice(index, 1);
      }
    } else if (shift === 3) {
      const index = this.Jadwal.item.breakTiga.indexOf(data);

      if (index >= 0) {
        this.Jadwal.item.breakTiga.splice(index, 1);
      }
    } else {
      const index = this.Jadwal.item.breakReg.indexOf(data);

      if (index >= 0) {
        this.Jadwal.item.breakReg.splice(index, 1);
      }
    }

  }

  addWaktu(shift?: number) {
    const dialogRef = this._MatDialog.open(AddWaktu, {
      panelClass: 'dialog',
      width: '50%',
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      const value = result.dari + '-' + result.sampai;
      if (shift === 1) {
        if ((value || '')) {
          this.Jadwal.item.breakSatu.push({ value });
        }
      } else if (shift === 2) {
        if ((value || '')) {
          this.Jadwal.item.breakDua.push({ value });
        }
      } else if (shift === 3) {
        if ((value || '')) {
          this.Jadwal.item.breakTiga.push({ value });
        }

      } else {
        if ((value || '')) {
          this.Jadwal.item.breakReg.push({ value });
        }
      }
    });
  }
}

export interface JadwalModel {
  id?: string;
  stsabsen: string,
  keteranganJadwal: string,
  jlhHari?: number,
  break: boolean,
  regular?: any,
  shift?: any,
  jamKerja?: number,
  kerjaSatu?: number,
  kerjaDua?: number,
  kerjaTiga?: number,
  bolehMasuk?: any,
  toleransi?: any,
  istirahat?: any,
  istirahatSatu?: any,
  istirahatDua?: any,
  istirahatTiga?: any,
  masuk?: string,
  pulang?: string,
  satuMasuk?: string,
  satuPulang?: string,
  duaMasuk?: string,
  duaPulang?: string,
  tigaMasuk?: string,
  tigaPulang?: string,
}

export interface breakModel {
  masuk?: String,
  keluar?: String,
}