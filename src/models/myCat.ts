
export class MyCat {
  seq: number;
  name:string="";
  avatar: string="";
  habitat: string="";
  info1: string="";
  constructor(
    seq:number,
    name:string,
    avatar:string,
    habitat: string,
    info1:string){
    this.seq=seq;
    this.avatar=avatar;
    this.name=name;
    this.habitat=habitat;
    this.info1 =info1;
  }
}
