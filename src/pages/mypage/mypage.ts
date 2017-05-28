import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { UserData } from '../../providers/user-data'

/**
 * Generated class for the Mypage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-mypage',
  templateUrl: 'mypage.html',
})
export class MyPage {
  nickname:string;
  memo:string;
  friend_cat:number;
  feed_count:number;
  catsup_count:number;
  serverURL: string = 'http://45.249.160.73:5555';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public userData: UserData) {
    this.getUserData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Mypage');
  }
  getUserData(){
    this.userData.getUserSeq().then(
      (seq)=>{
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let body = {
          seq: seq,
        }
        //api로 받은 데이타를 body에 넣음
        this.http.post(this.serverURL + '/getUserData', JSON.stringify(body),
          { headers: headers })
          .map(res => res.json())
          .subscribe(data => {
            if (data.result == true) { //성공
            }
          }, error => {
            console.log(JSON.stringify(error.json()));
          })
      }
    );
  }

}
