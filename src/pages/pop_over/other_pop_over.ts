import { Component } from '@angular/core';
import { ViewController,AlertController } from 'ionic-angular';
@Component({
  template: `
    <ion-list>
      <ion-list-header>CATSUP</ion-list-header>
      <button ion-item (click)="showPrompt()">신고하기</button>
    </ion-list>
  `
})
export class OtherPopoverPage {
  constructor(public viewCtrl: ViewController,
  public alertCtrl: AlertController) {}

  close(data) {
    this.viewCtrl.dismiss(data);
  }
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: '신고하기',
      message: "이 글을 신고하는 이유를 작성해주세요.",
      inputs: [
        {
          name: 'content',
          placeholder: '입력하기...'
        },
      ],
      buttons: [
        {
          text: '취소',
          handler: data => {
            this.close(null);
          }
        },
        {
          text: '전송',
          handler: data => {
            this.close(data.content);
          }
        }
      ]
    });
    prompt.present();
  }
  showAlert(text: string) {
    let alert = this.alertCtrl.create({
      title: '알림',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
}
