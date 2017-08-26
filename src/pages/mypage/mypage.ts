import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { UserData } from '../../providers/user-data'
import { Feed } from '../../models/feed';
import { MyCatPage } from '../mycat/mycat';

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
  pageType: number ; //0:나, 1:타인
  user_seq: number;
  id: string;
  nickname: string;
  image_url: string;
  memo: string;
  cat_count: number;
  feed_count: number;
  catsup_count: number;
  feedPlus:number = 15;

  feeds: Array<Feed> = [];
  getFeedCount: number;
  more:boolean = true;
  serverURL: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public userData: UserData,
    public modalCtrl: ModalController) {
    this.serverURL = this.userData.serverURL;
    if(this.navParams.get("pageType") == null){
      this.pageType = 0;
    }else{
      this.pageType = this.navParams.get("pageType");
    }
  }

  ionViewDidLoad() {
    this.getFeedCount = 0;
    if (this.pageType == 0) {
      this.user_seq = this.userData.userSeq;
      this.getUserData(this.user_seq);
      this.getUserFeeds(0, this.feedPlus, this.user_seq);
    } else {
      this.user_seq = this.navParams.get("user_seq");
      this.getUserData(this.user_seq);
      this.getUserFeeds(0, this.feedPlus, this.user_seq);
    }
  }
  getUserData(seq: number) {

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
        this.nickname = data.nickname;
        if (data.image_url.indexOf("/") == 0) { //서버이미지. 페북 계정 유저가 아님
          this.image_url = this.serverURL + data.image_url;
          this.id = data.id;
        } else { //페북유저
          this.id = data.nickname;
          this.image_url = data.image_url;
        }
        this.memo = data.memo;
        this.cat_count = data.catCount;
        this.feed_count = data.feed;
        this.catsup_count = data.catsup;
        //  this.user = new User(seq,data.id,data.nickname,this.serverURL+data.image_url,data.memo,data.catCount,data.feed,data.catsup);
      }, error => {
        console.log(JSON.stringify(error.json()));
      })

  }
  getUserFeeds(offset: number, limit: number, seq: number) {

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
        console.log(data.length);
        for (let i = 0; i < data.length; i++) {
          var text_cut = data[i].content.indexOf('\n');
          var content_preview, content_temp;
          if (text_cut == -1 || text_cut > 90) { // 엔터없으면 90자까지 표시
            content_preview = data[i].content.substr(0, 90);
          } else { //있음
            var count = 2; //최대 3줄 표시
            while (count--) {
              content_temp = data[i].content.substr(text_cut + 1, 50);
              var text_cut_temp = content_temp.indexOf('\n');
              if (text_cut_temp == -1) {
                break;
              }
              text_cut += text_cut_temp + 1;
            }
            content_preview = data[i].content.substr(0, text_cut);
          }

          if (data[i].like_users.indexOf(this.userData.userSeq) == -1) {
            var isLiked = false;
          } else {
            var isLiked = true;
          }
          this.feeds.push(new Feed(data[i].wr_seq, data[i].type, data[i].cat_seq, this.serverURL + data[i].catImg, data[i].catName,
            data[i].user_seq, this.serverURL + data[i].userImg, data[i].userName, data[i].imgUrl, content_preview, data[i].content, data[i].create_date,
            data[i].likeCount, isLiked, data[i].replyCount));
        }
        this.getFeedCount += data.length;
        if(data.length < this.feedPlus){
          this.more=false;
        }
      }, error => {
        console.log(JSON.stringify(error.json()));
      })

  }
  openMyCatPage() {
    this.navCtrl.push(MyCatPage, { pageType: 1, user_seq:this.user_seq });
  }
  doRefresh(refresher) {
    this.feeds = [];
    this.getFeedCount = 0;
    this.getUserData(this.user_seq);
    this.getUserFeeds(0, this.feedPlus, this.user_seq);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 1000);
  }
  doInfinite(infiniteScroll) {
    this.getUserFeeds(this.getFeedCount, this.feedPlus, this.user_seq);
    setTimeout(() => {
      infiniteScroll.complete();
    }, 500);
  }
}
