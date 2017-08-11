import { Component } from '@angular/core';
import { NavController, ViewController, PopoverController,AlertController  } from 'ionic-angular';
import { Feed } from '../../models/feed';
import { ReplyPage } from '../reply/reply';
import { Http, Headers } from '@angular/http';
import { MyPopoverPage } from '../pop_over/my_pop_over';
import { OtherPopoverPage } from '../pop_over/other_pop_over';
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
    public userData: UserData,
  public alertCtrl: AlertController, ) {
  }
  ionViewDidLoad() {

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
          var text_cut = data[i].content.indexOf('\n');
          var content_preview, content_temp;
          if (text_cut==-1 || text_cut > 90){ // 엔터없으면 90자까지 표시
            content_preview = data[i].content.substr(0, 90);
          }else{ //있음
            var count=2; //최대 3줄 표시
            while(count--){
              content_temp = data[i].content.substr(text_cut+1,50);
              var text_cut_temp = content_temp.indexOf('\n');
              if (text_cut_temp == -1){
                break;
              }
              text_cut += text_cut_temp+1;
            }
            content_preview = data[i].content.substr(0,text_cut);
          }
          if (data[i].userImg.indexOf("/") == 0) {
            this.feeds.push(new Feed(data[i].wr_seq, data[i].type, data[i].cat_seq, this.serverURL + data[i].catImg, data[i].catName,
              data[i].user_seq, this.serverURL + data[i].userImg, data[i].userName, data[i].imgUrl,content_preview,data[i].content, data[i].create_date,
              data[i].likeCount, data[i].replyCount));
          }
          else {

            this.feeds.push(new Feed(data[i].wr_seq, data[i].type, data[i].cat_seq, this.serverURL + data[i].catImg, data[i].catName,
              data[i].user_seq, data[i].userImg, data[i].userName, data[i].imgUrl,content_preview,data[i].content, data[i].create_date,
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
  deleteFeed(wr_seq){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      wr_seq: wr_seq
    }

    this.http.post(this.serverURL + '/deleteFeed', JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if(data=="success"){
          this.navCtrl.parent.select(0); //새로고침
        }else{
          this.showAlert("글을 삭제하지 못하였습니다.")
        }
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
  modifyFeed(wr_seq){

  }
  openPopover(wr_seq, user_seq) {
    if (this.userData.userSeq == user_seq) { //내글
      this.presentPopover(MyPopoverPage, wr_seq, user_seq);

    } else { //다른 사람 글
      this.presentPopover(OtherPopoverPage, wr_seq, user_seq);
    }
  }
  presentPopover(PageName, wr_seq, user_seq){
    let popover = this.popoverCtrl.create(PageName);
    popover.onDidDismiss(data=>{
      if(data!=null){
        if (data=="delete_feed"){ //글삭제
          this.deleteFeed(wr_seq);
        }
        else if (data=="modify_feed"){ //글수정
          this.modifyFeed(wr_seq);
        }
        else{ //글신고
          this.reportFeed(data,wr_seq,user_seq);
        }
      }

    });
    popover.present();
  }
  showAlert(text: string) {
    let alert = this.alertCtrl.create({
      title: '알림',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  reportFeed(content, wr_seq, user_seq){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      reporter_seq:this.userData.userSeq, //신고자(나)
      wr_type: 0, //0:글, 1:글 댓글, 2: 냥이, 3:냥로필 댓글
      its_seq:wr_seq,
      user_seq:user_seq,
      content:content
    }

    this.http.post(this.serverURL + '/report', JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if(data=="success"){
          this.showAlert("신고가 접수되었습니다.");
        }else{
          this.showAlert("신고에 실패하였습니다.");
        }
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
  content_more(feed){
    feed.content_more=true;
  }
}
