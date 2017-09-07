export class Cat {
  seq: number;
  avatar: string="";
  nameCount: number;
  names:string[];
  counts:number[];
  sex: number;
  habitat: string="";
  latitude: string="";
  longitude:string="";
  info1: string="";
  info2: string="";
  info3: string="";
  create_date: string="";
  connection: number;
  replyCount:number;
  area1:number;
  area2:number;
  area1Name:string;
  area2Name:string;
  constructor(
    seq:number,
    avatar:string,
    nameCount:number,
    names:string[],
    counts:number[],
    sex:number,
    habitat: string,
    latitude: string,
    longitude:string,
    info1:string,
    info2:string,
    info3:string,
    create_date:string,
    connection:number,
    replyCount:number,
    area1:number,
    area2:number,
    area1Name:string,
    area2Name:string){
    this.seq=seq;
    this.avatar=avatar;
    this.nameCount=nameCount;
    this.names=names;
    this.counts=counts;
    this.sex=sex;
    this.habitat=habitat;
    this.latitude=latitude;
    this.longitude=longitude;
    this.info1 =info1;
    this.info2 =info2;
    this.info3 =info3;
    this.create_date=create_date;
    this.connection=connection;
    this.replyCount=replyCount;
    this.area1=area1;
    this.area2=area2;
    this.area1Name=area1Name;
    this.area2Name=area2Name;
  }
}
