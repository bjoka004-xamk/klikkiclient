import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class KlikkihallintaService {

  pistesaldo : number;
  kuvatiedosto : string = "assets/clickbutton.png";
  seuraava : string;

  constructor(protected dialogiCtrl : AlertController, protected storage: Storage, protected http : HttpClient, protected toastCtrl : ToastController) { 

    storage.get('pisteet').then((val) => {

      if(val) {

        this.pistesaldo = val;

      } else {

        this.pistesaldo = 20;
        storage.set("pisteet", 20);

      }

      this.klikkaa();

    });


  }

  klikkaa = () : void => {

    if(this.pistesaldo > 0) {

      this.haeVoitto();

    } else {

      this.avaaModaali();

    }

  }

  avaaModaali = async () : Promise<any> => {

    const ikkuna = await this.dialogiCtrl.create({
                                            header : "Uusi alku",
                                            message : "Pisteesi loppuivat. Haluatko aloittaa uuden pelin?",
                                            buttons : [ 
                                                        {
                                                          text : "Kyllä",
                                                          handler : () => {
                                                                            this.pistesaldo = 20;
                                                                            this.storage.set("pisteet", this.pistesaldo);
                                                                          }
                                                        },
                                                        {
                                                          text : "Ei",
                                                          role : "cancel",
                                                          cssClass : "secondary",
                                                          handler : () => { }
                                                        }
                                                      ]
                                          });

    await ikkuna.present();

  }

  ilmoitaVoitosta = async (voittosumma) => {

      const toast = await this.toastCtrl.create({

        message: `<center>Voitit ${voittosumma} pistettä!</center>`, 
        duration: 2000

      });

      toast.present();

  }

  haeVoitto = async () : Promise<any> => {

    await this.http.get(`https://klikkiservu-1908593.herokuapp.com/app/osallistu`).subscribe((data : any) => {

      if(data.voitto && this.pistesaldo > 0) {

        this.pistesaldo += data.voitto - 1;
        this.storage.set("pisteet", this.pistesaldo);
        this.ilmoitaVoitosta(data.voitto);
        this.seuraava = `Seuraava voitto ${data.seuraava} klikkauksen päässä!`;

      } else {

        if(this.pistesaldo > 0) {

          this.pistesaldo += data.voitto - 1;
          this.storage.set("pisteet", this.pistesaldo);
          this.seuraava = `Seuraava voitto ${data.seuraava} klikkauksen päässä!`;

        }

      }
    });
    
  }

}
