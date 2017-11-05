import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { PrenotazioniComponent } from './components/prenotazioni/prenotazioni.component';
import { UtentiComponent } from './components/prenotazioni/utenti.component';
import { CalcioComponent } from './components/prenotazioni/calcio.component';


@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        PrenotazioniComponent,
        UtentiComponent,
		CalcioComponent,
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'prenotazioni', component: PrenotazioniComponent },
            { path: 'utenti', component: UtentiComponent },
			{ path: 'calcio', component: CalcioComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ]
})
export class AppModuleShared {
}
