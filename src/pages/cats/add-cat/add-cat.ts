import { Component } from '@angular/core';
import { AlertController,NavController, NavParams, ViewController,ModalController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Camera, CameraOptions  } from '@ionic-native/camera';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { UserData } from '../../../providers/user-data';
import { MapPage } from '../../map/map';

@Component({
  selector: 'page-add-cat',
  templateUrl: 'add-cat.html',
})
export class AddCat {
  catinfo :
  {
    name?:string,
    sex?:number,
    habitat?:string,
    latitude?:string,
    longitude?:string,
    info1?:string,
    info2?:string,
    info3?:string,
    user_seq?:number,
  } = {};
  submitted=false;

  imgUrl:string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private camera: Camera,
    private transfer: Transfer,
    public userData: UserData,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,

  ) {
    this.imgUrl="assets/img/add2.png";
    this.userData.getUserSeq().then((seq)=>{
      this.catinfo.user_seq =seq;
    })
  }

  dismiss(){
    this.viewCtrl.dismiss() //페이지 끔
  }
  onSubmit(form: NgForm){
    this.submitted =true;
    if (form.valid){
      this.upload();
    }
  }
  upload(){
    const fileTransfer: TransferObject = this.transfer.create();

      var filename = this.imgUrl.substr(this.imgUrl.lastIndexOf('/')+1);
      let fileOptions: FileUploadOptions = {
        fileKey: 'cat',
        fileName: filename,
        params: this.catinfo,
      }
      fileTransfer.upload(this.imgUrl, this.userData.serverURL + '/addCatProfile', fileOptions)
        .then((data) => {
            this.dismiss();
            this.navCtrl.parent.select(3); //새로고침
            this.navCtrl.parent.select(3); //새로고침
        }, (err) => {

        });
  }
  select_photo() {
    var options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      allowEdit: true,
      targetWidth: 200,
      targetHeight :200,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      encodingType: 0,
    }

    this.camera.getPicture(options).then((imageUrl) => {
      this.imgUrl= imageUrl;
    }, (err) => {
    //  alert("사진을 불러오지 못했습니다.");
    });
  }
  showAlert(text: string) {
    let alert = this.alertCtrl.create({
      title: '알림',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  openMap(){
    let modal = this.modalCtrl.create(MapPage, { pageType: 0 });
    modal.onDidDismiss(data => {
      if (data != null) {
        this.catinfo.latitude = data.latitude;
        this.catinfo.longitude = data.longitude;
      }
    })
    modal.present();
  }
}
