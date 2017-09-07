import { Component, ViewChild, ViewChildren, QueryList, ElementRef, Type } from '@angular/core';
import { NavController, NavParams, ViewController, Loading, Slides, LoadingController } from 'ionic-angular';
import Cropper from 'cropperjs';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';

@Component({
  selector: 'page-image-cropper2',
  templateUrl: 'image-cropper2.html',
})
export class ImageCropper2Page {
  //Cropper 2 data
  first: boolean;
  cropperInstance: any;
  ratio: number;
  croppedCanvasWidth:number;
  croppedCanvasHeight:number;
  image: string;
  @ViewChild('imageSrc') imageElement: ElementRef;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,
    private base64ToGallery: Base64ToGallery,
    public loadingCtrl: LoadingController,
  ) {
    this.image = this.navParams.get('image');
    this.first = this.navParams.get('first');
    this.ratio = this.navParams.get('ratio');
  }
  ionViewDidLoad() {
    this.imageElement.nativeElement.src = this.image;
    this.cropImage(this.imageElement, this.ratio);
    switch (this.ratio) {
      case 4 / 3:
        this.croppedCanvasWidth = 880;
        this.croppedCanvasHeight = 660;
        break;
      case 1 / 1:
        this.croppedCanvasWidth = 770;
        this.croppedCanvasHeight = 770;
        break;
      case 3 / 4:
        this.croppedCanvasWidth = 660;
        this.croppedCanvasHeight = 880;
        break;
    }
  }
  cropImage(img: ElementRef, ratio) {
    this.cropperInstance = new Cropper(img.nativeElement, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: ratio, // 4/3, 1/1, 3/4
      guides: true,
      highlight: false,
      background: true,
      autoCrop: true,
      autoCropArea: 1,
      responsive: true,
      zoomable: false,
      movable: false,
      modal: true,
    });
  }
  changeRatio(ratio) {
    this.cropperInstance.setAspectRatio(ratio);
    this.ratio=ratio;
    switch (ratio) {
      case 4 / 3:
        this.croppedCanvasWidth = 880;
        this.croppedCanvasHeight = 660;
        break;
      case 1 / 1:
        this.croppedCanvasWidth = 770;
        this.croppedCanvasHeight = 770;
        break;
      case 3 / 4:
        this.croppedCanvasWidth = 660;
        this.croppedCanvasHeight = 880;
        break;
    }
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  cropDone() {
    let loading = this.loadingCtrl.create({
      content: '잠시만 기다려주세요 ^^)/'
    });
    loading.present().then(() => {
      let croppedImg;

      croppedImg = this.cropperInstance.getCroppedCanvas
        ({ width: this.croppedCanvasWidth, height: this.croppedCanvasHeight }).toDataURL('image/jpg', 0.8);

      this.base64ToGallery.base64ToGallery(croppedImg, { prefix: 'catsup_' }).then(
        res => {
          loading.dismiss();
          this.viewCtrl.dismiss({img:res, ratio:this.ratio});
        },
        err => console.log('Error saving image to gallery ', err)
      );
    });
  }
}
