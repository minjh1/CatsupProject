import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Cat } from '../../models/cat';
import { CatProfilePage } from './detail/detail';
import { AddCat } from './add-cat/add-cat';
import { Http, Headers } from '@angular/http';
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
  serverURL:string = 'http://45.249.160.73:5555';
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, public modalCtrl:ModalController) {
    this.getCats(0,4);
    /*
      this.cats.push(new Cat('assets/img/cat1.png','까치','나비','순둥이','금오공대','흰 털에 검은무늬'));
      this.cats.push(new Cat('assets/img/cat3.png','냥냥이','노랑이','마요','대구 XX동', '옅은 노랑, 친근함'));
      this.cats.push(new Cat('assets/img/bob.png','Bob','','','London','목도리를 하고있음'));
      */
  }
  getCats(offset:number, limit:number){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      limit: limit,
      offset: offset,
    }

    this.http.post(this.serverURL+'/getCatList', JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        for (let i =0; i < data.length; i++) {
          this.cats.push(new Cat(data[i].cat_seq, this.serverURL + data[i].avatar, data[i].nameCount, data[i].nameArray,
            data[i].countArray, data[i].sex, data[i].habitat, data[i].info1, data[i].info2, data[i].info3,
            data[i].create_date, data[i].connection));
        }
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }

  openAddCatPage(){
    let addCatPage = this.modalCtrl.create(AddCat);
    addCatPage.present();
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
