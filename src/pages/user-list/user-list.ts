import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { Http, Headers } from '@angular/http';
import { UserData } from '../../providers/user-data'
import 'rxjs/add/operator/map';
import { MyPage } from '../mypage/mypage';

@Component({
  selector: 'page-user-list',
  templateUrl: 'user-list.html',
})
export class UserListPage {
  pageType: number; //0:좋아요 리스트, 1:지켜보는 사람 리스트
  users: User[] = [];
  serverURL : string;
  title : string;
  getUserCount: number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public userData: UserData,
  ) {
    this.serverURL = this.userData.serverURL;
    this.pageType = this.navParams.get("pageType");
  }

  ionViewDidLoad() {
    this.getUserCount=0;
    if(this.pageType==0){
      this.title="CATSUP LIST";
      this.getUserList(0,100,this.navParams.get("seq"),'/getLikeUserList');
    }else{
      this.title="지켜보는 사람";
      this.getUserList(0,100,this.navParams.get("seq"),'/getWatchUserList');
    }
  }
  getUserList(offset: number, limit: number, wr_or_cat_seq: number, action:string){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      limit: limit,
      offset: offset,
      seq: wr_or_cat_seq,
    }
    this.http.post(this.serverURL + action, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          var user={
            user_seq: data[i].user_seq,
            nickname: data[i].nickname,
            image_url: this.serverURL+data[i].image_url,
            memo: data[i].memo
          }
          if (data[i].image_url.indexOf("/") != 0) { //페북 계정 유저
            user.image_url = data[i].image_url;
          }
          this.users.push(user);
        }
        this.getUserCount += data.length;
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
  openOtherUserPage(user_seq) {
    this.navCtrl.push(MyPage, { pageType: 1, user_seq:user_seq });
  }
}
