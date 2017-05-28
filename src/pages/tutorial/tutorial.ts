import { Component, ViewChild } from '@angular/core';

import { NavController, Slides,ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
import { SignUpPage } from '../signup/signup';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})

export class TutorialPage {
  //showSkip = true;

	@ViewChild('slides') slides: Slides;

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public modalCtrl:ModalController
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

  openLoginPage(){
    let loginPage = this.modalCtrl.create(LoginPage);
    loginPage.present();
  }

  openSignUpPage(){
    let signUpPage = this.modalCtrl.create(SignUpPage);
    signUpPage.present();
  }
}
