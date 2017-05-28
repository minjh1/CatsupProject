import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';

import { TabsPage } from '../tabs/tabs';
import { UserData } from '../../providers/user-data';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignUpPage {
  signUpInfo:
  {
    id?: string,
    email?: string,
    password?: string,
    nickname?: string,
    memo?: string,
  } = {};

  submitted = false;
  serverURL: string = 'http://45.249.160.73:5555';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private http: Http,
    public alertCtrl: AlertController,
    public storage: Storage,
    public userData: UserData) {

  }

  dismiss() {
    this.viewCtrl.dismiss() //페이지 끔
  }

  SignUp(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let body = {
        id: this.signUpInfo.id,
        email: this.signUpInfo.email,
        password: this.signUpInfo.password,
        nickname: this.signUpInfo.nickname,
        memo: this.signUpInfo.memo,
      }

      this.http.post(this.serverURL + '/signUp', JSON.stringify(body),
        { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          if (data.result == true) { //성공
            let alert = this.alertCtrl.create({
              title: '환영합니다',
              subTitle: '회원가입 성공!',
              buttons: [{
                text: 'OK',
                handler: () => {
                  let navTransition = alert.dismiss(); //alert 끄기
                  navTransition.then(() => { //끄고,
                    this.navCtrl.push(TabsPage).then(() => {
                      this.storage.set('hasSeenTutorial', 'true');
                      this.userData.signup(data.seq);
                    })
                  });
                }
              }]
            });
            alert.present();
          }
          else {
            if (data.msg == "nickname check") { // result==false
              let alert = this.alertCtrl.create({
                title: '회원가입 실패',
                subTitle: '이미 존재하는 닉네임입니다!',
                buttons: ['OK']
              });
              alert.present();
            }
            else if (data.msg == "id check") {
              let alert = this.alertCtrl.create({
                title: '회원가입 실패',
                subTitle: '이미 존재하는 아이디입니다!',
                buttons: ['OK']
              });
              alert.present();
            }
          }
          console.log(data.result + " " + data.seq + " " + data.msg);
        }, error => {
          console.log(JSON.stringify(error.json()));
        })
    }
  }

}
