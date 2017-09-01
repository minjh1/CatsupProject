import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, ModalController,Events } from 'ionic-angular';

import { UserData } from '../../providers/user-data';
import { Post } from '../../models/post';
import { ReplyPage } from '../reply/reply';
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
  post: Post;
  user_seq: number;
  postContent: string;

  loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userData: UserData,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private http: Http,
    public events:Events) {
    this.post = this.navParams.get('post');
    this.user_seq = this.userData.userSeq;
    events.subscribe('postReply:changed', (seq, count) => {
      if(this.post.post_seq == seq){
        this.post.replyCount+=count;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostPage');
    this.presentLoading();
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
        this.postContent = data;
        this.loading.dismiss();
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: '글을 불러오는 중입니다...'
    });

    this.loading.present();
  }
  openReplyPage() {
    let modal = this.modalCtrl.create(ReplyPage, {
      replyType: 2,
      seq: this.post.post_seq,
    });
    modal.onDidDismiss(data => {
    })
    modal.present();
  }
}
