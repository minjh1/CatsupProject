import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController, ActionSheetController, AlertController, LoadingController,NavParams,ViewController  } from 'ionic-angular';
import {Autosize} from 'ionic2-autosize';

import { Camera, CameraOptions  } from '@ionic-native/camera';

import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';

import { UserData } from '../../providers/user-data';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { NgForm } from '@angular/forms';

import { MyCatPage } from '../mycat/mycat';
import { ImageCropperPage } from '../image-cropper/image-cropper';

import { ImageCropper2Page } from '../image-cropper2/image-cropper2';
@Component({
  selector: 'page-write',
  templateUrl: 'write.html',
})
export class WritePage {
  pageType :number ; //0 글쓰기 1 수정
  feed ;
  write_content:
  {
    cat_seq?: number,
    user_seq?: number,
    content?: string,
    type?: number,
  } = {};
  photos?: Array<string>;
  cat_img: string;
  cat_name: string;
  cat_habitat: string;
  cat_info: string;
  upload_count: number;
  ratio: number;
  submitted = false;
  loading;
  modOK = false;
  serverURL: string ;
  constructor(
    public navCtrl: NavController,
    private file: File,
    private camera: Camera,
    private transfer: Transfer,
    public alertCtrl: AlertController,
    private http: Http,
    public modalCtrl: ModalController,
    public userData: UserData,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.serverURL = this.userData.serverURL;
    this.pageType = navParams.get('pageType');
    this.write_content.user_seq = this.userData.userSeq;
    if(this.pageType!=1){
      this.pageType=0;
      this.photos = [];
      this.cat_img = "assets/img/add.png";
      this.write_content.type = 0; //기본:글
      this.upload_count = 0; //기본:글
      this.cat_name = "고양이";
    }else if(this.pageType==1){ //수정
      this.feed=navParams.get('feed');
      this.photos = [];
      this.write_content.type= this.feed.type;
      this.upload_count = 0;
      this.cat_name = this.feed.catName;
      this.cat_img = this.feed.catImg;
      this.write_content.content=this.feed.content;
      this.write_content.cat_seq = this.feed.cat_seq;
    }
  }
  write() { //완료
    if (this.write_content.cat_seq == undefined) {
      this.showAlert("고양이를 선택해주세요.")
    }
    else if (this.write_content.content == undefined) {
      this.showAlert("글을 입력해주세요.")
    } else {
      this.presentLoading();
      if (this.photos.length > 0) {
        this.write_content.type = 1;
      } else if (this.photos.length == 0) {
        this.write_content.type = 0;
      }
      this.addFeed(this.write_content);
    }
  }

  openSelectCatPage() {
    let modal = this.modalCtrl.create(MyCatPage, { pageType: 0 });
    modal.onDidDismiss(data => {
      if (data != null) {
        this.write_content.cat_seq = data.seq;
        this.cat_img = data.avatar;
        this.cat_name = data.name;
        this.cat_info = data.info1;
        this.cat_habitat = data.habitat;
      }
    })
    modal.present();
  }
  selectVideo(){
    this.showAlert("준비 중입니다.")
  }
  delete_photo(photo: string) {
    let index: number = this.photos.indexOf(photo);
    if (index !== -1) {
      this.photos.splice(index, 1);

    }
  }
  image_upload(feed_seq: number) {
    const fileTransfer: TransferObject = this.transfer.create();
    for (var i = 0; i < this.photos.length; i++) {

      var filename = this.photos[i].substr(this.photos[i].lastIndexOf('/') + 1);
      let fileOptions: FileUploadOptions = {
        fileKey: 'image',
        fileName: filename,
        params:
        {
          seq: feed_seq,//글 seq를 넣자
        }
      }
      fileTransfer.upload(this.photos[i], this.serverURL + '/uploadPhotos', fileOptions)
        .then((data) => {
          this.upload_count++;
          if (this.upload_count == this.photos.length) { //업로드 완료
            this.loading.dismiss();
            this.refresh();

            }
        }, (err) => {

        });
    }
  }
  dismiss() {
  this.viewCtrl.dismiss(this.modOK); //페이지 끔
  }
  refresh(){
    this.navCtrl.parent.select(2); //새로고침의 의미로 한번클릭
    this.navCtrl.parent.select(0); //홈 탭으로 이동
    this.navCtrl.parent.select(0);//새로고침의 의미로 두번
  }
  showAlert(text: string) {
    let alert = this.alertCtrl.create({
      title: '알림',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  addFeed(body: any) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http.post(this.serverURL + '/addFeed', JSON.stringify(body),
      { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if (data.result == true) { //성공
          if (body.type == 1) {
            this.image_upload(data.wr_seq);
          }else{
            this.loading.dismiss();
            this.refresh();
          }
        }
      });
  }
  TakePicture() {
    var options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: 0,
      saveToPhotoAlbum: true,
    }
    this.camera.getPicture(options).then((imageUrl) => {
      this.openCropperPage2(imageUrl);
    }, (err) => {
    });
  }
  openGallery(){
  //  this.openCropperPage2("http://45.249.160.73:5555/image/image_148_1504597891464.png");

    var options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: 0,
    }

    this.camera.getPicture(options).then((imageUrl) => {
      this.openCropperPage2(imageUrl);
    }, (err) => {
    });
  }
  openCropperPage2(image) {
    var fir;
    if(this.photos.length==0){
      this.ratio=4/3;
      fir=true;
    }else{
      fir=false;
    }
    let modal = this.modalCtrl.create(ImageCropper2Page, { image: image, first:fir, ratio:this.ratio });
    modal.onDidDismiss(data => {
      if (data != null) {
          this.photos.push(data.img);
          this.ratio = data.ratio;
      }
    })
    modal.present();
  }
  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: '업로드 중입니다 ^.^'
    });

    this.loading.present();
  }
  modifyWrite(){
    if (this.write_content.cat_seq == undefined) {
      this.showAlert("고양이를 선택해주세요.")
    }
    else if (this.write_content.content == undefined) {
      this.showAlert("글을 입력해주세요.")
    } else {
      this.presentLoading();
      this.modifyFeed(this.feed.wr_seq, this.write_content);
    }
  }
  modifyFeed(wr_seq, content){
    var body = {
      wr_seq : wr_seq,
      content : content,
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http.post(this.serverURL + '/modifyFeed', JSON.stringify(body),
      { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if (data.result == true) { //성공
          this.loading.dismiss();
          this.modOK=true;
          this.dismiss();
        }
      });
  }
}
