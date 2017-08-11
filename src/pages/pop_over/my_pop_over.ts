import { Component } from '@angular/core';
import { NavController, ViewController,AlertController } from 'ionic-angular';
@Component({
  template:`
    <ion-list>
      <ion-list-header>CATSUP</ion-list-header>
      <button ion-item (click)="close('modify_feed')">글 수정하기</button>
      <button ion-item (click)="showConfirm()">글 삭제하기</button>
    </ion-list>
  `
})
export class MyPopoverPage {
  constructor(public viewCtrl: ViewController,public alertCtrl: AlertController) {}

  close(data) {
    this.viewCtrl.dismiss(data);
  }
  showConfirm() {
  let confirm = this.alertCtrl.create({
    title: '삭제하기',
    message: '정말 삭제하시겠습니까?',
    buttons: [
      {
        text: '취소',
        handler: () => {
          this.close(null);
        }
      },
      {
        text: '삭제',
        handler: () => {
          this.close("delete_feed");
        }
      }
    ]
  });
  confirm.present();
}
}
