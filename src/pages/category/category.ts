import { Component } from '@angular/core';
import { NavController, NavParams,ViewController,LoadingController } from 'ionic-angular';

import { Area1 } from '../../models/area1';
import { Area2 } from '../../models/area2';
import 'rxjs/add/operator/map';
import { Http, Headers } from '@angular/http';
import { UserData } from '../../providers/user-data'
/**
 * Generated class for the CategoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  title:string;
  pageType: number; //0: 홈/캣리스트에서 , 1: 캣추가에서
  area1:Area1[]=[];
  area2:Area2[]=[]; //상세지역
  oldSelectedArea : number =0;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public userData: UserData,
    ) {
      this.pageType=this.navParams.get('pageType');
      if(this.pageType==0){
        this.title="지역 모아보기";
      }else{
        this.title="서식 지역 선택";
      }
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad() {
    this.getArea1();
  }
  getArea1() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post(this.userData.serverURL + '/getArea1', {}, { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          this.area1.push(new Area1(data[i].area1_seq, data[i].name, "LightLightGray2"));
        }
        this.getArea2(this.area1[0]);
        this.area1[0].color="WhiteCat";
        this.oldSelectedArea=0;
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
    getArea2(area){
      this.area1[this.oldSelectedArea].color="LightLightGray2";
      this.area1[area.area1seq-1].color="WhiteCat";
      this.oldSelectedArea=area.area1seq-1;
      this.area2=[];
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let body = {
        area1seq: area.area1seq,
      }

      this.http.post(this.userData.serverURL + '/getArea2', JSON.stringify(body), { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          for (let i = 0; i < data.length; i++) {
            this.area2.push(new Area2(data[i].area2_seq,data[i].area1_seq, data[i].name));
          }
        }, error => {
          console.log(JSON.stringify(error.json()));
        })
  }
  selectArea1(){
    this.viewCtrl.dismiss({area1:this.oldSelectedArea+1, area1Name:this.area1[this.oldSelectedArea].name,
      area2:-1, area2Name:""});
  }
  selectArea2(area){
    this.viewCtrl.dismiss({area1:this.oldSelectedArea+1, area1Name:this.area1[this.oldSelectedArea].name,
      area2:area.area2seq, area2Name:area.name});
  }
}
