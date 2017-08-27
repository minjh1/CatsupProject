import { Component } from '@angular/core';
import { NavController, NavParams,ViewController, PopoverController, AlertController, ModalController,ToastController } from 'ionic-angular';
import { Feed } from '../../models/feed';
import { ReplyPage } from '../reply/reply';
import { UserListPage } from '../user-list/user-list';
import { Http, Headers } from '@angular/http';
import { MyPopoverPage } from '../pop_over/my_pop_over';
import { OtherPopoverPage } from '../pop_over/other_pop_over';
import { UserData } from '../../providers/user-data'
import { MyPage } from '../mypage/mypage';
import { WritePage } from '../write/write';
import { CatProfilePage } from '../cats/detail/detail'
import { Cat } from '../../models/cat';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  feeds: Feed[] = [];
  serverURL: string;
  pageType : number;
  getFeedCount: number;
  more:boolean = true;
  feedPlus:number = 10;
  constructor(
    public navCtrl: NavController,
    private http: Http,
    public popoverCtrl: PopoverController,
    public userData: UserData,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
  public navParams: NavParams,) {
    this.serverURL = this.userData.serverURL;
    this.pageType=navParams.get('pageType');
    if(this.pageType==1){ //한 피드 확인
      this.more=false;
      this.feeds.push(this.navParams.get('feed'));
    }else{ //홈
      this.pageType=0;
    }
  }
  ionViewDidLoad() {
    if(this.pageType==0){ //홈
      this.getFeedCount = 0;
      this.getFeeds(0, this.feedPlus);
    }
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
          var isLiked;
          console.log(data[i].like_users);
          if (data[i].like_users.indexOf(""+this.userData.userSeq) == -1) {
            isLiked = false;
          } else {
            isLiked = true;
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
        if(data.length < this.feedPlus){
          this.more=false;
        }
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }

  openReplyPage(replyType, feed) {
    let modal = this.modalCtrl.create(ReplyPage, {
      replyType: replyType,
      seq: feed.wr_seq
    });
    modal.onDidDismiss(data => {
      if (data != null) {
        feed.replyCount+=data.count;
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
  modifyFeed(feed) {
    let modal = this.modalCtrl.create(WritePage, {
      pageType: 1,
      feed: feed
    });
    modal.onDidDismiss(data => {
      if (data == true) {
        this.showAlert("수정되었습니다 ^.^");
        this.getFeedCount = 0;
        this.feeds = [];
        this.getFeeds(0, this.feedPlus);
      }
    })
    modal.present();
  }
  openPopover(feed) {
    if (this.userData.userSeq == feed.user_seq) { //내글
      this.presentPopover(MyPopoverPage, feed);

    } else { //다른 사람 글
      this.presentPopover(OtherPopoverPage, feed);
    }
  }
  presentPopover(PageName, feed) {
    let popover = this.popoverCtrl.create(PageName);
    popover.onDidDismiss(data => {
      if (data != null) {
        if (data == "delete_feed") { //글삭제
          this.deleteFeed(feed.wr_seq);
        }
        else if (data == "modify_feed") { //글수정
          this.modifyFeed(feed);
        }
        else { //글신고
          this.reportFeed(data, feed.wr_seq, feed.user_seq);
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
    this.getFeeds(0, this.feedPlus);
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 1200);
  }
  doInfinite(infiniteScroll) {
    this.getFeeds(this.getFeedCount, this.feedPlus);
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
  openOtherUserPage(user_seq) {
    this.navCtrl.push(MyPage, { pageType: 1, user_seq:user_seq });
  }
  getCat(cat_seq) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      cat_seq: cat_seq
    }

    this.http.post(this.serverURL + '/getCat', JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        var cat = new Cat(data.cat_seq, this.serverURL + data.avatar, data.nameCount, data.nameArray,
          data.countArray, data.sex, data.habitat, data.latitude, data.longitude, data.info1, data.info2, data.info3,
          data.create_date, data.connection,data.replyCount);
        this.openCatDetailPage(cat);

      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
  openCatDetailPage(cat) {
  this.navCtrl.push(CatProfilePage, {
    cat: cat,
  });
}

}
