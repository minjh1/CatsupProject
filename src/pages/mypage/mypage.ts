import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Events,ActionSheetController,LoadingController,AlertController} from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import 'rxjs/add/operator/map';
import { UserData } from '../../providers/user-data'
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { Feed } from '../../models/feed';
import { User } from '../../models/user';
import { MyCatPage } from '../mycat/mycat';
import { HomePage } from '../home/home';

import { SettingPage } from '../setting/setting';

/**
 * Generated class for the Mypage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-mypage',
  templateUrl: 'mypage.html',
})
export class MyPage {
  user : User;
  pageType: number ; //0:나, 1:타인
  user_seq: number;
  id: string;
  nickname: string;
  image_url: string;
  memo: string;
  cat_count: number;
  feed_count: number;
  catsup_count: number;
  feedPlus:number = 12;
  loading;
  feeds: Array<Feed> = [];
  getFeedCount: number;
  more:boolean = true;
  serverURL: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public userData: UserData,
    public modalCtrl: ModalController,
    public events: Events,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private transfer: Transfer,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
    this.serverURL = this.userData.serverURL;
    if(this.navParams.get("pageType") == null){
      this.pageType = 0;
      events.subscribe('user:modified', () => {
        this.getUserData(this.user_seq);
      });
    }else{
      this.pageType = this.navParams.get("pageType");
    }
  }

  ionViewDidLoad() {
    this.getFeedCount = 0;
    if (this.pageType == 0) {
      this.user_seq = this.userData.userSeq;
      this.getUserData(this.user_seq);
      this.getUserFeeds(0, this.feedPlus, this.user_seq);
    } else {
      this.user_seq = this.navParams.get("user_seq");
      this.getUserData(this.user_seq);
      this.getUserFeeds(0, this.feedPlus, this.user_seq);
    }
  }
  getUserData(seq: number) {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      seq: seq,
    }
    //api로 받은 데이타를 body에 넣음
    this.http.post(this.serverURL + '/getUserData', JSON.stringify(body),
      { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.user_seq = seq;
        this.nickname = data.nickname;
        if (data.image_url.indexOf("/") == 0) { //서버이미지. 페북 계정 유저가 아님
          this.image_url = this.serverURL + data.image_url;
        } else { //페북유저
          this.image_url = data.image_url;
        }
        this.memo = data.memo;
        this.cat_count = data.catCount;
        this.feed_count = data.feed;
        this.catsup_count = data.catsup;
        this.user = new User(seq,data.nickname,this.image_url,data.email,data.memo);
      }, error => {
        console.log(JSON.stringify(error.json()));
      })

  }
  getUserFeeds(offset: number, limit: number, seq: number) {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      seq: seq,
      limit: limit,
      offset: offset,
    }

    this.http.post(this.serverURL + '/getUserFeeds', JSON.stringify(body), { headers: headers })
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
          var isLiked;
          if (data[i].like_users.indexOf(""+this.userData.userSeq) == -1) {
            console.log("false");
            isLiked = false;
          } else {
            console.log("true");
            isLiked = true;
          }
          if (data[i].userImg.indexOf("/") == 0) {
            this.feeds.push(new Feed(data[i].wr_seq, data[i].type, data[i].cat_seq, this.serverURL + data[i].catImg, data[i].catName,
              data[i].user_seq, this.serverURL + data[i].userImg, data[i].userName, data[i].imgUrl, content_preview, data[i].content, data[i].create_date,
              data[i].likeCount, isLiked, data[i].replyCount));
          }
          else {
            this.feeds.push(new Feed(data[i].wr_seq, data[i].type, data[i].cat_seq, this.serverURL + data[i].catImg, data[i].catName,
              data[i].user_seq, data[i].userImg, data[i].userName, data[i].imgUrl, content_preview, data[i].content, data[i].create_date,
              data[i].likeCount, isLiked, data[i].replyCount));
          }
        }
        this.getFeedCount += data.length;
        if(data.length < this.feedPlus){
          this.more=false;
        }
      }, error => {
        console.log(JSON.stringify(error.json()));
      })

  }
  openMyCatPage() {
    this.navCtrl.push(MyCatPage, { pageType: 1, user_seq:this.user_seq });
  }
  doRefresh(refresher) {
    this.feeds = [];
    this.getFeedCount = 0;
    this.getUserData(this.user_seq);
    this.getUserFeeds(0, this.feedPlus, this.user_seq);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 1000);
  }
  doInfinite(infiniteScroll) {
    this.getUserFeeds(this.getFeedCount, this.feedPlus, this.user_seq);
    setTimeout(() => {
      infiniteScroll.complete();
    }, 500);
  }
  openThisFeed(feed){
    this.navCtrl.push(HomePage, {pageType:1, feed:feed});
  }
  openSetting(){
    this.navCtrl.push(SettingPage, {user:this.user});
  }
  select() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '프로필 사진 변경',
      buttons: [
        {
          text: '갤러리에서 변경하기',
          icon: 'images',
          handler: () => {
            this.select_photo();
          }
        }, {
          text: '기본 이미지로 변경하기',
          icon: 'image',
          handler: () => {
            this.user.image_url = this.userData.serverURL + '/user_profile/default.jpg';
            this.presentLoading().then(()=>{
              this.onlyUser();
            });
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          //icon: !this.platform.is('ios') ? 'close' : null,
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  select_photo() {
    var options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      allowEdit: true,
      targetWidth: 200,
      targetHeight: 200,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      encodingType: 0,
    }

    this.camera.getPicture(options).then((imageUrl) => {
      this.user.image_url = imageUrl;
      this.presentLoading().then(()=>{
        this.upload();
      })
    }, (err) => {
      //  alert("사진을 불러오지 못했습니다.");
    });
  }
  upload() {
    const fileTransfer: TransferObject = this.transfer.create();
    let fileOptions: FileUploadOptions = {
      fileKey: 'user',
      fileName: "img",
      params: this.user,
    }
    fileTransfer.upload(this.user.image_url, this.userData.serverURL + '/modifyUserImg', fileOptions)
      .then((data) => {
        this.loading.dismiss();
        this.events.publish('user:modified');
        this.showAlert("변경되었습니다.");
      }, (err) => {

      });
  }
  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: '잠시만 기다려주세요 ^^)/'
    });

    return this.loading.present();
  }
  onlyUser() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var body ={
      user_seq :this.user.user_seq,
      nickname:this.user.nickname,
      email:this.user.email,
      image_url:this.user.image_url.replace(this.userData.serverURL, ""),
      memo:this.user.memo
    }

    this.http.post(this.userData.serverURL + '/modifyUser', JSON.stringify(body),
      { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if (data.result == true) { //성공
          this.loading.dismiss();
          this.events.publish('user:modified');
          this.showAlert("변경되었습니다.");
        }
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
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
