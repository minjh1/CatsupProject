export class Reply {
  reply_seq: number=0;
  user_seq: number;
  avatar_user: string;
  username : string;
  content : string;
  time : string;

  constructor(reply_seq:number, avatar_user:string, user_seq:number,username:string, content:string, time:string){
    this.reply_seq=reply_seq;
    this.user_seq= user_seq;
    this.avatar_user=avatar_user;
    this.username=username;
    this.content=content;
    this.time=time;
  }
}
