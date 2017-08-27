import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Cat } from '../../models/cat';
import { CatProfilePage } from './detail/detail';
import { AddCat } from './add-cat/add-cat';
import { Http, Headers } from '@angular/http';
import { UserListPage } from '../user-list/user-list';
import { UserData } from '../../providers/user-data'
import 'rxjs/add/operator/map';

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
  cats: Cat[] = [];
  serverURL: string;
  getCatCount:number;
  more:boolean = true;
  feedPlus:number = 15;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public modalCtrl: ModalController,
    public userData: UserData) {
    this.serverURL = this.userData.serverURL;
  }
  ionViewDidLoad() {
    this.getCatCount=0;
    this.getCats(0, this.feedPlus);
  }
  getCats(offset: number, limit: number) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      limit: limit,
      offset: offset,
    }

    this.http.post(this.serverURL + '/getCatList', JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          this.cats.push(new Cat(data[i].cat_seq, this.serverURL + data[i].avatar, data[i].nameCount, data[i].nameArray,
            data[i].countArray, data[i].sex, data[i].habitat, data[i].latitude, data[i].longitude, data[i].info1, data[i].info2, data[i].info3,
            data[i].create_date, data[i].connection, data[i].replyCount));
        }
        this.getCatCount+=data.length;
        if(data.length < this.feedPlus){
          this.more=false;
        }
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }

  openAddCatPage() {
    let addCatPage = this.modalCtrl.create(AddCat);
    addCatPage.onDidDismiss(data => {

      this.navCtrl.parent.select(3); //새로고침
    });
    addCatPage.present();
  }
  openDetailPage(cat) {
    this.navCtrl.push(CatProfilePage, {
      cat: cat,
    });
  }
  doInfinite(infiniteScroll) {
    this.getCats(this.getCatCount, 15);
       setTimeout(() => {
         infiniteScroll.complete();
       }, 500);
  }
  doRefresh(refresher) {
    this.cats = [];
    this.getCatCount=0;
    this.getCats(0, this.feedPlus);
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 1000);
  }

}
