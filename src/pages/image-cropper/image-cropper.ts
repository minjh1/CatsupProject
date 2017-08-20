import { Component, ViewChild, ViewChildren, QueryList, ElementRef, Type } from '@angular/core';
import { NavController, NavParams, ViewController, Loading, Slides, LoadingController } from 'ionic-angular';
import Cropper from 'cropperjs';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';

@Component({
  selector: 'page-image-cropper',
  templateUrl: 'image-cropper.html',
})
export class ImageCropperPage {
  //Cropper 2 data
  imageUrl: any;
  croppedImg: any;
  cropperInstances: any[] = [];
  ratio: number;
  croppedCanvasWidth: number;
  croppedCanvasHeight: number;
  imageElements: ElementRef[] = [];
  savedFileUrl: string[] = [];
  blobUrl: string[] = [];
  images: any[] = [];
  @ViewChild(Slides) slides: Slides;
  @ViewChildren('imageSrc') imageElement: QueryList<ElementRef>;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,
    private base64ToGallery: Base64ToGallery,
    public loadingCtrl: LoadingController,
  ) {
    this.images = this.navParams.get('images');
    this.ratio = this.navParams.get('ratio');
    this.cropperInstances = new Array(this.images.length);

  }
  ionViewDidLoad() {
    switch (this.ratio) {
      case 4 / 3:
        this.croppedCanvasWidth = 1000;
        this.croppedCanvasHeight = 750;
        break;
      case 1 / 1:
        this.croppedCanvasWidth = 1000;
        this.croppedCanvasHeight = 1000;
        break;
      case 3 / 4:
        this.croppedCanvasWidth = 750;
        this.croppedCanvasHeight = 1000;
        break;
    }
    this.imageElement.forEach((img: ElementRef, i) => {
      img.nativeElement.src = this.images[i];
      this.cropImage(i, img);
    })
    this.slides.lockSwipes(true);
  }
  cropImage(i, img: ElementRef) {
    this.cropperInstances[i] = new Cropper(img.nativeElement, {
      dragMode: 'move',
      aspectRatio: this.ratio, // 4/3, 1/1, 3/4
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
  dismiss() {
    this.viewCtrl.dismiss();
  }
  cropDone() {
    let loading = this.loadingCtrl.create({
      content: '잠시만 기다려주세요 ^^)/'
    });
    loading.present().then(() => {
      let croppedImg = [];
      let savedImg = [];
      for (var i = 0; i < this.images.length; i++) {
        croppedImg.push(this.cropperInstances[i].getCroppedCanvas
          ({ width: this.croppedCanvasWidth, height: this.croppedCanvasHeight }).toDataURL('image/jpg', 0.8));
        this.base64ToGallery.base64ToGallery(croppedImg[i], { prefix: 'catsup_' }).then(
          res => {
            this.savedFileUrl.push(res); //URL
            if (this.savedFileUrl.length == this.images.length) { //저장다했으면
              loading.dismiss();
              this.viewCtrl.dismiss(this.savedFileUrl);
            }
          },
          err => console.log('Error saving image to gallery ', err)
        );
      }
    });
  }
  toRight() {
    if (!this.slides.isEnd()) {
      this.slides.lockSwipes(false);
      this.slides.slideNext();
      this.slides.lockSwipes(true);
    }
  }
  toLeft() {
    if (!this.slides.isBeginning()) {
      this.slides.lockSwipes(false);
      this.slides.slidePrev();
      this.slides.lockSwipes(true);
    }
  }
}
