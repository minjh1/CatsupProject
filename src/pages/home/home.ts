import { Component } from '@angular/core';
import { NavController, ViewController, PopoverController, AlertController, ModalController,ToastController } from 'ionic-angular';
import { Feed } from '../../models/feed';
import { ReplyPage } from '../reply/reply';
import { UserListPage } from '../user-list/user-list';
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
  serverURL: string;
  getFeedCount: number;
  constructor(
    public navCtrl: NavController,
    private http: Http,
    public popoverCtrl: PopoverController,
    public userData: UserData,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,) {
    this.serverURL = this.userData.serverURL;
  }
  ionViewDidLoad() {
    this.getFeedCount = 0;
    this.getFeeds(0, 10);
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

          if (data[i].like_users.indexOf(""+this.userData.userSeq) == -1) {
            var isLiked = false;
          } else {
            var isLiked = true;
          }
          if (data[i].userImg.indexOf("/") == 0) {
            this.feeds.push(new Feed(data[i].wr_seq, data[i].type, data[i].cat_seq, this.serverURL + data[i].catImg, data[i].catName,
              data[i].user_seq, this.serverURL + data[i].userImg, data[i].userName, data[i].imgUrl, content_preview, data[i].content, data[i].create_date,
              data[i].likeCount, isLiked, data[i].replyCount));
          }
          else {
            this.feeds.push(new Feed(data[i].wr_seq, data[i].type, data[i].cat_seq, this.serverURL + data[i].catImg, data[i].catName,
              data[i].user_seq, data[i].userImg, data[i].userName, data[i].imgUrl, content_preview, data[i].content, data[i].create_date,
              data[i].likeCount, isLiked, data[i].replyCount));
          }

        }
        this.getFeedCount += data.length;
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }

  openReplyPage(replyType, seq) {
    let modal = this.modalCtrl.create(ReplyPage, {
      replyType: replyType,
      seq: seq
    });
    modal.onDidDismiss(data => {
      if (data != null) {

      }
    })
    modal.present();
  }
  deleteFeed(wr_seq) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      wr_seq: wr_seq
    }
    this.http.post(this.serverURL + '/deleteFeed', JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if (data == "success") {
          this.navCtrl.parent.select(0); //새로고침
        } else {
          this.showAlert("글을 삭제하지 못하였습니다.")
        }
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
  modifyFeed(wr_seq) {

  }
  openPopover(wr_seq, user_seq) {
    if (this.userData.userSeq == user_seq) { //내글
      this.presentPopover(MyPopoverPage, wr_seq, user_seq);

    } else { //다른 사람 글
      this.presentPopover(OtherPopoverPage, wr_seq, user_seq);
    }
  }
  presentPopover(PageName, wr_seq, user_seq) {
    let popover = this.popoverCtrl.create(PageName);
    popover.onDidDismiss(data => {
      if (data != null) {
        if (data == "delete_feed") { //글삭제
          this.deleteFeed(wr_seq);
        }
        else if (data == "modify_feed") { //글수정
          this.modifyFeed(wr_seq);
        }
        else { //글신고
          this.reportFeed(data, wr_seq, user_seq);
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
  reportFeed(content, wr_seq, user_seq) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      reporter_seq: this.userData.userSeq, //신고자(나)
      wr_type: 0, //0:글, 1:글 댓글, 2: 냥이, 3:냥로필 댓글
      its_seq: wr_seq,
      user_seq: user_seq,
      content: content
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
  content_more(feed) {
    feed.content_more = true;
  }
  doRefresh(refresher) {
    this.getFeedCount = 0;
    this.feeds = [];
    this.getFeeds(0, 10);
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 1200);
  }
  doInfinite(infiniteScroll) {
    this.getFeeds(this.getFeedCount, 10);
    setTimeout(() => {
      infiniteScroll.complete();
    }, 500);
  }
  Like(feed) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      wr_seq: feed.wr_seq,
      user_seq: this.userData.userSeq,
    }
    if(feed.isLiked == true){
      this.http.post(this.serverURL + '/deleteLike', JSON.stringify(body), { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          if (data == "success") {
            feed.isLiked = false;
            feed.likeCount--;
            this.presentToast("CATSUP 취소되었습니다.")
          }
        }, error => {
          console.log(JSON.stringify(error.json()));
        })
    }else{
      this.http.post(this.serverURL + '/addLike', JSON.stringify(body), { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          if (data == "success") {
            feed.isLiked = true;
            feed.likeCount ++;
            this.presentToast("CATSUP! 고맙습니다♡")
          }
        }, error => {
          console.log(JSON.stringify(error.json()));
        })
    }
  }
  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 1000,
      cssClass: "toast",
    });
    toast.present();
  }
  openLikeList(wr_seq){
    this.navCtrl.push(UserListPage, {
      pageType : 0,
      seq: wr_seq,
    });
  }
}
