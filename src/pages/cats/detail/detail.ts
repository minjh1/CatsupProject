import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular'
import { Cat } from '../../../models/cat';
@Component ({
  templateUrl: 'detail.html',
})

export class CatProfilePage{
  cat: Cat;
  constructor(public navParams: NavParams) {
    this.cat = this.navParams.get("cat");
  }
}
