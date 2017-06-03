import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Autosize} from 'ionic2-autosize';

@Component({
  selector: 'page-contact',
  templateUrl: 'write.html',
})
export class WritePage {
  write_content:
  {
    cat_seq?: number,
    user_seq?: number,
    cat_img?: string,
    cat_name?: string
    content?: string,
    photos?: Array<string>,
  } = {};
  submitted = false;
  constructor(public navCtrl: NavController) {
    this.write_content.photos = [];
    this.write_content.photos[0]="assets/img/add.png";
    this.write_content.cat_img = "assets/img/add.png";
  }

  select_cat() {
    alert("!!");
  }
}
