import { Component } from '@angular/core';
import { NavParams, ModalController, AlertController, ToastController   } from 'ionic-angular'
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
  serverURL: string;
  connect: boolean;
  watchButton: string;
  myCatName: string;
  alert;

  constructor(public navParams: NavParams,
    public modalCtrl: ModalController,
    private http: Http,
    public userData: UserData,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
  ) {
    this.serverURL = this.userData.serverURL;
    this.cat = this.navParams.get("cat");
  }
  ionViewDidLoad() {
    this.getConnectionWithCat();
  }
  openMap() {
    let modal = this.modalCtrl.create(MapPage, { pageType: 1, name: this.cat.names[0], lat: this.cat.latitude, lng: this.cat.longitude });
    modal.present();
  }
  getConnectionWithCat() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      cat_seq: this.cat.seq,
      user_seq: this.userData.userSeq,
    }

    this.http.post(this.serverURL + '/getConnectionWithCat', JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if (data.result == true) {
          console.log("true" + data.name);
          this.connect = true;
          this.myCatName = data.name;
          this.watchButton = "♥" + data.name + "♥";
        } else {
          console.log("false");
          this.connect = false;
          this.watchButton = "나도 지켜보기";
        }
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
  addConnection(cat_name) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      cat_seq: this.cat.seq,
      user_seq: this.userData.userSeq,
      cat_name: cat_name
    }

    this.http.post(this.serverURL + '/addConnection', JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.presentToast(cat_name + "를(을) '지켜보기' 하였습니다!");
        this.connect = true;
        this.myCatName = cat_name;
        this.watchButton = "♥" + cat_name + "♥";
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
  showNameAlert() {
    this.alert = this.alertCtrl.create();
    this.alert.setTitle('이름을 지어주세요!');

    this.alert.addInput({
      type: 'radio',
      label: '직접 지어주기',
      value: 'rename',
      checked: true
    });
    for (var i = 0; i < this.cat.nameCount; i++) {
      this.alert.addInput({
        type: 'radio',
        label: this.cat.names[i] + " (" + this.cat.counts[i] + "명이 선택함)",
        value: this.cat.names[i],
      });
    }
    this.alert.addButton('취소');
    this.alert.addButton({
      text: '선택',
      handler: data => {
        console.log(data);
        if (data == 'rename') {
          this.showPrompt();
        } else {
          this.addConnection(data);
        }
      }
    });

    this.alert.present().then(() => {
    });
  }
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: '이름 짓기',
      message: "고양이의 새 이름을 지어주세요.",
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
          }
        },
        {
          text: '확인',
          handler: data => {
            this.addConnection(data.content);
          }
        }
      ]
    });
    prompt.present();
  }
  watchCat() {
    if (this.connect == false) { // 연결없음. 지켜보기
      this.showNameAlert();
    } else { //지켜보기 해제
      this.showCancelAlert();
    }
  }
  showCancelAlert() {
    let confirm = this.alertCtrl.create({
      title: '지켜보기 해제',
      message: this.myCatName + '와(과)의 연결을 끊습니다.',
      buttons: [
        {
          text: '취소',
          handler: () => {
          }
        },
        {
          text: '확인',
          handler: () => {
            this.deleteConnection(this.myCatName);
          }
        }
      ]
    });
    confirm.present();
  }
  deleteConnection(myCatName) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      cat_seq: this.cat.seq,
      user_seq: this.userData.userSeq,
      cat_name: myCatName
    }

    this.http.post(this.serverURL + '/deleteConnection', JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.presentToast("이제 " + myCatName + "를(을) 지켜보지 않습니다.TㅅT");
        this.connect = false;
        this.myCatName = null;
        this.watchButton = "나도 지켜보기";
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}
