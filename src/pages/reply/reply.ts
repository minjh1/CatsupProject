import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams,Events, PopoverController, ViewController,AlertController } from 'ionic-angular';
import { Reply } from '../../models/reply';
import { Content } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { UserData } from '../../providers/user-data'
import { MyReplyPopPage } from '../pop_over/my_reply_pop';
import { OtherReplyPopPage } from '../pop_over/other_reply_pop';
import { MyPage } from '../mypage/mypage';

@Component({
  selector: 'page-reply',
  templateUrl: 'reply.html',
})
export class ReplyPage {
  @ViewChild(Content) content: Content;

  replyType: number; //0:글, 1:냥로필, 2:포스트
  seq: number;
  serverURL: string;
  user_seq: number;
  replyPlus : number = 10;
  getReplyCount : number;

  replies: Reply[] = [];
  iconColor: string = "LightGrayCat";
  reply_text: string;
  OpenReplyindex;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public userData: UserData,
    public popoverCtrl: PopoverController,
    public viewCtrl: ViewController,
    public alertCtrl:AlertController,
    public events: Events
  ) {
    this.serverURL = this.userData.serverURL;
    this.replyType = this.navParams.get("replyType"); //게시글?프로필?
    this.seq = this.navParams.get("seq");

  }
  ionViewDidLoad() {
    this.getReplyCount=0;
    switch(this.replyType){
      case 0:
        this.getReplies(this.replyPlus, 0, this.seq, '/getFeedReplies')
      break;
      case 1:
        this.getReplies(this.replyPlus, 0, this.seq, '/getCatReplies');
      break;
      case 2:
        this.getReplies(this.replyPlus, 0, this.seq, '/getPostReplies');
      break;
    }
    setTimeout(()=>{this.content.scrollToBottom()},150);
    this.user_seq= this.userData.userSeq;
  }
  dismiss() {
    this.viewCtrl.dismiss() //페이지 끔
  }/*
  ionViewWillLeave() {
    this.viewCtrl.dismiss({count:this.addCount-this.delCount})
  }*/
  getReplies(limit, offset, seq, action) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      limit: limit,
      offset: offset,
      seq: seq,
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
  clickReply(reply) {
    if (this.userData.userSeq == reply.user_seq) { //내 댓글
      if(reply.content.indexOf("프로필을 수정하였습니다.")==-1){
        this.presentPopover(MyReplyPopPage, reply);
      }
    } else { //다른 사람 글
      this.presentPopover(OtherReplyPopPage, reply);
    }
  }
  presentPopover(PageName, reply) {
    let popover = this.popoverCtrl.create(PageName);
    popover.onDidDismiss(data => {
      if (data != null) {
        if (data == "delete_reply") { //글삭제
          this.deleteReply(reply.reply_seq);
        }
        else if (data == "modify_reply") { //글수정
          this.modifyReply(reply);
        }
        else if (data=="user_check"){ //글신고
          this.openOtherUserPage(reply.user_seq);
        }else{
          this.reportReply(data, reply.reply_seq, reply.user_seq);
        }
      }

    });
    popover.present();
  }
  deleteReply(reply_seq) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      reply_type: this.replyType,
      reply_seq: reply_seq
    }

    this.http.post(this.serverURL + '/deleteReply', JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if (data == "success") {
          this.replies = [];
          switch(this.replyType){
            case 0:
            this.getReplies(this.replyPlus, 0, this.seq, '/getFeedReplies');
            this.events.publish('reply:changed',-1,this.navParams.get("feed"));
            break;
            case 1:
            this.getReplies(this.replyPlus, 0, this.seq, '/getCatReplies');
            this.events.publish('catReply:changed',this.seq,-1);
            break;
            case 2:
            this.getReplies(this.replyPlus, 0, this.seq, '/getPostReplies');
            this.events.publish('postReply:changed',this.seq,-1);
            break;
          }
        } else {
          //  this.showAlert("글을 삭제하지 못하였습니다.")
        }
        setTimeout(()=>{this.content.scrollToBottom(0)},100);
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
  modifyReply(reply) {

  }
  reportReply(data, reply_seq, user_seq) {
    var type;
    switch(this.replyType){
      case 0:
        type=1;
      break;
      case 1:
        type=3;
      break;
      case 2:
        type=4;
      break;
    }

    let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let body = {
          reporter_seq: this.userData.userSeq, //신고자(나)
          wr_type: type, //0:글, 1:글 댓글, 2: 냥이, 3:냥로필 댓글, 4: 포스트 댓글
          its_seq: reply_seq,
          user_seq: user_seq,
          content: data
        }

        this.http.post(this.serverURL + '/report', JSON.stringify(body), { headers: headers })
          .map(res => res.json())
          .subscribe(data => {
            if (data == "success") {
              this.showAlert("신고가 접수되었습니다.");
            } else {
              this.showAlert("신고에 실패하였습니다.");
            }
          }, error => {
            console.log(JSON.stringify(error.json()));
          })

  }
  showAlert(text: string) {
    let alert = this.alertCtrl.create({
      title: '알림',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
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
          switch(this.replyType){
            case 0:
              this.getReplies(this.replyPlus, 0, this.seq, '/getFeedReplies');
              this.events.publish('reply:changed',1,this.navParams.get("feed"));
            break;
            case 1:
              this.getReplies(this.replyPlus, 0, this.seq, '/getCatReplies');
              this.events.publish('catReply:changed',this.seq,1);
            break;
            case 2:
              this.getReplies(this.replyPlus, 0, this.seq, '/getPostReplies');
              this.events.publish('postReply:changed',this.seq,1);
            break;
          }

          this.reply_text = "";
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
      case 2:
      this.getReplies(this.replyPlus, this.getReplyCount, this.seq, '/getPostReplies');
      break;
    }
   setTimeout(() => {
     refresher.complete();
   }, 300);
 }
 openOtherUserPage(user_seq) {
   this.navCtrl.push(MyPage, { pageType: 1, user_seq:user_seq });
 }
}
