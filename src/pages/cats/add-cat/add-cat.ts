import { Component } from '@angular/core';
import { AlertController,Events,NavController, NavParams, ViewController,ModalController,LoadingController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Camera, CameraOptions  } from '@ionic-native/camera';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { UserData } from '../../../providers/user-data';
import { MapPage } from '../../map/map';
import { Cat } from '../../../models/cat';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-add-cat',
  templateUrl: 'add-cat.html',
})
export class AddCat {
  pageType :number; //0 :등록, 1:수정
  cat:Cat;
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
    cat_seq?:number, //수정시에만 있음
    modifyList?:string, //수정시에만 있음
    img?:string, //수정시에만 있음
  } = {};
  submitted=false;
  loading;

  imgUrl:string ="";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private camera: Camera,
    private http: Http,
    private transfer: Transfer,
    public userData: UserData,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public events: Events,
  ) {
    this.userData.getUserSeq().then((seq)=>{
      this.catinfo.user_seq =seq;
    })
    if(this.navParams.get("pageType")==1){
      this.pageType=1;
      this.cat=this.navParams.get("cat");
      this.imgUrl=this.cat.avatar;
      this.catinfo.img=this.cat.avatar.replace(this.userData.serverURL, "");
      this.catinfo.habitat=this.cat.habitat;
      this.catinfo.sex=this.cat.sex;
      this.catinfo.info1=this.cat.info1;
      this.catinfo.info2=this.cat.info2;
      this.catinfo.info3=this.cat.info3;
      this.catinfo.latitude=this.cat.latitude;
      this.catinfo.longitude=this.cat.longitude;
      this.catinfo.cat_seq = this.cat.seq;
    }else{
      this.pageType=0;
      this.imgUrl="assets/img/add2.png";

    }
  }

  dismiss(data){
    this.viewCtrl.dismiss(data) //페이지 끔
  }
  onSubmit(form: NgForm){
    this.submitted =true;
    if(this.imgUrl=="assets/img/add2.png"){
      this.showAlert("프로필 사진을 입력해주세요!");
    }
    if(this.pageType==0 && (this.catinfo.name==null||this.catinfo.name=="")){
      this.showAlert("이름을 적어주세요!");
    }
    else if (form.valid){
      this.presentLoading();
      if(this.pageType==0){
        this.upload();
      }else{
        this.catinfo.modifyList="";
        if(this.catinfo.sex!=this.cat.sex){
          this.catinfo.modifyList+=" 성별";
        }
        if(this.catinfo.info1!=this.cat.info1 || this.catinfo.info2!=this.cat.info2 || this.catinfo.info3!=this.cat.info3 ){
          this.catinfo.modifyList+=" 특징";
        }
        if(this.catinfo.habitat!=this.cat.habitat){
          this.catinfo.modifyList+=" 서식지역";
        }
        if(this.imgUrl!=this.cat.avatar){
          this.catinfo.modifyList+=" 사진 ";
          this.modifyWithImage();
        }else{
          this.catinfo.modifyList+=" ";
          this.modifyNoImage();
        }
      }
    }
  }
  modifyNoImage(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post(this.userData.serverURL + '/modifyCat', JSON.stringify(this.catinfo),
      { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if (data.result == true) { //성공
          this.dismiss(true);
          this.showAlert("프로필이 수정되었습니다.");
        }
        this.events.publish('cat:modified');
        this.loading.dismiss();
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
  modifyWithImage(){
    if(this.catinfo.info2==null){
      this.catinfo.info2="";
    }
    if(this.catinfo.info3==null){
      this.catinfo.info3="";
    }
    const fileTransfer: TransferObject = this.transfer.create();

      var filename = this.imgUrl.substr(this.imgUrl.lastIndexOf('/')+1);
      let fileOptions: FileUploadOptions = {
        fileKey: 'cat',
        fileName: filename,
        params: this.catinfo,
      }
      fileTransfer.upload(this.imgUrl, this.userData.serverURL + '/catModifyWithImage', fileOptions)
        .then((data) => {
          this.loading.dismiss();
          this.dismiss(true);
          this.showAlert("프로필이 수정되었습니다.");
          this.events.publish('cat:modified');
        }, (err) => {

        });
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
          this.loading.dismiss();
          this.dismiss(true);
          this.events.publish('cat:modified');
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
        console.log(JSON.stringify(data));
        this.catinfo.latitude = data.latitude;
        this.catinfo.longitude = data.longitude;
        this.catinfo.habitat=data.placeName;
        console.log("서식:"+this.catinfo.habitat);
      }
    })
    modal.present();
  }
  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: '잠시만 기다려주세요 ^^)/'
    });

    this.loading.present();
  }
  deleteCat(){
    let confirm = this.alertCtrl.create({
      title: '알림',
      message: "지켜보는 사람이 0명이여야 삭제할 수 있습니다.<br/>계속하시겠습니까?",
      buttons: [
        {
          text: '아니오',
          handler: () => {
          }
        },
        {
          text: '네',
          handler: () => {
            if(this.cat.connection<1){
              this.deleteCatDB();
            }else{
              this.showAlert("아직 이 고양이를 지켜보는 사람이 있습니다.<br/>프로필을 삭제할 수 없습니다.")
            }
          }
        }
      ]
    });
    confirm.present();
  }
  deleteCatDB(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post(this.userData.serverURL + '/deleteCat', JSON.stringify({cat_seq:this.cat.seq, img:this.catinfo.img}),
      { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if (data.result == true) { //성공
          this.dismiss(true);
          this.showAlert("프로필이 삭제되었습니다.");
        }
        this.events.publish('cat:modified');
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
}
