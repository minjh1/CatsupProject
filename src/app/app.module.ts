import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { NewsPage } from '../pages/news/news';
import { WritePage } from '../pages/write/write';
import { HomePage } from '../pages/home/home';
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

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from "@angular/http";
import { IonicStorageModule } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook';

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
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
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
  ]
})
export class AppModule { }
