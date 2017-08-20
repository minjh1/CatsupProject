export class discussion {
  dis_seq:number;
  dis_type:number; //0:토론, 1:토의
  user_seq:number;
  topic:string;
  content:string;
  yes:number;
  no:number;
  constructor(
    dis_seq:number,
    dis_type:number,
    user_seq:number,
    topic:string,
    content:string,
    yes:number,
    no:number
  ){
    this.dis_seq=dis_seq
    this.dis_type= dis_type//0:토론, 1:토의
    this.user_seq=user_seq
    this.topic=topic
    this.content=content
    this.yes=yes
    this.no=no
  }
}
