import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Injectable()
export class UserData {
  serverURL: string = 'http://45.249.160.73:5555';
  userSeq : number;

  constructor(
    public events: Events,
    public storage: Storage
  ) {}

  login(seq: number): void {
    this.storage.set('hasLoggedIn', true);
    this.setUserSeq(seq);
  //  this.events.publish('user:login');
  };

  signup(seq: number): void {
    this.storage.set('hasLoggedIn', true);
    this.setUserSeq(seq);
//    this.events.publish('user:signup');
  };

  logout(): void {
    this.storage.remove('hasLoggedIn');
    this.storage.remove('userSeq');
    this.userSeq=null;
    this.storage.remove('hasSeenTutorial');
  //  this.events.publish('user:logout');
  };

  setUserSeq(seq: number): void {
    this.storage.set('userSeq', seq);
    this.userSeq=seq;
  };

  getUserSeq(): Promise<number> {
    return this.storage.get('userSeq').then((value) => {
      this.userSeq=value;
      return value;
    });
  };

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get('hasLoggedIn').then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get('hasSeenTutorial').then((value) => {
      return value;
    });
  };
}
