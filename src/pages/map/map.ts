import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  service: any;
  marker: any;
  footer_text:string;
  infoWindow: any;
  title:string;

  cat_info:{
    cat_name?:string;
    cat_lat?:any;
    cat_lng?:any;
  }={};

  pageType: number; //0: 냥이 추가에서, 1:냥이 정보에서
  info: {
    latitude?: string,
    longitude?: string,
    placeName?: string;
  } = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public geolocation: Geolocation,
  ) {
    this.pageType = this.navParams.get("pageType");
    if(this.pageType==0){
      this.footer_text="완료";
      this.title="서식지역 선택"
    }else if(this.pageType==1){
      this.footer_text="확인";
      this.title="서식 지역"
      this.cat_info.cat_name=this.navParams.get("name");
      this.cat_info.cat_lat=this.navParams.get("lat");
      this.cat_info.cat_lng=this.navParams.get("lng");
    }
  }
  ionViewDidLoad() {
    console.log("맵페이지");
    if(this.pageType==0){
      this.loadMap();
    }else if (this.pageType==1){
      this.catHabitat();
    }
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }
  complete() {
    if (this.pageType == 0) { //냥로필 추가
      this.viewCtrl.dismiss(this.info); //페이지 끔
    } else { //마이페이지
      this.dismiss();
    }
  }

  loadMap() {
    // create LatLng object
    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        draggable: true,
        position: this.map.getCenter()
      });
      this.map.addListener('click', (e) => {
        this.info.latitude=e.latLng.lat();
        this.info.longitude=e.latLng.lng();
        this.marker.setPosition(e.latLng);
        this.getPlace(e.latLng);
      })
      this.infoWindow = new google.maps.InfoWindow({
        content: "지도를 클릭하여 위치를 선택하세요."
      });

      this.infoWindow.open(this.map, this.marker);
      //this.addMarker();
    }, (err) => {
      console.log(err);
    });

  }
  catHabitat(){

      let latLng = new google.maps.LatLng(this.cat_info.cat_lat,this.cat_info.cat_lng);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


      this.marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });

      this.infoWindow = new google.maps.InfoWindow({
        content: this.cat_info.cat_name
      });

      this.infoWindow.open(this.map, this.marker);
      //this.addMarker();
  }
  getPlace(latlng) {
    this.infoWindow.close();
    var req = {
      location: latlng,
      radius: '50',
      rankBy: google.maps.places.RankBy.PROMINENCE,
    }
    var places = [];
    var contentString = `
    <div id="markerContent">
    <ion-list>
    `
    this.service = new google.maps.places.PlacesService(this.map);
    this.service.nearbySearch(req, (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          places.push(results[i].name);
          contentString += `<ion-item>
                <ion-label>`+ results[i].name + `</ion-label>
                </ion-item>`;
        }
        if(results.length==1){
          this.info.placeName=results[0].name;
        }else{
          this.info.placeName=results[1].name;
        }
      }
      contentString += `</ion-list></div>`;
      this.infoWindow = new google.maps.InfoWindow({
        content: contentString,
      });
      this.infoWindow.open(this.map, this.marker);
    });
  }
}
