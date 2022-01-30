import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';
import { environment } from '../environments/environment';
import { ApiService } from './services/api.service';
import { FakeDbService } from 'app/fake-db/fake-db.service';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { PenggunaModule } from 'app/main/pengguna/pengguna.module';
import { MasukModule } from './main/absensi/masuk/masuk.module';
import { LoginModule } from 'app/main/login/login.module';
import { PotonganModule } from './main/potongan/potongan.module';
import { TtpModule } from './main/ttp/ttp.module';
import { KeluarModule } from './main/absensi/keluar/keluar.module';
import { SignoutModule } from './main/signout/signout.module';
import { CapdisModule } from './main/capdis/capdis.module';
import { CutiModule } from './main/cuti/cuti.module';
import { ConfirmDialogModule } from './confirm-dialog/confirm-dialog.module';

import { registerLocaleData } from '@angular/common';
import { StorageModule } from '@ngx-pwa/local-storage';
import localeId from '@angular/common/locales/id';
import { from } from 'rxjs';

import { ToastrModule } from 'ngx-toastr';
import { JadwalComponent } from './main/jadwal/jadwal/jadwal.component';
import { JadwalModule } from './main/jadwal/jadwal/jadwal.module';

registerLocaleData(localeId, 'id');

const appRoutes: Routes = [
    {
        path: 'apps',
        loadChildren: './main/apps/apps.module#AppsModule'
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];

@NgModule({
    declarations: [
        AppComponent,
        JadwalComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        ToastrModule.forRoot({
            timeOut: 10000,
            // toast-top-full-width
            //top-Right
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
            closeButton: true,
        }),

        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay: 0,
            passThruUnknownUrl: true
        }),
        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        //StorageModule,
        StorageModule.forRoot({
            IDBNoWrap: true,
        }),
        // App modules
        LayoutModule,
        PenggunaModule,
        MasukModule,
        LoginModule,

        PotonganModule,
        TtpModule,
        KeluarModule,
        SignoutModule,
        CapdisModule,
        CutiModule,
        ConfirmDialogModule,
        JadwalModule,
    ],
    providers: [
        ApiService,
        { provide: LOCALE_ID, useValue: 'id-ID' }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
