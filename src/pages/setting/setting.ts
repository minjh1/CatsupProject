import { Component } from '@angular/core';
import { NavController, NavParams,ModalController,App } from 'ionic-angular';
import { UserData } from '../../providers/user-data'
import { TutorialPage } from '../tutorial/tutorial';
import { User } from '../../models/user';

import { UserModPage } from '../user-mod/user-mod';


/**
 * Generated class for the SettingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  user: User;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userData: UserData,
    public modalCtrl: ModalController,
    public app:App) {
      this.user = this.navParams.get('user');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }
  OpenUserModPage(){
      let modal = this.modalCtrl.create(UserModPage, {user:this.user});
      modal.onDidDismiss(data => {
        if (data != null) {
          this.navCtrl.pop();
        }
      })
      modal.present();
  }
  Logout(){
    this.userData.logout();
    this.navCtrl.parent.parent.setRoot(TutorialPage);
  }
}
