import { Component, ViewChild } from '@angular/core';

import { NavController, Slides, ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
import { SignUpPage } from '../signup/signup';
import { NgForm } from '@angular/forms';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { UserData } from '../../providers/user-data';
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})

export class TutorialPage {
  //showSkip = true;

  @ViewChild('slides') slides: Slides;
  serverURL: string = 'http://45.249.160.73:5555';

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public modalCtrl: ModalController,
    private fb: Facebook,
    private http: Http,
    public userData: UserData,
  ) { }



  startApp() {
    this.navCtrl.push(TabsPage).then(() => {
      this.storage.set('hasSeenTutorial', 'true');
    })

  }


  onSlideChangeStart(slider: Slides) {
    //  this.showSkip = !slider.isEnd();
  }

  ionViewWillEnter() {
    this.slides.update();
  }

  openLoginPage() {
    let loginPage = this.modalCtrl.create(LoginPage);
    loginPage.present();
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
