import { Component, OnInit,Input } from '@angular/core';
declare var $:any;

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  BASEURL = "https://muflihun.com/bukhari/";
  @Input() chapter;
  @Input() number;
  constructor() { }

  ngOnInit() {
  }
  load(chapter,number){//click load
    this.BASEURL= "https://muflihun.com/bukhari/"+chapter+"/"+number
  }

  reload(){//click reload
    $('iframe').attr('src', $('iframe').attr('src'));
  }

  
  ////testing
  logInput(){
    console.log(this.chapter);
    console.log(this.number);
  }
}
