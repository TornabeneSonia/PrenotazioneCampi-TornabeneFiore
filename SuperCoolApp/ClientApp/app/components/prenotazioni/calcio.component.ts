import { Component, Inject } from '@angular/core';
import { Http } from '@angular/http';

@Component({
    selector: 'calcio',
    templateUrl: './calcio.component.html'
})
export class CalcioComponent {
    public calcio: Calcio[];

    constructor(http: Http, @Inject('BASE_URL') baseUrl: string) {
        http.get(baseUrl + 'api/calcio').subscribe(result => {
            this.calcio = result.json() as Calcio[];
        }, error => console.error(error));
    }
}

interface Calcio {
    email: string;
    time: string;
    date: string;
}
