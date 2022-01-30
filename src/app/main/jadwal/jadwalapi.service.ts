import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';
import { JadwalModel } from './jadwal/create/create.component';

@Injectable({
  providedIn: 'root'
})
export class JadwalapiService {
  BaseURL = environment.BaseUrl;
  constructor(
    private http: HttpClient
  ) { }

  saveJadwal(jadwal: JadwalModel) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': JSON.parse(localStorage.getItem('TOKEN')),
      'Accept-Language': ['en-US', 'en', 'q=0.9'],
      'Accept': ['application/json', 'text/plain', '*/*']
    });
    let pilih = {
      headers: headers
    };
    return this.http.post(this.BaseURL + 'pengguna2/addJadwal/', jadwal, pilih)
      .pipe(map(response => {
        return response;
      }));
  }

  deleteJadwal(id) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': JSON.parse(localStorage.getItem('TOKEN')),
      'Accept-Language': ['en-US', 'en', 'q=0.9'],
      'Accept': ['application/json', 'text/plain', '*/*']
    });
    let pilih = {
      headers: headers
    };
    var data = { id: id };
    return this.http.post(this.BaseURL + 'pengguna2/hapusJadwal/', JSON.stringify(data), pilih)
      .pipe(map(response => {
        return response;
      }));
  }

  rubahJadwal(jadwal: JadwalModel) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': JSON.parse(localStorage.getItem('TOKEN')),
      'Accept-Language': ['en-US', 'en', 'q=0.9'],
      'Accept': ['application/json', 'text/plain', '*/*']
    });
    let pilih = {
      headers: headers
    };
    return this.http.post(this.BaseURL + 'pengguna2/updateJadwal/', jadwal, pilih)
      .pipe(map(response => {
        return response;
      }));
  }

  getJadwal() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': JSON.parse(localStorage.getItem('TOKEN')),
      'Accept-Language': ['en-US', 'en', 'q=0.9'],
      'Accept': ['application/json', 'text/plain', '*/*']
    });
    let pilih = {
      headers: headers
    };
    return this.http.get(this.BaseURL + 'pengguna2/showjadwal/', pilih)
      .pipe(map(response => {
        return response;
      }));
  }


  getJadwalGroup() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': JSON.parse(localStorage.getItem('TOKEN')),
      'Accept-Language': ['en-US', 'en', 'q=0.9'],
      'Accept': ['application/json', 'text/plain', '*/*']
    });
    let pilih = {
      headers: headers
    };
    return this.http.get(this.BaseURL + 'pengguna2/showjadwalGroup/', pilih)
      .pipe(map(response => {
        return response;
      }));
  }

}
