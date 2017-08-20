export class Post {
  post_seq: number;
  title: string;
  image_url: string;
  content_url: string;

  constructor(
    post_seq: number,
    title: string,
    image_url: string,
    content_url: string) {
    this.post_seq = post_seq;
    this.title = title;
    this.image_url = image_url;
    this.content_url = content_url;
  }
}
