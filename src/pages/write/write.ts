import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController, ActionSheetController, AlertController  } from 'ionic-angular';
import {Autosize} from 'ionic2-autosize';

import { Camera, CameraOptions  } from '@ionic-native/camera';

import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

import { UserData } from '../../providers/user-data';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { NgForm } from '@angular/forms';

import { MyCatPage } from '../mycat/mycat';
import { ImageCropperPage } from '../image-cropper/image-cropper';
import { Crop } from '@ionic-native/crop';

@Component({
  selector: 'page-write',
  templateUrl: 'write.html',
})
export class WritePage {
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
  aspectRatio: number;
  submitted = false;
  serverURL: string = 'http://45.249.160.73:5555';
  constructor(
    public navCtrl: NavController,
    private file: File,
    private camera: Camera,
    private transfer: Transfer,
    private imagePicker: ImagePicker,
    public alertCtrl: AlertController,
    private http: Http,
    public modalCtrl: ModalController,
    public userData: UserData,
    public actionSheetCtrl: ActionSheetController,
    private crop: Crop,
  ) {
    this.photos = [];
    this.cat_img = "assets/img/add.png";
    this.write_content.type = 0; //기본:글
    this.upload_count = 0; //기본:글
    this.cat_name = "고양이";
    this.userData.getUserSeq().then(
      (seq) => {
        this.write_content.user_seq = seq;
      });
  }
  write() { //완료
    if (this.write_content.cat_seq == undefined) {
      this.showAlert("고양이를 선택해주세요.")
    }
    else if (this.write_content.content == undefined) {
      this.showAlert("글을 입력해주세요.")
    } else {

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
  check(data: any) {
    alert(data);
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
            //this.showAlert("업로드 완료");
            this.navCtrl.parent.select(2); //새로고침의 의미로 한번클릭
            this.navCtrl.parent.select(0); //홈 탭으로 이동
            this.navCtrl.parent.select(0);//새로고침의 의미로 두번
          }
        }, (err) => {

        });
    }
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
          }
        }
      });
  }
  TakePicture() {
    var options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      allowEdit: true,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: 0,
      saveToPhotoAlbum: true,
    }

    this.camera.getPicture(options).then((imageUrl) => {
      this.photos.push(imageUrl);
      alert(imageUrl);
    }, (err) => {
      this.showAlert("사진을 불러오지 못했습니다.");
    });
  }
  select_ratio() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '업로드 할 사진의 비율을 선택해주세요.',
      buttons: [
        {
          text: '4:3',
          icon: 'photos',
          handler: () => {
            this.aspectRatio=4/3;
            this.openPhotoLibrary();
          }
        }, {
          text: '1:1',
          icon: 'photos',
          handler: () => {
            this.aspectRatio=1/1;
            this.openPhotoLibrary();
          }
        }, {
          text: '3:4',
          icon: 'photos',
          handler: () => {
            this.aspectRatio=3/4;
            this.openPhotoLibrary();
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

  openPhotoLibrary2() {
    var options: CameraOptions = {
      quality: 100,
      //targetWidth: this.imageTargetWidth,
      //targetHeight: this.imageTargetHeight,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: 0,
      saveToPhotoAlbum: true,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
    }

    this.camera.getPicture(options).then((imageUrl) => {
      //    this.openCropperPage(imageUrl);
      alert(imageUrl);
      this.crop.crop(imageUrl, { quality: 100 })
        .then(
        (newImage) => {
          alert('new image path is: ' + newImage)
          this.photos.push(newImage)
        },
        (error) =>
        { console.error('Error cropping image', error) }
        );



      /*
      this.file.resolveLocalFilesystemUrl(imageUrl).then((fileEntry) => {
        alert(fileEntry.fullPath);
        alert(fileEntry.nativeURL);
        var newFileUri = this.file.dataDirectory + "images/";
        var oldFileUri = fileEntry.nativeURL;
        var fileExt = "." + oldFileUri.split('.').pop();

        var newFileName= "car"+fileExt;

        this.file.resolveDirectoryUrl(newFileUri).then((dirEntry)=>{
          fileEntry.moveTo(dirEntry, newFileName);
          alert("성공");
        },(err)=>{alert("err!!!")});


      }, (err) => {
        this.showAlert("사진을 불러오지 못했습니다.");
      });

      /*
    //  var currentName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1,imageUrl.lastIndexOf('?'));
      var currentName = imageUrl.replace(/^.*[\\\/]/, '');
      //currentName = currentName.substring(0,imageUrl.lastIndexOf('?'));
      //alert("템프: "+this.file.tempDirectory);
      //alert("캐시: "+this.file.cacheDirectory);
      //alert("데이타: "+this.file.dataDirectory);
      var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
      alert(currentName+" => "+newFileName);
      this.file.moveFile(this.file.cacheDirectory, currentName, this.file.dataDirectory, newFileName).then((entry)=>{
        alert("n-url: "+entry.nativeURL);
        alert("n-url: "+entry.fullPath);

      },(err)=>{
        alert("실패"+err);
      });
      */
      /*
      var newUrl = "file:///storage/emulated/0/Pictures/";
      this.file.checkDir("file:///storage/emulated/0/","Pictures").then((result)=>{
        alert("체크!:"+result);
      },(err)=>{
        alert("err");
      });
      //alert("data:"+this.file.dataDirectory);
    //  alert("cache:"+this.file.cacheDirectory);
      alert("이미지유알엘"+imageUrl);
      var currentUrl = imageUrl.substring(0,imageUrl.lastIndexOf('/')+1);
      alert("현주소"+currentUrl);
      var filename = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
      //var filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1,imageUrl.lastIndexOf('?'));
      alert("현재이름"+filename);
      var newName=filename+'.jpg';
      //var newName=filename;
      this.file.copyFile(currentUrl,filename,newUrl,newName).then((fileEntry)=>{
        alert('복사성공full:'+fileEntry.fullPath+" "+fileEntry.filesystem);
      },(err)=>{
        alert("복사실패"+err);
      })
      this.photos.push(newUrl+newName);
      alert("최종:" + newUrl+newName);
*/
    }, (err) => {
      this.showAlert("사진을 불러오지 못했습니다.");
    });
  }
  select_photos() {
    if (this.photos.length == 0) {
      this.select_ratio();
    }
    else {
      this.openPhotoLibrary();
    }
  }

  openPhotoLibrary() {
    var options: ImagePickerOptions = {
      maximumImagesCount: 10,
    }
    this.imagePicker.getPictures(options).then((results) => {
      if(results.length!=0){
        this.openCropperPage(results);
      }
    }, (err) => { });
  }
  openCropperPage(images) {
    let modal = this.modalCtrl.create(ImageCropperPage, { images: images, ratio:this.aspectRatio });
    modal.onDidDismiss(data => {
      if (data != null) {
        for (var i = 0; i < data.length; i++) {
          this.photos.push(data[i]);
        }
      }
    })
    modal.present();
  }
}
