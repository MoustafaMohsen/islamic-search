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
  Select_source;
  public observer: Observable<any>;
  update ;//input to hadith component
  lasturl;
  //html controllers
  showQuran:boolean;
  showHadith:boolean;

  constructor(private web:WebService,private snack:MatSnackBar) { }

  ngOnInit() {
    //what to do with Source Select
    this.web.Select_source.subscribe( r=>{
      switch (r) {
        case "Bukhari":
        this.showQuran=false;
        this.showHadith=true
          break;

        case "Muslim":
        this.showQuran=false;
        this.showHadith=true
          break;

        case "Quran":
        this.showQuran=true;
        this.showHadith=false;
          break;
      
        default:
          break;
      }
    });
  }



  onChangeSelect(e){
    this.web.Select_source.next(e);
  }


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
