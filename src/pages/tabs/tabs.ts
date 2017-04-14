import { Component } from '@angular/core';

import { NewsPage } from '../news/news';
import { WritePage } from '../write/write';
import { HomePage } from '../home/home';
import { MyPage } from '../mypage/mypage';
import { CatsPage } from '../cats/cats';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = NewsPage;
  tab3Root = WritePage;
  tab4Root = CatsPage;
  tab5Root = MyPage;

  constructor() {

  }
}
