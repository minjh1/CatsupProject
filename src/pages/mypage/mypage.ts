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

  p_width: number;

  images: Array<string> = [];
  grid: Array<Array<string>>; //array of arrays
  rowNum:number;

  feeds: Array<Feed> = [];
  getFeedCount:number;

  serverURL: string = 'http://45.249.160.73:5555';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public userData: UserData) {
    this.getUserData();
    this.grid = Array(Math.ceil(this.images.length / 3)); //MATHS!
    this.rowNum = 0; //counter to iterate over the rows in the grid
    this.getFeedCount=0;
    /*
        platform.ready().then((readySource) => {
          this.p_width = platform.width();
          console.log('Width: ' + platform.width() / 3);
          console.log('Height: ' + platform.height());
        });
    */


    this.getUserFeeds(0,15);
/*

    this.images.push("http://45.249.160.73:5555/image/jb.png");
    this.images.push("http://45.249.160.73:5555/image/im1.png");
    this.images.push("http://45.249.160.73:5555/image/jb.png");
    this.images.push("http://45.249.160.73:5555/image/jb3.png");
    this.images.push("http://45.249.160.73:5555/image/im4.png");
    this.images.push("http://45.249.160.73:5555/image/jb3.png");
    this.images.push("http://45.249.160.73:5555/image/jb.png");
    this.images.push("http://cfile27.uf.tistory.com/image/2113BB4E5397AF581E92D2");
    this.images.push("http://45.249.160.73:5555/image/im1.png");
    this.images.push("http://45.249.160.73:5555/image/jb.png");
    this.images.push("http://45.249.160.73:5555/image/jb3.png");
    this.images.push("http://45.249.160.73:5555/image/im4.png");
    this.images.push("http://45.249.160.73:5555/image/jb3.png");

    this.grid = Array(Math.ceil(this.images.length / 3)); //MATHS!
    let rowNum = 0; //counter to iterate over the rows in the grid

    for (let i = 0; i < this.images.length; i += 3) { //iterate images
      this.grid[rowNum] = Array(3); //declare three elements per row
      if (this.images[i]) { //check file URI exists
        this.grid[rowNum][0] = this.images[i] //insert image
      }
      if (this.images[i + 1]) { //repeat for the second image
        this.grid[rowNum][1] = this.images[i + 1]
      }else{
        this.grid[rowNum][1] = "http://homepages.neiu.edu/~whuang2/cs300/images/white.png"
      }
      if (this.images[i + 2]) { //repeat for the second image
        this.grid[rowNum][2] = this.images[i + 2]
      }else{
        this.grid[rowNum][2] = "http://homepages.neiu.edu/~whuang2/cs300/images/white.png"
      }
      rowNum++; //go on to the next row
    }
*/

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

            for (let i = this.getFeedCount; i < this.getFeedCount+data.length; i += 3) { //iterate images
              this.grid[this.rowNum] = Array(3); //declare three elements per row
              if (this.feeds[i]) { //check file URI exists
                this.grid[this.rowNum][0] = this.serverURL + this.feeds[i].imgUrl[0] //insert image
              }
              if (this.feeds[i+1]) { //repeat for the second image
                this.grid[this.rowNum][1] = this.serverURL + this.feeds[i+1].imgUrl[0]
              }else{
                this.grid[this.rowNum][1] = "http://homepages.neiu.edu/~whuang2/cs300/images/white.png"
              }
              if (this.feeds[i+2]) { //repeat for the second image
                this.grid[this.rowNum][2] = this.serverURL + this.feeds[i+2].imgUrl[0]
              }else{
                this.grid[this.rowNum][2] = "http://homepages.neiu.edu/~whuang2/cs300/images/white.png"
              }
              this.rowNum++; //go on to the next row
            }
            this.getFeedCount+=data.length;

          }, error => {
            console.log(JSON.stringify(error.json()));
          })
      });
  }


}
