import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, PopoverController, ViewController } from 'ionic-angular';
import { Reply } from '../../models/reply';
import { Content } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { UserData } from '../../providers/user-data'
import { MyReplyPopPage } from '../pop_over/my_reply_pop';
import { OtherReplyPopPage } from '../pop_over/other_reply_pop';

@Component({
  selector: 'page-reply',
  templateUrl: 'reply.html',
})
export class ReplyPage {
  @ViewChild(Content) content: Content;

  replyType: number; //0:글, 1:냥로필
  seq: number;
  serverURL: string;
  user_seq: number;
  replyPlus : number = 10;
  getReplyCount : number;
  addCount : number =0;
  delCount : number =0;

  replies: Reply[] = [];
  iconColor: string = "LightGrayCat";
  reply_text: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public userData: UserData,
    public popoverCtrl: PopoverController,
    public viewCtrl: ViewController,
  ) {
    this.serverURL = this.userData.serverURL;
    this.replyType = this.navParams.get("replyType"); //게시글?프로필?
    this.seq = this.navParams.get("seq");

  }
  ionViewDidLoad() {
    this.getReplyCount=0;
    if (this.replyType == 0) { //글이면
      this.getReplies(this.replyPlus, 0, this.seq, '/getFeedReplies')
    } else { //고양이 프로필이면
      this.getReplies(this.replyPlus, 0, this.seq, '/getCatRelies');
    }
    setTimeout(()=>{this.content.scrollToBottom()},150);
    this.user_seq= this.userData.userSeq;
  }
  dismiss() {
    this.viewCtrl.dismiss({count:this.addCount-this.delCount}) //페이지 끔
  }
  ionViewWillLeave() {
    this.viewCtrl.dismiss({count:this.addCount-this.delCount})
  }
  getReplies(limit, offset, seq, action) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      limit: limit,
      offset: offset,
      wr_seq: seq,
    }

    this.http.post(this.serverURL + action, JSON.stringify(body),
      { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].imgUrl.indexOf("/") == 0) {
            this.replies.push(new Reply(data[i].reply_seq, this.serverURL + data[i].imgUrl,
              data[i].user_seq, data[i].nickname,
              data[i].content, data[i].create_date));
          }
          else {
            this.replies.push(new Reply(data[i].reply_seq, data[i].imgUrl,
              data[i].user_seq, data[i].nickname,
              data[i].content, data[i].create_date));
          }
        }
        this.getReplyCount+=data.length;
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
  getCatRelies(limit, offset, seq) {

  }
  clickReply(reply) {
    if (this.userData.userSeq == reply.user_seq) { //내 댓글
      this.presentPopover(MyReplyPopPage, reply.reply_seq, reply.user_seq);

    } else { //다른 사람 글
      this.presentPopover(OtherReplyPopPage, reply.reply_seq, reply.user_seq);
    }
  }
  presentPopover(PageName, reply_seq, user_seq) {
    let popover = this.popoverCtrl.create(PageName);
    popover.onDidDismiss(data => {
      if (data != null) {
        if (data == "delete_reply") { //글삭제
          if(this.replyType == 0){
            this.deleteReply(reply_seq, '/deleteReply');
          }else if (this.replyType==1){
            this.deleteReply(reply_seq, '/deleteCatReply');
          }
        }
        else if (data == "modify_reply") { //글수정
          switch(this.replyType){
            case 0:
              this.modifyReply(reply_seq, '/modifyFeedReply');
            break;
            case 1:
              this.modifyReply(reply_seq, '/modifyCatReply');
            break;
          }

        }
        else { //글신고
          this.reportReply(data, reply_seq, user_seq);
        }
      }

    });
    popover.present();
  }
  deleteReply(reply_seq, action) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      reply_type: this.replyType,
      reply_seq: reply_seq
    }

    this.http.post(this.serverURL + action, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if (data == "success") {
          this.replies = [];
          if (this.replyType == 0) {
            this.getReplies(this.replyPlus, 0, this.seq, '/getFeedReplies');
          } else if (this.replyType == 1) {
            this.getReplies(this.replyPlus, 0, this.seq, '/getCatRelies');
          }
        } else {
          //  this.showAlert("글을 삭제하지 못하였습니다.")
        }
        setTimeout(()=>{this.content.scrollToBottom(0)},100);
        this.delCount++;
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
  modifyReply(reply_seq, action) {

  }
  reportReply(data, reply_seq, user_seq) {

  }
  colorChange() {
    if (this.reply_text != "") {
      this.iconColor = "OrangeCat2";
    } else {
      this.iconColor = "LightGrayCat";
    }
  }
  addReply() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      type: this.replyType,
      seq: this.seq,
      user_seq: this.user_seq,
      content: this.reply_text,
    }
    if (this.reply_text != "") {
      this.http.post(this.serverURL + '/addReply', JSON.stringify(body),
        { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          this.replies = [];
          this.getReplyCount=0;
          if (this.replyType == 0) {
            this.getReplies(this.replyPlus, 0, this.seq, '/getFeedReplies');
          } else if (this.replyType == 1) {
            this.getReplies(this.replyPlus, 0, this.seq, 'getCatRelies');
          }
          this.reply_text = "";
          this.addCount++;
          setTimeout(()=>{this.content.scrollToBottom(0)},100);
        }, error => {
          console.log(JSON.stringify(error.json()));
        })
    }
  }
  doRefresh(refresher) {
    switch(this.replyType){
      case 0:
      this.getReplies(this.replyPlus, this.getReplyCount, this.seq, '/getFeedReplies');
      break;
      case 1:
      this.getReplies(this.replyPlus, this.getReplyCount, this.seq, '/getCatReplies');
      break;
    }
   setTimeout(() => {
     refresher.complete();
   }, 300);
 }
}
