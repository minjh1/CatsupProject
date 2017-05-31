export class User {
  user_seq: number;
  id: string;
  nickname: string;
  image_url: string;
  memo: string;
  cat_count: number;
  feed_count: number;
  catsup_count: number;
  constructor(user_seq: number,
  id: string,
  nickname: string,
  image_url: string,
  memo: string,
  cat_count: number,
  feed_count: number,
  catsup_count: number){
    this.user_seq=user_seq;
    this.id=id;
    this.nickname=nickname;
    this.image_url=image_url;
    this.memo=memo;
    this.cat_count=cat_count;
    this.feed_count=feed_count;
    this.catsup_count=catsup_count;
  }
}
