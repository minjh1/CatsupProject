import { Component } from '@angular/core';
import { NavParams,NavController, ModalController, AlertController, ToastController } from 'ionic-angular'
import { Cat } from '../../../models/cat';
import { MapPage } from '../../map/map';
import { Http, Headers } from '@angular/http';
import { UserData } from '../../../providers/user-data'
import { Feed } from '../../../models/feed';
import { UserListPage } from '../../user-list/user-list';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})

export class CatProfilePage {
  cat: Cat;
  serverURL: string;
  connect: boolean;
  watchButton: string;
  myCatName: string;
  alert;

  getFeedCount: number;
  feedPlus:number = 15;
  feeds: Array<Feed> = [];

  more:boolean = true;

  constructor(public navParams: NavParams,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
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
    this.getFeedCount=0;
    this.getCatFeeds(this.getFeedCount, this.feedPlus, this.cat.seq);
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
          this.watchButton =data.name ;
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
        this.watchButton = cat_name;
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

  openWatchList(cat_seq) {
    this.navCtrl.push(UserListPage, {
      pageType: 1,
      seq: cat_seq,
    });
  }
  getCatFeeds(offset: number, limit: number, seq: number) {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      seq: seq,
      limit: limit,
      offset: offset,
    }

    this.http.post(this.serverURL + '/getCatFeeds', JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        console.log(data.length);
        for (let i = 0; i < data.length; i++) {
          var text_cut = data[i].content.indexOf('\n');
          var content_preview, content_temp;
          if (text_cut == -1 || text_cut > 90) { // 엔터없으면 90자까지 표시
            content_preview = data[i].content.substr(0, 90);
          } else { //있음
            var count = 2; //최대 3줄 표시
            while (count--) {
              content_temp = data[i].content.substr(text_cut + 1, 50);
              var text_cut_temp = content_temp.indexOf('\n');
              if (text_cut_temp == -1) {
                break;
              }
              text_cut += text_cut_temp + 1;
            }
            content_preview = data[i].content.substr(0, text_cut);
          }

          if (data[i].like_users.indexOf(this.userData.userSeq) == -1) {
            var isLiked = false;
          } else {
            var isLiked = true;
          }
          this.feeds.push(new Feed(data[i].wr_seq, data[i].type, data[i].cat_seq, this.serverURL + data[i].catImg, data[i].catName,
            data[i].user_seq, this.serverURL + data[i].userImg, data[i].userName, data[i].imgUrl, content_preview, data[i].content, data[i].create_date,
            data[i].likeCount, isLiked, data[i].replyCount));
        }
        this.getFeedCount += data.length;
        if(data.length < this.feedPlus){
          this.more=false;
        }

      }, error => {
        console.log(JSON.stringify(error.json()));
      })

  }
  doInfinite(infiniteScroll) {
      this.getCatFeeds(this.getFeedCount, this.feedPlus, this.cat.seq);
      setTimeout(() => {
        infiniteScroll.complete();
      }, 500);
    }
}
