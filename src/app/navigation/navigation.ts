import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'applications',
        title: 'Applications',
        translate: 'NAV.APPLICATIONS',
        type: 'group',
        children: [
            {
                id: 'absensi',
                title: 'Absensi',
                translate: 'NAV.ABSENSI.TITLE',
                type: 'item',
                icon: 'folder',
                url: '/absensimasuk'
                // children: [
                //     {
                //         id: 'masuk',
                //         title: 'Masuk',
                //         translate: 'NAV.MASUK.TITLE',
                //         type: 'item',
                //         // icon: 'mail',
                //         url: '/absensimasuk'
                //     },
                //     {
                //         id: 'keluar',
                //         title: 'Keluar',
                //         translate: 'NAV.KELUAR.TITLE',
                //         type: 'item',
                //         // icon: 'mail',
                //         url: '/absensikeluar'
                //     },
                // ]
            },
            {
                id: 'pengguna',
                title: 'Setting',
                translate: 'NAV.PENGGUNA.TITLE',
                type: 'item',
                icon: 'list',
                url: '/pengguna',
                // badge    : {
                //     title    : '25',
                //     translate: 'NAV.DETAIL.BADGE',
                //     bg       : '#F44336',
                //     fg       : '#FFFFFF'
                // }

            },
            // {
            //     id: 'potongan',
            //     title: 'Potongan',
            //     translate: 'NAV.POTONGAN.TITLE',
            //     type: 'item',
            //     icon: 'list',
            //     url: '/potongan',
            //     badge    : {
            //         title    : '25',
            //         translate: 'NAV.DETAIL.BADGE',
            //         bg       : '#F44336',
            //         fg       : '#FFFFFF'
            //     }

            // },

            // {
            //     id: 'ttp',
            //     title: 'TTP',
            //     translate: 'NAV.TTP.TITLE',
            //     type: 'item',
            //     icon: 'list',
            //     url: '/ttp',
            //     // badge    : {
            //     //     title    : '25',
            //     //     translate: 'NAV.DETAIL.BADGE',
            //     //     bg       : '#F44336',
            //     //     fg       : '#FFFFFF'
            //     // }

            // },

            // {
            //     id: 'kalendar',
            //     title: 'Kalendar',
            //     translate: 'NAV.KALENDAR.TITLE',
            //     type: 'collapsable',
            //     icon: 'calendar_today',
            //     children: [
            //         {
            //             id: 'kalender',
            //             title: 'Kalender Kerja',
            //             translate: 'NAV.LIBUR.TITLE',
            //             type: 'item',
            //             url: '/apps/calendar',
            //         },
            //         {
            //             id: 'daftarcuti',
            //             title: 'Daftar Cuti',
            //             translate: 'NAV.DAFTARCUTI.TITLE',
            //             type: 'item',
            //             url: '/cuti',
            //         }
            //     ],
            // }
            {
                id: 'signout',
                title: 'Keluar',
                translate: 'NAV.KELUAR.TITLE',
                type: 'item',
                icon: 'logout',
                url: '/signout',
                // badge    : {
                //     title    : '25',
                //     translate: 'NAV.DETAIL.BADGE',
                //     bg       : '#F44336',
                //     fg       : '#FFFFFF'
                // }

            },

        ]
    }
];
