import { Component } from '@angular/core';
import { NavController, ModalController,ToastController } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { News } from '../../models/news';
import { Post } from '../../models/post';
import { PostPage } from '../post/post';
import { BrowserTab } from '@ionic-native/browser-tab';

@Component({
  selector: 'page-about',
  templateUrl: 'news.html'
})
export class NewsPage {

  posts: Post[] = [];
  news: News[] = [];

  constructor(
    public navCtrl: NavController,
    private http: Http,
    public modalCtrl: ModalController,
    public userData: UserData,
    private browserTab: BrowserTab,
    public toastCtrl: ToastController
  ) {

  }
  ionViewDidLoad() {
    this.getPosts(0, 5);
    this.getNews(0, 4);
  }
  getPosts(offset: number, limit: number) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      offset: offset,
      limit: limit,
    }

    this.http.post(this.userData.serverURL + '/getPosts', JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        for (var i = 0; i < data.length; i++) {
          this.posts.push(new Post(data[i].post_seq, data[i].title, this.userData.serverURL + data[i].image_url, data[i].content_url, data[i].replyCount));
        }
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }
  getNews(offset: number, limit: number) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      offset: offset,
      limit: limit,
    }

    this.http.post(this.userData.serverURL + '/getNews', JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        for (var i = 0; i < data.length; i++) {
          this.news.push(new News(data[i].news_seq,this.userData.serverURL + data[i].image_url,data[i].title, data[i].news_url, data[i].company));
        }
      }, error => {
        console.log(JSON.stringify(error.json()));
      })
  }

  openThisPost(post) {
    let modal = this.modalCtrl.create(PostPage, {
      post:post
    });
    modal.onDidDismiss(data => {
      if (data != null) {

      }
    })
    modal.present();
  }
  openThisNews(news){
    this.browserTab.isAvailable()
        .then((isAvailable: boolean) => {

          if (isAvailable) {

            this.browserTab.openUrl(news.news_url);

          } else {

            alert("notAvailavle");
            // open URL with InAppBrowser instead or SafariViewController

          }

        });

  }
  doRefresh(refresher) {
    this.posts=[];
    this.news=[];
    this.getPosts(0, 5);
    this.getNews(0, 4);
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 1000);
  }
  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 1000,
      cssClass: "toast",
    });
    toast.present();
  }
  openDiscussionPage(){
    this.presentToast("준비 중인 기능입니다.")
  }

}
