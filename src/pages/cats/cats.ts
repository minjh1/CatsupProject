import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Cat } from '../../models/cat';

/**
 * Generated class for the Cats page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-cats',
  templateUrl: 'cats.html',
})
export class CatsPage {
  cats : Cat[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.cats.push(new Cat('assets/img/cat1.png','까치','까치까치'));
    this.cats.push(new Cat('assets/img/cat2.png','냥냥이','냥냥냥냥냥'));
    this.cats.push(new Cat('assets/img/cat3.png','나비','냥냥'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Cats');
  }

}
