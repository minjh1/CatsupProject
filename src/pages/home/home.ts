import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Feed } from '../../models/feed';
import { ReplyPage } from '../reply/reply';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  feeds: Feed[] = [];
  serverURL: string = 'http://45.249.160.73:5555';

  constructor(public navCtrl: NavController, private http: Http) {
    console.log("home");
    this.getFeeds(0, 6);
  }

  getFeeds(offset: number, limit: number) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      limit: limit,
      offset: offset,
    }

    this.http.post(this.serverURL + '/getFeeds', JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          this.feeds.push(new Feed(data[i].wr_seq, data[i].type, data[i].cat_seq, this.serverURL+data[i].catImg, data[i].catName,
            data[i].user_seq, this.serverURL+data[i].userImg, data[i].userName, data[i].imgUrl, data[i].content, data[i].create_date,
            data[i].likeCount, data[i].replyCount));
        }
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }

  openReplyPage(replyType, seq) {
    this.navCtrl.push(ReplyPage, {
      replyType: replyType,
      seq: seq
    });
  }
}
