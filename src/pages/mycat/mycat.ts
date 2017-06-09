import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { MyCat } from '../../models/myCat';
import { CatProfilePage } from '../cats/detail/detail'
import { Http, Headers } from '@angular/http';
import { UserData } from '../../providers/user-data'

import 'rxjs/add/operator/map';

@Component({
  selector: 'page-mycat',
  templateUrl: 'mycat.html',
})
export class MyCatPage {
  pageType: number; //0:글쓰기에서, 1:마이페이지에서
  cats: MyCat[] = [];
  user_seq: number;
  serverURL: string = 'http://45.249.160.73:5555';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public modalCtrl: ModalController,
    public userData: UserData,
    public viewCtrl: ViewController,
  ) {
    this.pageType = this.navParams.get("pageType");
    this.userData.getUserSeq().then(
      (seq) => {
        this.user_seq = seq;
        this.getMyCats(0, 20, seq);
      });
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
  select_dismiss(cat) {
    this.viewCtrl.dismiss(cat); //페이지 끔
  }
  getMyCats(offset: number, limit: number, user_seq: number) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      limit: limit,
      offset: offset,
      seq: user_seq,
    }
    this.http.post(this.serverURL + '/getMyCatList', JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if (data.result == false) {
        } else {
          for (let i = 0; i < data.length; i++) {
            this.cats.push(new MyCat(data[i].cat_seq, data[i].name,
              this.serverURL + data[i].avatar,
              data[i].habitat, data[i].info1));
          }
        }
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
  selectCat(cat) {
    if (this.pageType == 0) { //글쓰기
      this.select_dismiss(cat);
    } else { //마이페이지

    }
  }
  openDetailPage(cat) {
    this.navCtrl.push(CatProfilePage, {
      cat: cat,
    });
  }
  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    /*
       setTimeout(() => {
         for (let i = 0; i < 30; i++) {
           this.items.push( this.items.length );
         }

         console.log('Async operation has ended');
         infiniteScroll.complete();
       }, 500);
       */
  }


}
