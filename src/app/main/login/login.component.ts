import { Component, ViewChild, Inject, OnInit, Renderer2, ElementRef, ChangeDetectionStrategy,Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import {MatPaginator, MatSort, MatTableDataSource, MatProgressSpinnerModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA, throwMatDuplicatedDrawerError} from '@angular/material';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ApiService } from 'app/services/api.service';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
//import undefined = require('firebase/empty-import');

@Component({
    selector   : 'login',
    templateUrl: './login.component.html',
    styleUrls  : ['./login.component.scss'],
    animations : fuseAnimations
})
@Injectable({
    providedIn: 'root'
  })
export class LoginComponent 
{   
    color = 'accent';
    mode = 'indeterminate';
    value = 80;
    spinnerWithoutBackdrop = false;
    islogged;
    pesanerror:any =[];
    //user:Observable<user>;
    
    loginForm: FormGroup;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private API: ApiService,
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit()
    {
        var auth = await localStorage.getItem('AUTH');
        // if(auth !== undefined){
        //     this.router.navigate(['/menu']);
        // }
       // this.isLoggedIn()
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required,]],
            password: ['', Validators.required]
        });
       
        // this.db.list('/pengumuman')
        // .snapshotChanges()
        // .subscribe(items =>{
        // //this.listmenu=[];
        //     items.forEach(item => {
        //         // console.log(item.key);
        //         //console.log(item.payload.val());
        //     // console.log(item.payload.val()['category']);
        //         //this.listmenu.push(GetListMenu(item.payload));
        //     });
        
        // this.closeSpinner();
        // });
    }

    loadSpinner(){
        this.spinnerWithoutBackdrop = true;
        }
        closeSpinner(){
          this.spinnerWithoutBackdrop = false;
        }
       
    isLoggedIn() {
    //    this.islogged = this.afAuth.auth.currentUser;
     }

    login() {
        var user = this.loginForm.controls.email.value;
        var password= this.loginForm.controls.password.value;
        this.loadSpinner();
        this.API.getAUTH(user,password).subscribe((result)=>{
            if(result['data']!==null){
            localStorage.setItem('AUTH',JSON.stringify(result['data']));
            localStorage.setItem('TOKEN',JSON.stringify(result['accessToken']));
            this.closeSpinner();
            setTimeout(() => {
               this.router.navigate(['/absensimasuk'])
                      }, 1000);
            }else{
                this.closeSpinner();
                this.pesanerror = result['message'];
            }
            
        });
    //    this.afAuth.auth.signInWithEmailAndPassword(email,password).then((res)=>{
    //     localStorage.setItem('AUTH',
    //     JSON.stringify({uid: res.user.uid,nama:res.user.displayName, email:res.user.email}));
    //     this.closeSpinner();
    //     setTimeout(() => {
    //         this.router.navigate(['/menu'])
    //       }, 1000);
    //    }).catch((e)=>{
    //        if(e.code==='auth/wrong-password'){
    //             this.pesanerror = 'Password Anda salah';
    //        }else{
    //         this.pesanerror = 'ID User salah / tidak terdaftar';
    //        }
    //    });
      
      }
    
      
}
