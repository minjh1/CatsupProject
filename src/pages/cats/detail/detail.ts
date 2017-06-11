import { Component } from '@angular/core';
import { NavParams,ModalController } from 'ionic-angular'
import { Cat } from '../../../models/cat';
import { MapPage } from '../../map/map';

@Component ({
  templateUrl: 'detail.html',
})

export class CatProfilePage{
  cat: Cat;
  constructor(public navParams: NavParams,
  public modalCtrl: ModalController,) {
    this.cat = this.navParams.get("cat");
  }
  openMap(){
    let modal = this.modalCtrl.create(MapPage, { pageType: 1, name: this.cat.names[0], lat:this.cat.latitude, lng:this.cat.longitude });
    modal.present();
  }

}
