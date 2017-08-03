import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
@Component({
  template: `
    <ion-list>
      <ion-list-header>CATSUP</ion-list-header>
      <button ion-item (click)="close()">글 신고하기</button>
    </ion-list>
  `
})
export class OtherPopoverPage {
  constructor(public viewCtrl: ViewController) {}

  close() {
    this.viewCtrl.dismiss();
  }
}
