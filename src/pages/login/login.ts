import { Component } from '@angular/core';
import { NavController, NavParams, ViewController,ModalController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { SignUpPage } from '../signup/signup';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { TabsPage } from '../tabs/tabs';
import { UserData } from '../../providers/user-data'
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginInfo :
  {
    id?:string,
    password?:string,
  } = {};

  submitted=false;
  serverURL: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private http: Http,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public storage: Storage,
    public userData: UserData,
    private fb: Facebook) {
    this.serverURL=this.userData.serverURL;
  }

  dismiss(){
    this.viewCtrl.dismiss() //페이지 끔
  }

  Login(form: NgForm){
    this.submitted=true;
    if(form.valid){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let body = {
        id: this.loginInfo.id,
        password: this.loginInfo.password,
      }

      this.http.post(this.serverURL + '/Login', JSON.stringify(body),
      { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          if(data.result==true){ //성공
            this.navCtrl.push(TabsPage).then(() => {
              this.userData.login(data.seq);
            })
          }
          else {
            if(data.msg=="id check"){ // result==false
              let alert = this.alertCtrl.create({
                title: '로그인 실패',
                subTitle: '존재하지 않는 아이디입니다.',
                buttons: ['OK']
              });
              alert.present();
            }
            else if (data.msg=="password check"){
              let alert = this.alertCtrl.create({
                title: '로그인 실패',
                subTitle: '비밀번호를 다시 확인해주세요.',
                buttons: ['OK']
              });
              alert.present();
            }
          }
          console.log(data.result+" "+data.seq+" "+data.msg);
        }, error => {
          console.log(JSON.stringify(error.json()));
        })
    }
  }
  openSignUpPage() {
    let signUpPage = this.modalCtrl.create(SignUpPage);
    signUpPage.present();
  }
  facebookLogin() {
    this.fb.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        console.log('Logged into Facebook!', res)

        this.getFacebookData();
      })
      .catch(e => console.log('Error logging into Facebook', e));


    this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
  }
  getFacebookData() {
    this.fb.api('me?fields=id,name,email,picture.width(160).height(160).type(square)',
      ['public_profile', 'email'])
      .then((res) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let body = {
          id: res.id,
          email: res.email,
          nickname: res.name,
          picture: res.picture.data.url,
        }
        //api로 받은 데이타를 body에 넣음
        this.http.post(this.serverURL + '/FacebookLoginReq', JSON.stringify(body),
          { headers: headers })
          .map(res => res.json())
          .subscribe(data => {
            if (data.result == true) { //성공
              this.navCtrl.push(TabsPage).then(() => {
                this.storage.set('hasSeenTutorial', 'true');
                this.userData.signup(data.seq);
              })
            }
          }, error => {
            console.log(JSON.stringify(error.json()));
          })
      })
  }
}
