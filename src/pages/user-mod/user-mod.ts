import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ViewController, ActionSheetController,Events } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { UserData } from '../../providers/user-data';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { User } from '../../models/user';
/**
 * Generated class for the UserModPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-mod',
  templateUrl: 'user-mod.html',
})
export class UserModPage {
  user: User;

  submitted = false;
  loading;
  imageChange: number = 0;//0:변경x or 기본이미지로, 1:변경함
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private transfer: Transfer,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public actionSheetCtrl: ActionSheetController,
    public userData: UserData,
    private http: Http,
    public events: Events,
  ) {
    this.user = this.navParams.get('user');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserModPage');
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
          this.dismiss(true);
          this.showAlert("프로필이 수정되었습니다.");
        }
        else {
          if (data.msg == "nickname check") { // result==false
            this.dismiss(true);
            this.showAlert("이미 존재하는 닉네임입니다!");
          }
        }
        this.events.publish('user:modified');
        this.loading.dismiss();
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
  OK(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.presentLoading();
      switch (this.imageChange) {
        case 0:
          this.onlyUser();
          break;
        case 1:
          this.upload();
          break;
      }
    }
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
      this.imageChange = 1;
    }, (err) => {
      //  alert("사진을 불러오지 못했습니다.");
    });
  }
  dismiss(data) {
    this.viewCtrl.dismiss(data) //페이지 끔
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
        this.showAlert("프로필이 수정되었습니다.");
        this.dismiss(true);
        this.events.publish('user:modified');
      }, (err) => {

      });
  }
  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: '잠시만 기다려주세요 ^^)/'
    });

    this.loading.present();
  }
  showAlert(text: string) {
    let alert = this.alertCtrl.create({
      title: '알림',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
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
}
