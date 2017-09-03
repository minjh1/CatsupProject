import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { NewsPage } from '../pages/news/news';
import { WritePage } from '../pages/write/write';
import { HomePage } from '../pages/home/home';
import { MyPopoverPage } from '../pages/pop_over/my_pop_over';
import { OtherPopoverPage } from '../pages/pop_over/other_pop_over';
import { MyReplyPopPage } from '../pages/pop_over/my_reply_pop';
import { OtherReplyPopPage } from '../pages/pop_over/other_reply_pop';
import { CatNamesPage } from '../pages/pop_over/cat_names';
import { TabsPage } from '../pages/tabs/tabs';
import { MyPage } from '../pages/mypage/mypage';
import { CatsPage } from '../pages/cats/cats';
import { CatProfilePage } from '../pages/cats/detail/detail';
import { AddCat } from '../pages/cats/add-cat/add-cat';
import { ReplyPage } from '../pages/reply/reply';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/signup/signup';
import { MyCatPage } from '../pages/mycat/mycat';
import { MapPage } from '../pages/map/map';
import { ImageCropperPage } from '../pages/image-cropper/image-cropper';
import { PostPage } from '../pages/post/post';
import { UserListPage } from '../pages/user-list/user-list';
import { SettingPage } from '../pages/setting/setting';
import { UserModPage } from '../pages/user-mod/user-mod';
import { AllNewsPage } from '../pages/all-news/all-news';
import { AllPostPage } from '../pages/all-post/all-post';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from "@angular/http";
import { IonicStorageModule } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

import { UserData } from '../providers/user-data';

import {Autosize} from 'ionic2-autosize'; //텍스트아리아 크기자동조절
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { ImagePicker } from '@ionic-native/image-picker'; //이미지 다중선택
import { Geolocation } from '@ionic-native/geolocation';

@NgModule({
  declarations: [
    MyApp,
    NewsPage,
    WritePage,
    HomePage,
    TabsPage,
    MyPage,
    CatsPage,
    CatProfilePage,
    AddCat,
    ReplyPage,
    TutorialPage,
    LoginPage,
    SignUpPage,
    Autosize,
    MyCatPage,
    MapPage,
    MyPopoverPage,
    OtherPopoverPage,
    ImageCropperPage,
    MyReplyPopPage,
    OtherReplyPopPage,
    PostPage,
    UserListPage,
    CatNamesPage,
    SettingPage,
    UserModPage,
    AllNewsPage,
    AllPostPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
    //  tabsHideOnSubPages: true,
    }),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NewsPage,
    WritePage,
    HomePage,
    TabsPage,
    MyPage,
    CatsPage,
    CatProfilePage,
    AddCat,
    ReplyPage,
    TutorialPage,
    LoginPage,
    SignUpPage,
    MyCatPage,
    MapPage,
    MyPopoverPage,
    OtherPopoverPage,
    ImageCropperPage,
    MyReplyPopPage,
    OtherReplyPopPage,
    PostPage,
    UserListPage,
    CatNamesPage,
    SettingPage,
    UserModPage,
    AllNewsPage,
    AllPostPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserData,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Facebook,
    Camera,
    File,
    Transfer,
    ImagePicker,
    Geolocation,
    Base64ToGallery,
    InAppBrowser,
    Diagnostic,
    LocationAccuracy
  ]
})
export class AppModule { }
