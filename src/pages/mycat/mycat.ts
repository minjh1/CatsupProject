import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { MyCat } from '../../models/myCat';
import { Cat } from '../../models/cat';
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
  cat: Cat;
  user_seq: number;
  serverURL: string;
  getCatCount: number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public modalCtrl: ModalController,
    public userData: UserData,
    public viewCtrl: ViewController,
  ) {
    this.serverURL = this.userData.serverURL;
    this.pageType = this.navParams.get("pageType");
  }
  ionViewDidLoad() {
    this.getCatCount = 0;
    if(this.pageType==1){
      this.user_seq=this.navParams.get("user_seq");
      this.getMyCats(0, 15, this.user_seq);
    }else{
      this.getMyCats(0, 15, this.userData.userSeq);
    }
  }
  dismiss() {
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
        for (let i = 0; i < data.length; i++) {
          this.cats.push(new MyCat(data[i].cat_seq, data[i].name,
            this.serverURL + data[i].avatar,
            data[i].habitat, data[i].info1));
        }
        this.getCatCount += data.length;
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
  selectCat(cat) {
    if (this.pageType == 0) { //글쓰기
      this.select_dismiss(cat);
    } else { //마이페이지
      this.getCat(cat.seq);
    }
  }

  getCat(cat_seq) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      cat_seq: cat_seq
    }

    this.http.post(this.serverURL + '/getCat', JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.cat = new Cat(data.cat_seq, this.serverURL + data.avatar, data.nameCount, data.nameArray,
          data.countArray, data.sex, data.habitat, data.latitude, data.longitude, data.info1, data.info2, data.info3,
          data.create_date, data.connection);
        this.openDetailPage(this.cat);

      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
  openDetailPage(cat) {
    this.navCtrl.push(CatProfilePage, {
      cat: cat,
    });
  }
  doInfinite(infiniteScroll) {
    this.getMyCats(this.getCatCount, 15, this.userData.userSeq);
    setTimeout(() => {
      infiniteScroll.complete();
    }, 500);

  }


}
