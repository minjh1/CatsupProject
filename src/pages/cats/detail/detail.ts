import { Component } from '@angular/core';
import { NavParams, ModalController } from 'ionic-angular'
import { Cat } from '../../../models/cat';
import { MapPage } from '../../map/map';
import { Http, Headers } from '@angular/http';
import { UserData } from '../../../providers/user-data'
import 'rxjs/add/operator/map';

@Component({
  templateUrl: 'detail.html',
})

export class CatProfilePage {
  cat: Cat;
  serverURL : string;
  constructor(public navParams: NavParams,
    public modalCtrl: ModalController,
    private http: Http,
    public userData: UserData,
  ) {
    this.serverURL = this.userData.serverURL;
      this.cat = this.navParams.get("cat");
  }
  ionViewDidLoad() {
  }
  openMap() {
    let modal = this.modalCtrl.create(MapPage, { pageType: 1, name: this.cat.names[0], lat: this.cat.latitude, lng: this.cat.longitude });
    modal.present();
  }

}
