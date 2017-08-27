import { Component } from '@angular/core';
import { ViewController,AlertController,NavParams } from 'ionic-angular';
import { Cat } from '../../models/cat';
@Component({
  template: `
    <ion-list style="max-height:300px; font-family:BarunGothic;">
      <ion-list-header>이름 모두보기</ion-list-header>
      <ion-item *ngFor="let name of cat.names; let k=index">{{name}} ({{cat.counts[k]}}명이 선택함)</ion-item>
    </ion-list>
  `
})
export class CatNamesPage {
  cat : Cat;
  constructor(public viewCtrl: ViewController,
  public alertCtrl: AlertController,
public navParams: NavParams) {
  this.cat=navParams.get('cat');
}

}
