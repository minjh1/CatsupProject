export class User {
  user_seq: number;
  nickname: string;
  email : string;
  image_url: string;
  memo: string;

  constructor(
    user_seq: number,
    nickname: string,
    image_url: string,
    email:string,
    memo: string) {
    this.user_seq = user_seq;
    this.nickname = nickname;
    this.image_url = image_url;
    this.email = email;
    this.memo = memo;
  }
}
