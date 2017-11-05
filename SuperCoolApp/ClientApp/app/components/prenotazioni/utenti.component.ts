import { Component, Inject } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';

@Component({
    selector: 'utenti',
    templateUrl: './utenti.component.html',
    styleUrls: ['./utenti.component.css']
})
export class UtentiComponent {
    public utenti: Utente[];
    public selectedUtente: Utente | undefined;

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string) {
        this.refreshData();
    }

    async refreshData() {
        this.http.get(this.baseUrl + 'api/utenti').subscribe(result => {
            let utenteList = [];

            for (let uten of result.json() as Utente[])
            {
                let utente = new Utente();
                utente.id = uten.id;
                utente.email = uten.email;
                utente.name = uten.name;
                utente.surname = uten.surname;
               utente.password = uten.password;
                utente.hasChanges = false;
                utenteList.push(utente);
            }

            console.log("ok");

            this.utenti = utenteList;

            this.selectUtente();
        }, error => console.error(error));
    }


    selectUtente(): void {

        this.selectedUtente = undefined;

        for (let uten of this.utenti) {
            if (uten.deleted == false) {
                this.selectedUtente = uten;
                break;
            }

        }
    }


    async putData(): Promise<void> {
        let headers = new Headers({ 'Content-Type': 'application/json' });

        let serverCalls = [];

        for (let utente of this.utenti) {
            if (utente.hasChanges == true || utente.deleted) {

                let json = JSON.stringify(utente.toJSON());

                if (!utente.id) { //create
                    if (!utente.deleted) {
                        let call = this.http.put(this.baseUrl + 'api/utenti', json, { headers: headers });
                        serverCalls.push(call);
                    }
                }
                else {
                    if (utente.deleted) {
                        let url = this.baseUrl + 'api/utenti?id=' + utente.id;
                        let call = this.http.delete(url, { headers: headers });
                        serverCalls.push(call);
                    }
                    else {
                        let call = this.http.post(this.baseUrl + 'api/utenti', json, { headers: headers });
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

    onSelect(utente: Utente): void {

        if (utente.deleted == false) {
            this.selectedUtente = utente;
        }
    }

    addNewUtente(): void {
        this.selectedUtente = new Utente();
        this.selectedUtente.hasChanges = true;
        this.utenti.push(this.selectedUtente);
    }

    async saveChanges(): Promise<void> {
        await this.putData();
        console.log("update completed");
        await this.refreshData();
    }

    delete(utente: Utente): void {
        utente.deleted = true;
        this.selectUtente();
    }
}

class Utente {
    id: number;

    private _email: string = "";
    private _name: string = "";
    private _surname: string = "";
	private _password: string = "";
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

    get name(): string {
        return this._name;
    }
    set name(n: string) {
        this._name = n;
        this.hasChanges = true;
        console.log("set name");
    }

    get surname(): string {
        return this._surname;
    }
    set surname(n: string) {
        this._surname = n;
        this.hasChanges = true;
        console.log("set surname");
    }
	 get password(): string {
        return this._password;
    }
    set password(n: string) {
        this._password = n;
        this.hasChanges = true;
        console.log("set password");
    }

    public toJSON() {
        return {
            id: this.id,
            email: this._email,
            name: this._name,
            surname: this._surname,
			password: this._password,
           
        };
    };
}
