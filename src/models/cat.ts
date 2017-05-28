
export class Cat {
  seq: number;
  avatar: string="";
  nameCount: number;
  names:string[];
  counts:number[];
  sex: number;
  habitat: string="";
  info1: string="";
  info2: string="";
  info3: string="";
  create_date: string="";
  connection: number;
  constructor(seq:number, avatar:string, nameCount:number, names:string[], counts:number[], sex:number, habitat: string, info1:string,info2:string,info3:string,create_date:string,connection:number){
    this.seq=seq;
    this.avatar=avatar;
    this.nameCount=nameCount;
    this.names=names;
    this.sex=sex;
    this.habitat=habitat;
    this.info1 =info1;
    this.info2 =info2;
    this.info3 =info3;
    this.create_date=create_date;
    this.connection=connection;
  }
}
