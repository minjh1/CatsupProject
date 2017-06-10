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

  pageType: number; //0: 냥이 추가에서, 1:냥이 정보에서
  lat_lng: {
    latitude?: string,
    longitude?: string,
  } = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public geolocation: Geolocation,
  ) {
    this.pageType = this.navParams.get("pageType");

  }
  ionViewDidLoad() {
    console.log("맵페이지");
    this.loadMap();
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }
  select_dismiss(lat_lng) {
    this.viewCtrl.dismiss(lat_lng); //페이지 끔
  }
  complete() {
    if (this.pageType == 0) { //냥로필 추가
      this.select_dismiss(this.lat_lng);
    } else { //마이페이지

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
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        draggable: true,
        title: "Drag me!",
        position: this.map.getCenter()
      });
      this.map.addListener('click', (e)=>{
        console.log(e.latLng.lat());
        console.log(e.latLng.lng());
        marker.setPosition(e.latLng);
        //placeMarkerAndPanTo(e.latLng, this.map);
      })

      //this.addMarker();
    }, (err) => {
      console.log(err);
    });

  }
  addMarker() {

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      draggable: true,
      title: "Drag me!",
      position: this.map.getCenter()
    });
/*
    let content = "<h4>" + marker.position + "</h4>";

    google.maps.event.addListener(marker, 'drag', () => {
      marker.getPosition((position)=>{
        console.log(position.toString());
      });
    });
    */
    marker.addListener('dragend',()=>{
      console.log("drag..");
      marker.getPosition((pos)=>{
        console.log(pos);
      })
    })
    /*
    marker.addListener(google.maps.event.MARKER_DRAG_END, (marker)=>{
      marker.getPosition((position)=>{
        alert(position);
      });
    });
    */
  //  this.addInfoWindow(marker, content);

  }
  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }


}
