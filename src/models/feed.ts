export class Feed {
  wr_seq: number;
  type: number;
  cat_seq: number;
  catImg: string;
  catName: string;
  user_seq: number;
  userImg : string;
  userName: string;
  imgUrl: string[]=[];
  content_preview: string="";
  content: string="";
  content_more:boolean=false;
  create_date: string;
  likeCount: number;
  replyCount: number;
  isLiked : boolean =false;
  constructor(wr_seq: number, type: number,cat_seq: number, catImg: string, catName: string, user_seq: number, userImg : string,
    userName:string, imgUrl: string[], content_preview:string, content: string,create_date: string,likeCount: number,isLiked:boolean,replyCount: number){
    this.wr_seq=wr_seq;
    this.type=type;
    this.cat_seq=cat_seq;
    this.catImg = catImg;
    this.catName=catName;
    this.user_seq=user_seq;
    this.userImg=userImg;
    this.userName=userName;
    this.imgUrl=imgUrl;
    this.content_preview = content_preview;
    this.content=content;
    this.create_date=create_date;
    this.likeCount=likeCount;
    this.isLiked=isLiked;
    this.replyCount=replyCount;
  }
}
