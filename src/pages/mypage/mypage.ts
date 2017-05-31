import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { UserData } from '../../providers/user-data'
import { Feed } from '../../models/feed';

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
  user_seq: number;
  id: string;
  nickname: string;
  image_url: string;
  memo: string;
  cat_count: number;
  feed_count: number;
  catsup_count: number;

  feeds: Feed[] = [];
  serverURL: string = 'http://45.249.160.73:5555';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public userData: UserData) {
    this.getUserData();
    //this.getUserFeeds(0,15);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Mypage');
  }
  getUserData() {
    this.userData.getUserSeq().then(
      (seq) => {
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
            this.user_seq = seq;
            this.id = data.id;
            this.nickname = data.nickname;
            this.image_url = data.image_url;
            this.memo = data.memo;
            this.cat_count = data.catCount;
            this.feed_count = data.feed;
            this.catsup_count = data.catsup;
            //  this.user = new User(seq,data.id,data.nickname,this.serverURL+data.image_url,data.memo,data.catCount,data.feed,data.catsup);
          }, error => {
            console.log(JSON.stringify(error.json()));
          })
      }
    );
  }
  getUserFeeds(offset: number, limit: number) {
    this.userData.getUserSeq().then(
      (seq) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let body = {
          seq: seq,
          limit: limit,
          offset: offset,
        }

        this.http.post(this.serverURL + '/getUserFeeds', JSON.stringify(body), { headers: headers })
          .map(res => res.json())
          .subscribe(data => {
            for (let i = 0; i < data.length; i++) {
              this.feeds.push(new Feed(data[i].wr_seq, data[i].type, data[i].cat_seq, this.serverURL + data[i].catImg, data[i].catName,
                data[i].user_seq, this.serverURL + data[i].userImg, data[i].userName, data[i].imgUrl, data[i].content, data[i].create_date,
                data[i].likeCount, data[i].replyCount));
            }
          }, error => {
            console.log(JSON.stringify(error.json()));
          })
      });
  }


}
