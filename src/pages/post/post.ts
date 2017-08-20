import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';
import { Post } from '../../models/post';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
/**
 * Generated class for the PostPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {
  post : Post;
  user_seq : number;
  postContent : string;
  constructor(public navCtrl: NavController, public navParams: NavParams,public userData: UserData,
  public viewCtrl: ViewController,
private http: Http,) {
    this.post = this.navParams.get('post');
    this.user_seq = this.userData.userSeq;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostPage');
    this.getPostContent(this.post.content_url);
  }
    dismiss() {
      this.viewCtrl.dismiss() //페이지 끔
    }
    getPostContent(url) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let body = {
        url: url
      }
      this.http.post(this.userData.serverURL + '/getPostContent', JSON.stringify(body), { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          this.postContent=data;
        }, error => {
          console.log(JSON.stringify(error.json()));
        })
    }
}
