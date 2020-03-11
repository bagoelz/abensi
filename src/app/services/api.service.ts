import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  BaseURL = environment.BaseUrl;
  constructor(
    private http: HttpClient
  ) { }

  // getPengguna(auth) {}
  getPengguna(auth) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': auth,
      'Accept-Language': ['en-US', 'en', 'q=0.9'],
      'Accept': ['application/json', 'text/plain', '*/*']
    });
    let pilih = {
      headers: headers
    };

    // return this.http.get(this.BaseURL + 'pengguna/getUser', pilih).pipe(map(response => {
    //   return response;
    //

    return this.http.get(this.BaseURL + 'pengguna/getUser',pilih).pipe(map(response => {
      return response;
    }));
  }

  getPengguna2() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': ['en-US', 'en', 'q=0.9'],
      'Accept': ['application/json', 'text/plain', '*/*']
    });
    let pilih = {
      headers: headers
    };

    // return this.http.get(this.BaseURL + 'pengguna/getUser', pilih).pipe(map(response => {
    //   return response;
    //

    return this.http.get(this.BaseURL + 'pengguna2/completeUser',pilih).pipe(map(response => {
      return response;
    }));
  }

  getCabang(auth) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': auth,
      'Accept-Language': ['en-US', 'en', 'q=0.9'],
      'Accept': ['application/json', 'text/plain', '*/*']
    });
    let pilih = {
      headers: headers
    };

    return this.http.get(this.BaseURL + 'Pengguna/cabang',pilih).pipe(map(response => {
      return response;
    }));
  }

  getAUTH(user, password) {
    const formData: FormData = new FormData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {
      headers: headers
    };
    formData.append('Userlogin', user);
    formData.append('Password', password);

    return this.http.post(this.BaseURL + 'Pengguna/AuthAdmin/', formData)
      .pipe(map(response => {
        return response;
      }));
  }


  addUser(auth:any,username: string, password: string, hp:string,nama_lengkap: string, nip: string, jabatan: string, gender: string, capdis: string, level: string, profilPic: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': auth,
      'Accept-Language': ['en-US', 'en', 'q=0.9'],
      'Accept': ['application/json', 'text/plain', '*/*']
    });
    let pilih = {
      headers: headers
    };

    const formData: FormData = new FormData();
    formData.append('p_username', username);
    formData.append('p_password', password);
    formData.append('p_nip', nip);
    formData.append('p_fullname', nama_lengkap);
    formData.append('p_jabatan', jabatan);
    formData.append('p_gender', gender);
    formData.append('p_hp', hp);
    formData.append('p_capdis', capdis);
    formData.append('p_level', level);
    formData.append('p_attachment', profilPic, profilPic.name !== undefined ? profilPic.name : null);

    // return this.http.post(this.BaseURL + 'pengguna2/tambahpengguna/',formData,pilih)
    //   .pipe(map(response => {
    //     return response;
    //   }));
    return this.http.post(this.BaseURL + 'pengguna2/tambahpengguna/',formData)
      .pipe(map(response => {
        return response;
      }));
  }


  addUser2(auth:any,username: string, password: string, nama_lengkap: string, nip: string, jabatan: string, gender: string, capdis: string, level: string): Observable<any> {
    const formData: FormData = new FormData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': auth,
      'Accept-Language': ['en-US', 'en', 'q=0.9'],
      'Accept': ['application/json', 'text/plain', '*/*']
    });
    let pilih = {
      headers: headers
    };


    formData.append('p_username', username);
    formData.append('p_password', password);
    formData.append('p_nip', nip);
    formData.append('p_fullname', nama_lengkap);
    formData.append('p_jabatan', jabatan);
    formData.append('p_gender', gender);
    // formData.append('p_hp', hp);
    formData.append('p_capdis', capdis);
    formData.append('p_level', level);

    return this.http.post(this.BaseURL + 'pengguna/tambahpengguna2/', formData,pilih)
      .pipe(map(response => {
        return response;
      }));
  }

  updateUser(auth:any,uid: string,hp:string, username: string, nama_lengkap: string, nip: string, jabatan: string, gender: string, capdis: string, level: string): Observable<any> {
    const formData: FormData = new FormData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': auth,
      'Accept-Language': ['en-US', 'en', 'q=0.9'],
      'Accept': ['application/json', 'text/plain', '*/*']
    });
    let pilih = {
      headers: headers
    };


    formData.append('p_uid', uid);
    formData.append('p_username', username);
    formData.append('p_nip', nip);
    formData.append('p_fullname', nama_lengkap);
    formData.append('p_jabatan', jabatan);
    formData.append('p_gender', gender);
    formData.append('p_hp', hp);
    formData.append('p_capdis', capdis);
    formData.append('p_level', level);

    // return this.http.post(this.BaseURL + 'pengguna2/updatepengguna/', formData,pilih)
    //   .pipe(map(response => {
    //     return response;
    //   }));
    return this.http.post(this.BaseURL + 'pengguna2/updatepenggunaa/', formData,)
      .pipe(map(response => {
        return response;
      }));
  }

  updateUser2(uid: string,profil:string,hp:string,username: string, nama_lengkap: string, nip: string, jabatan: string, gender: string, capdis: string, level: string, profilPic: any): Observable<any> {
    const formData: FormData = new FormData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {
      headers: headers
    };

    formData.append('p_uid', uid);
    formData.append('p_username', username);
    formData.append('p_nip', nip);
    formData.append('p_fullname', nama_lengkap);
    formData.append('p_jabatan', jabatan);
    formData.append('p_gender', gender);
    formData.append('p_hp', hp);
    formData.append('p_profile', profil);
    formData.append('p_capdis', capdis);
    formData.append('p_level', level);
    formData.append('p_attachment', profilPic, profilPic.name !== undefined ? profilPic.name : null);

    return this.http.post(this.BaseURL + 'pengguna2/updatepenggunaa/', formData)
      .pipe(map(response => {
        return response;
      }));
  }

  deleteUser(auth:any,uid: string,profil:string,level: string): Observable<any> {
    const formData: FormData = new FormData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {
      headers: headers
    };

    formData.append('p_uid', uid);
    formData.append('p_profile', profil);
    formData.append('p_level', level);

    return this.http.post(this.BaseURL + 'pengguna2/hapuspengguna/', formData)
      .pipe(map(response => {
        return response;
      }));
  }

  updatepass(uid: string, pass: string, level: string): Observable<any> {
    const formData: FormData = new FormData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {
      headers: headers
    };

    formData.append('p_uid', uid);
    formData.append('p_pass', pass);
    formData.append('p_level', level);

    return this.http.post(this.BaseURL + 'pengguna2/updatepassword/', formData)
      .pipe(map(response => {
        return response;
      }));
  }

  getPotongan() {
    return this.http.get(this.BaseURL + 'potongan').pipe(map(response => {
      return response;
    }));
  }

  getTunjangan(auth) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': auth,
      'Accept-Language': ['en-US', 'en', 'q=0.9'],
      'Accept': ['application/json', 'text/plain', '*/*']
    });
    let pilih = {
      headers: headers
    };
    return this.http.get(this.BaseURL + 'ttp/index',pilih).pipe(map(response => {
      return response;
    }));
  }

  getTunjangan2(auth) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': auth,
      'Accept-Language': ['en-US', 'en', 'q=0.9'],
      'Accept': ['application/json', 'text/plain', '*/*']
    });
    let pilih = {
      headers: headers
    };
    return this.http.get(this.BaseURL + 'ttp/index2',pilih).pipe(map(response => {
      return response;
    }));
  }


  approve(auth:string,uid: string, status: string): Observable<any> {

    const formData: FormData = new FormData();

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': auth,
      'Accept-Language': ['en-US', 'en', 'q=0.9'],
      'Accept': ['application/json', 'text/plain', '*/*']
    });
    let pilih = {
      headers: headers
    };

    formData.append('p_userid', uid);
    // return this.http.post(this.BaseURL + 'pengguna2/validasi/', formData,pilih)
    //   .pipe(map(response => {
    //     return response;
    //   }));
    return this.http.post(this.BaseURL + 'pengguna2/validasi/', formData,)
    .pipe(map(response => {
      return response;
    }));
  }

  ReportTTP(auth) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': auth,
      'Accept-Language': ['en-US', 'en', 'q=0.9'],
      'Accept': ['application/json', 'text/plain', '*/*']
    });
    let pilih = {
      headers: headers
    };
    return this.http.get(this.BaseURL + 'ttp/ttpreport',pilih).pipe(map(response => {
      return response;
    }));
  }

  getAbsensiMasuk(auth) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': auth,
      'Accept-Language': ['en-US', 'en', 'q=0.9'],
      'Accept': ['application/json', 'text/plain', '*/*']
    });
    let pilih = {
      headers: headers
    };

    return this.http.get(this.BaseURL + 'absensi/absenMasuk',pilih).pipe(map(response => {
      return response;
    }));
  }
auth
  getAbsensiKeluar() {
    // let headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': auth,
    //   'Accept-Language': ['en-US', 'en', 'q=0.9'],
    //   'Accept': ['application/json', 'text/plain', '*/*']
    // });
    // let pilih = {
    //   headers: headers
    // };
    return this.http.get(this.BaseURL + 'absensi/absenkeluar',).pipe(map(response => {
      return response;
    }));
  }

  getCapdis(auth) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': auth,
      'Accept-Language': ['en-US', 'en', 'q=0.9'],
      'Accept': ['application/json', 'text/plain', '*/*']
    });
    let pilih = {
      headers: headers
    };

    return this.http.get(this.BaseURL + 'capdis/ambilCapdis',pilih).pipe(map(response => {
      return response;
    }));
  }

  getAdmin(auth) {
    let pilih = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': auth,
      })
    };
    return this.http.get(this.BaseURL + 'pengguna/getAdmin', pilih).pipe(map(response => {
      return response;
    }));

    // return this.http.get(this.BaseURL + 'pengguna/getAdmin').pipe(map(response => {
    //   return response;
    // }));
  }


  addCapdis(Nama: string, lat: any, lng: any): Observable<any> {
    const formData: FormData = new FormData();
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'key=AAAA6qpRJ74:APA91bENhg9E3f5ltTgzVZS9hQNyN2_X7J6bOyFVLulwmjJtiNpBwGeVq3tXsWmQ_X8ffcl6OG5K0dLqhf8wJGGWHqMGnix1oSqBl9GD5y1sVyUBW8eakj7u86JHuBSOZzQZkpttCCV9'
      })
    };

    formData.append('p_nama', Nama);
    formData.append('p_lat', lat);
    formData.append('p_lng', lng);

    return this.http.post(this.BaseURL + 'Capdis/tambahcapdis/', formData, options)
      .pipe(map(response => {
        return response;
      }));
  }

  getCalender() {
    return this.http.get(this.BaseURL + 'kalender/getCalender/').pipe(map(response => {
      return response;
    }));
  }

  // title: "adsfsaf"
  // start: Thu Feb 06 2020 00:00:00 GMT+0700 (Waktu Indonesia Barat) {}
  // end: Thu Feb 06 2020 00:00:00 GMT+0700 (Waktu Indonesia Barat) {}
  // allDay: true
  // meta:
  // notes: 

  addCalender(start: any, end: any, title: string, allDay: string, notes: string, freeday: any): Observable<any> {
    const formData: FormData = new FormData();

    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    formData.append('p_start', start);
    formData.append('p_end', end);
    formData.append('p_title', title);
    // formData.append('p_primary', c_primary);
    // formData.append('p_secondary', c_secondary);
    formData.append('p_notifikasi', allDay);
    // formData.append('p_location', location);
    formData.append('p_notes', notes);
    formData.append('p_libur', freeday);

    return this.http.post(this.BaseURL + 'kalender/addCalender/', formData)
      .pipe(map(response => {
        return response;
      }));
  }

  UpdateCalender(id: string, start: any, end: any, title: string, allDay: string, notes: string, freeday: any): Observable<any> {
    const formData: FormData = new FormData();

    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    formData.append('p_id', id);
    formData.append('p_start', start);
    formData.append('p_end', end);
    formData.append('p_title', title);
    formData.append('p_notifikasi', allDay);
    // formData.append('p_secondary', c_secondary);
    // formData.append('p_location', location);
    formData.append('p_notes', notes);
    formData.append('p_libur', freeday);

    return this.http.post(this.BaseURL + 'kalender/updateCalender/', formData)
      .pipe(map(response => {
        return response;
      }));
  }

  DeleteCalender(id) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let options = {
      headers: headers
    };
    return this.http.delete(this.BaseURL + 'kalender/hapus/' + id).pipe(
      map(response => {
        return response;
      })
    );
  }

  detailAbsensi(id) {
    return this.http.get(this.BaseURL + 'absensi/detailabsensi/' + id).pipe(map(response => {
      return response;
    }));
  }

  BatalAbsensi(auth:any,pkp:any,uid: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': auth,
    });
    let pilih = {
      headers: headers
    };
    const formData: FormData = new FormData();
    formData.append('p_uid', uid);
    formData.append('p_pkp', pkp);

    return this.http.post(this.BaseURL + 'pengguna2/batalabsensi/', formData,)
      .pipe(map(response => {
        return response;
      }));
  }

  UpdateStatus(id_absensi: string, status: string, tanggal: any): Observable<any> {
    const formData: FormData = new FormData();
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    formData.append('p_idabsensi', id_absensi);
    formData.append('p_status', status);
    formData.append('p_tanggal', tanggal);

    return this.http.post(this.BaseURL + 'pengguna2/updatestatus/', formData)
      .pipe(map(response => {
        return response;
      }));
  }

  getCuti() {
    return this.http.get(this.BaseURL + 'pengguna2/getcuti/').pipe(map(response => {
      return response;
    }));
  }


  addCuti(uid: string, mulai: any, akhir: any, ket: string, file: any, capdis:string): Observable<any> {
    const formData: FormData = new FormData();
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    formData.append('p_uid', uid);
    formData.append('p_mulai', mulai);
    formData.append('p_akhir', akhir);
    formData.append('p_ket', ket);
    formData.append('p_capdis', capdis);
    formData.append('p_file', file !== null ? file : '');


    return this.http.post(this.BaseURL + 'pengguna2/tambahcuti/', formData)
      .pipe(map(response => {
        return response;
      }));
  }

  getJadwal(auth) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': auth,
      'Accept-Language': ['en-US', 'en', 'q=0.9'],
      'Accept': ['application/json', 'text/plain', '*/*']
    });
    let pilih = {
      headers: headers
    };
    return this.http.get(this.BaseURL + 'absensi/jadwal/',pilih).pipe(map(response => {
      return response;
    }));
  }

  updateJadwal(auth:any,id: string, masuk: any, pulang: any): Observable<any> {
    const formData: FormData = new FormData();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': auth,
      'Accept-Language': ['en-US', 'en', 'q=0.9'],
      'Accept': ['application/json', 'text/plain', '*/*']
    });
    let pilih = {
      headers: headers
    };

    formData.append('p_id', id);
    formData.append('p_masuk', masuk);
    formData.append('p_pulang', pulang);

    // return this.http.post(this.BaseURL + 'absensi/updatejadwal/', formData,pilih)
    //   .pipe(map(response => {
    //     return response;
    //   }));
    return this.http.post(this.BaseURL + 'pengguna2/updatejadwal/', formData,)
      .pipe(map(response => {
        return response;
      }));
  }
} 
