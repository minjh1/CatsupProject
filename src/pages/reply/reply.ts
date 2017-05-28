import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Reply } from '../../models/reply';
import { Content } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-reply',
  templateUrl: 'reply.html',
})
export class ReplyPage {
  @ViewChild(Content) content: Content;

  replyType: number;
  seq: number;
  serverURL: string = 'http://45.249.160.73:5555';

  replies: Reply[] = [];
  iconColor: string = "LightGrayCat";
  reply_text: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private http: Http) {
    this.replyType = this.navParams.get("replyType"); //게시글?프로필?
    this.seq = this.navParams.get("seq");
    if (this.replyType == 0) { //글이면
      this.getFeedReplies(10,0, this.seq);
    } else { //고양이 프로필이면
      this.getCatRelies(10,0, this.seq);
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad Reply');
  }
  getFeedReplies(limit, offset, seq) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      limit: limit,
      offset: offset,
      wr_seq: seq,
    }

    this.http.post(this.serverURL + '/getFeedReplies', JSON.stringify(body),
    { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          this.replies.push(new Reply(data[i].reply_seq, this.serverURL+data[i].imgUrl,
            data[i].user_seq, data[i].nickname,
            data[i].content, data[i].create_date));
        }
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
  getCatRelies(limit, offset, seq) {

  }
  clickReply() {

  }
  colorChange() {
    if (this.reply_text != "") {
      this.iconColor = "OrangeCat2";
    } else {
      this.iconColor = "LightGrayCat";
    }
  }

}
