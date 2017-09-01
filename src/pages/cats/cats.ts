import { Component } from '@angular/core';
import { NavController, NavParams, ModalController,Events } from 'ionic-angular';
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
  searchValue:string='';
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public modalCtrl: ModalController,
    public userData: UserData,
    public events: Events) {
    this.serverURL = this.userData.serverURL;
    events.subscribe('cat:modified', () => {
      this.cats = [];
      this.getCatCount=0;
      this.getCats(0, this.feedPlus);
    });
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
    });
    addCatPage.present();
  }
  openDetailPage(cat) {
    this.navCtrl.push(CatProfilePage, {
      cat: cat,
    });
  }
  doInfinite(infiniteScroll) {
    if(this.searchValue!=''){
      this.searchCat(this.getCatCount, this.feedPlus, this.searchValue);
    }else{
      this.getCats(this.getCatCount, this.feedPlus);
    }
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
  getItems(ev: any) {
  // Reset items back to all of the items
    this.cats = [];
    this.getCatCount=0;
    // set val to the value of the searchbar
    let val = ev.target.value;
    this.searchValue = val;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.searchCat(0, this.feedPlus, '%'+val+'%');
    }
    else if (val ==''){
      this.getCats(0, this.feedPlus);
    }
  }
  searchCat(offset:number, limit:number, value:string){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      limit: limit,
      offset: offset,
      value: value
    }

    this.http.post(this.serverURL + '/searchCat', JSON.stringify(body), { headers: headers })
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
}
