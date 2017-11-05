import { Component, Inject } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';

@Component({
    selector: 'prenotazioni',
    templateUrl: './prenotazioni.component.html',
    styleUrls: ['./prenotazioni.component.css']
})
export class PrenotazioniComponent {
    public prenotazioni: Prenotazione[];
	public calcio: Prenotazione[];
	public basket: Prenotazione[];
	public tennis: Prenotazione[];

    public selectedPrenotazione: Prenotazione | undefined;

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string) {
        this.refreshData();
    }

    async refreshData() {
        this.http.get(this.baseUrl + 'api/prenotazioni').subscribe(result => {
            let prenotazioneList = [];
			let calcioList = [];
			let basketList = [];
			let tennisList = [];


            for (let pren of result.json() as Prenotazione[])
            {
                let prenotazione = new Prenotazione();
                prenotazione.id = pren.id;
                prenotazione.email = pren.email;
                prenotazione.time = pren.time;
                prenotazione.date = pren.date;
                prenotazione.campo = pren.campo;
                prenotazione.hasChanges = false;

				if(prenotazione.campo == "Calcio"){
				
					calcioList.push(prenotazione);
				
				}else if(prenotazione.campo == "Basket"){
				
					basketList.push(prenotazione);
				
				}else if(prenotazione.campo == "Tennis"){
				
					tennisList.push(prenotazione);
				
				}

                prenotazioneList.push(prenotazione);
            }

            console.log("ok");

            this.prenotazioni = prenotazioneList;
			this.calcio = calcioList;
			this.basket = basketList;
			this.tennis = tennisList;

            this.selectPrenotazione();
        }, error => console.error(error));
    }

	

    selectPrenotazione(): void {

        this.selectedPrenotazione = undefined;

        for (let pren of this.prenotazioni) {
            if (pren.deleted == false) {
                this.selectedPrenotazione = pren;
                break;
            }

        }
    }


    async putData(): Promise<void> {
        let headers = new Headers({ 'Content-Type': 'application/json' });

        let serverCalls = [];

        for (let prenotazione of this.prenotazioni) {
            if (prenotazione.hasChanges == true || prenotazione.deleted) {

                let json = JSON.stringify(prenotazione.toJSON());

                if (!prenotazione.id) { //create
                    if (!prenotazione.deleted) {
                        let call = this.http.put(this.baseUrl + 'api/prenotazioni', json, { headers: headers });
                        serverCalls.push(call);
                    }
                }
                else {
                    if (prenotazione.deleted) {
                        let url = this.baseUrl + 'api/prenotazioni?id=' + prenotazione.id;
                        let call = this.http.delete(url, { headers: headers });
                        serverCalls.push(call);
                    }
                    else {
                        let call = this.http.post(this.baseUrl + 'api/prenotazioni', json, { headers: headers });
                        serverCalls.push(call);
                    }

                }
            }
        }
        Observable.forkJoin(serverCalls)
            .subscribe(data => {
                this.refreshData();
            }, error => console.error(error));


    }

    onSelect(prenotazione: Prenotazione): void {

        if (prenotazione.deleted == false) {
            this.selectedPrenotazione = prenotazione;
        }
    }


	vediCalcio():void{

		
	
	}

    addNewPrenotazione(): void {
        this.selectedPrenotazione = new Prenotazione();
        this.selectedPrenotazione.hasChanges = true;
        this.prenotazioni.push(this.selectedPrenotazione);
    }

    async saveChanges(): Promise<void> {
        await this.putData();
        console.log("update completed");
        await this.refreshData();
    }

    delete(prenotazione: Prenotazione): void {
        prenotazione.deleted = true;
        this.selectPrenotazione();
    }
}






class Prenotazione {
    id: number;

    private _email: string = "";
    private _time: string = "";
    private _date: string = "";
	private _campo: string ="";
    public hasChanges: boolean;
    public deleted: boolean = false;

    get email(): string {
        return this._email;
    }
    set email(n: string) {
        this._email = n;
        this.hasChanges = true;
        console.log("set email");
    }

    get time(): string {
        return this._time;
    }
    set time(n: string) {
        this._time = n;
        this.hasChanges = true;
        console.log("set time");
    }

    get date(): string {
        return this._date;
    }
    set date(n: string) {
        this._date = n;
        this.hasChanges = true;
        console.log("set date");
    }
	get campo(): string {
        return this._campo;
    }
    set campo(n: string) {
        this._campo = n;
        this.hasChanges = true;
        console.log("set campo");
    }

    public toJSON() {
        return {
            id: this.id,
            email: this._email,
            time: this._time,
            date: this._date,
			campo: this._campo,
           
        };
    };
}
