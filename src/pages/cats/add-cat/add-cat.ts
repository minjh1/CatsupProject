import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'page-add-cat',
  templateUrl: 'add-cat.html',
})
export class AddCat {
  catinfo :
  {
    imgUrl?:string,
    name?:string,
    sex?:number,
    habitat?:string,
    info1?:string,
    info2?:string,
    info3?:string,
  } = {};
  submitted=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.catinfo.imgUrl="assets/img/plus.png";
  }

  dismiss(){
    this.viewCtrl.dismiss() //페이지 끔
  }
  onSubmit(form: NgForm){
    this.submitted =true;
    if (form.valid){

      this.viewCtrl.dismiss();
    }
  }

}
