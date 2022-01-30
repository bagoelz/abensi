import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ConfirmDialogComponent implements OnInit {
  hapus: any = 'Apakah anda yakin ingin menghapus data?';

  pesan: any;
  tombol: any;

  tmp: string;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    console.log(this.data);
    if (this.data[0] === 'simpan') {
      this.pesan = 'Apakah anda ingin menyimpan data?';
      this.tombol = 'Simpan';
    } else if (this.data[0] === 'approve') {
      this.pesan = 'Apakah anda ingin mengkonfirmasi pengguna ini?';
      this.tombol = 'Approve';
    }
    else if (this.data[0] === 'ubah') {
      this.pesan = 'Apakah anda yakin menyimpan perubahan?';
      this.tombol = 'Ubah';
    } else if (this.data[0] === 'hapus') {
      this.pesan = 'Apakah anda yakin ingin menghapus data?';
      this.tombol = 'Hapus';
    }
  }

  onConfirm(): void {
    // this.dialogRef.close(true);
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

}

export const COMPONENT_LIST = [
  ConfirmDialogComponent
];
