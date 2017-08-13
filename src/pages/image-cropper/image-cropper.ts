import { Component, ViewChild, ViewChildren, QueryList, ElementRef, Type } from '@angular/core';
import { NavController, NavParams, ViewController, Loading, Slides } from 'ionic-angular';
import Cropper from 'cropperjs';

import { File } from '@ionic-native/file';

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
  writeFileCount:number=0;
  savedFileUrl:string[]=[];
  images: any[] = [];
  @ViewChild(Slides) slides: Slides;
  @ViewChildren('imageSrc') imageElement: QueryList<ElementRef>;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,
    private file: File,
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

  cropDone()  {

    //    alert("cropDone");
    let croppedImg = new Array(this.images.length);
    for (var i = 0; i < this.images.length; i++) {
      croppedImg[i] = this.cropperInstances[i].getCroppedCanvas
      ({ width: this.croppedCanvasWidth, height: this.croppedCanvasHeight }).toBlob((blob)=>{
        var time = new Date().getTime();
        this.saveBlobAsImageFile(this.file.externalCacheDirectory, time+'.jpg', blob);
      },'image/jpg',0.8);
    }
  }
  toRight(){
    if(!this.slides.isEnd()){
      this.slides.lockSwipes(false);
      this.slides.slideNext();
      this.slides.lockSwipes(true);
    }
  }
  toLeft(){
    if(!this.slides.isBeginning()){
      this.slides.lockSwipes(false);
      this.slides.slidePrev();
      this.slides.lockSwipes(true);
    }
  }
  saveBlobAsImageFile(folderpath,filename,content){
    // Convert the base64 string in a Blob
    var DataBlob = content;
    //alert(DataBlob.type+" "+folderpath+filename);

    //alert("Starting to write the file :3");
    this.file.writeFile(folderpath, filename, DataBlob).then(()=>{
      this.writeFileCount++;
      this.savedFileUrl.push(folderpath+filename);
      if(this.writeFileCount==this.images.length){ //저장다했으면
        this.viewCtrl.dismiss(this.savedFileUrl);
      }
    })
    .catch((err)=>{
      alert('error writing blob'+err);
    })
  }
}
