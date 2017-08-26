import { Component, ViewChild } from '@angular/core';

import { NavController, Slides, ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
import { NgForm } from '@angular/forms';

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
    this.storage.set('hasSeenTutorial', 'true');
    let loginPage = this.modalCtrl.create(LoginPage);
    loginPage.present();
  }
}
