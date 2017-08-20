export class News{
  news_seq:number;
  image_url:string;
  title:string;
  news_url:string;
  company:string;
  constructor(
    news_seq:number,
    image_url:string,
    title:string,
    news_url:string,
    company:string
  ){
    this.news_seq=news_seq;
    this.image_url=image_url;
    this.title=title;
    this.news_url=news_url;
    this.company=company;
  }
  
}
