import { Component } from '@angular/core';
import { NavController, ViewController,PopoverController } from 'ionic-angular';
import { Feed } from '../../models/feed';
import { ReplyPage } from '../reply/reply';
import { Http, Headers } from '@angular/http';
import { MyPopoverPage } from './pop_over/my_pop_over';
import { OtherPopoverPage } from './pop_over/other_pop_over';
import { UserData } from '../../providers/user-data'
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  feeds: Feed[] = [];
  serverURL: string = 'http://45.249.160.73:5555';

  constructor(
    public navCtrl: NavController,
    private http: Http,
    public popoverCtrl: PopoverController,
    public userData: UserData,) {
    this.getFeeds(0, 15);
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
          if (data[i].userImg.indexOf("/") == 0) {
            this.feeds.push(new Feed(data[i].wr_seq, data[i].type, data[i].cat_seq, this.serverURL+data[i].catImg, data[i].catName,
              data[i].user_seq, this.serverURL+data[i].userImg, data[i].userName, data[i].imgUrl, data[i].content, data[i].create_date,
              data[i].likeCount, data[i].replyCount));
          }
          else{
            this.feeds.push(new Feed(data[i].wr_seq, data[i].type, data[i].cat_seq, this.serverURL+data[i].catImg, data[i].catName,
              data[i].user_seq, data[i].userImg, data[i].userName, data[i].imgUrl, data[i].content, data[i].create_date,
              data[i].likeCount, data[i].replyCount));
          }

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
  openPopover(wr_seq, user_seq){
    if(this.userData.userSeq==user_seq){ //내글
      this.presentPopover(MyPopoverPage);
    }else{ //다른 사람 글
      this.presentPopover(OtherPopoverPage);
    }
  }
  presentPopover(PageName) {
    let popover = this.popoverCtrl.create(PageName);
    popover.present();
  }
}
