import { Component, OnInit,Input } from '@angular/core';
import { EventEmitter } from 'protractor';
import { WebService } from '../web.service';
import { PartialObserver, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';

declare var $:any;

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  apiURL='https://muflihun.com/svc/hadith?c=1&b=85&h=80';
  BASEURL = "https://muflihun.com/bukhari/";
  @Input() chapter;
  @Input() number;
  
  public observer: Observable<any>;
  update ;

  constructor(private web:WebService,private snack:MatSnackBar) { }

  ngOnInit() {
  }

lasturl
  pushLoad(chapter,number){
    this.apiURL='https://muflihun.com/svc/hadith?c=1&b='+chapter+'&h='+number;

    if (this.lasturl!=this.apiURL) {
      this.lasturl=this.apiURL
      this.web.Loading.next(true)
      this.web.subject.next();
      console.log(this.apiURL);
    }
    else{
      this.snack.open("Already sent","X",{duration:1000})
    }
    

  }

  
  ////testing
  logInput(){
    console.log(this.chapter);
    console.log(this.number);
  }
}
