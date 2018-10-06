import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit, AfterViewInit, OnDestroy, Output } from '@angular/core';
import { MatSnackBar } from "@angular/material";
import { DomSanitizer } from '@angular/platform-browser';
import { Lib3 } from '../interfaces';
import { MyServiceService } from '../my-service.service';
import { WebService } from "../web.service";
import { Subject } from "rxjs";
declare var $: any;

@Component({
  selector: 'app-hadith-box',
  templateUrl: './hadith-box.component.html',
  styleUrls: ['./hadith-box.component.css']
})
export class HadithBoxComponent implements OnInit,AfterViewInit,OnDestroy {
  @Input() apiURL;
  //Arabicboxcontent:Lib3.Value[]//=[];
  //Englishboxcontent:Lib3.Value[]//=[];

  @Input() ArContentArray:Lib3.Value[][]//=[[]];
  @Input() EnContentArray:Lib3.Value[][]//=[[]];
  @Input() ArContentAndRedArray:{content:Lib3.Value[],refrence:Lib3.Refrence[]}[]//=[[]];
  @Input() EnContentAndRedArray:{content:Lib3.Value[],refrence:Lib3.Refrence[]}[]//=[[]];

  //loading:boolean;
  //hadithRefrence:{ number:number, in_book_refrence?: APiIn_Book_Refrence, old_refrence?: APiOld_refrence};
  //theC:string;
  constructor(
    public srv:MyServiceService,
    //private sanitizer:DomSanitizer,
    //private http:HttpClient,
    public web:WebService,
    private snack:MatSnackBar
    ) 
  { }
  LastId;
  ngOnInit() {
    console.log("Hadith box ngOnInit()");
    
    //this.web.Loading.subscribe(x=>this.loading=x);



  }//ngOnInit

  randomId(index:number,index2:number){    
    var r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    r=r+r+r+r+r+r+r;
    r=r+r;
    var s ="";
    for (var i=0; i < 5; i++) { s += r.charAt(index+i+index2); }

    this.LastId=s
    return s;
  }

  randomStr(m) {
    var m = m || 9; var s = '', r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (var i=0; i < m; i++) { s += r.charAt(Math.floor(Math.random()*r.length)); }
    return s;
  };

  CopyToClipboard(containerid) {
    if (window.getSelection) {
        if (window.getSelection().empty) { // Chrome
            window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) { // Firefox
            window.getSelection().removeAllRanges();
        }
    } else if ((document as any).selection) { // IE?
      (document as any).selection.empty();
    }

    if ((document as any).selection) {
        var range = (document.body as any).createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select().createTextRange();
        document.execCommand("copy");

    } else if (window.getSelection) {
        //alert(containerid);
        var range = document.createRange() as any;
        range.selectNode(document.getElementById(containerid));
        window.getSelection().addRange(range);
        document.execCommand("copy");
        this.snack.open("Copied","x",{duration:1000})
    }
}
  
  ngAfterViewInit(){
    console.log("Hadith box is loaded");
    this.srv.ComponentTracker$.next("hadithbox");
  }
  ngOnDestroy(){
    
  }
/*
  ShowArrayContet(array:Lib3.Value[]){
    console.log("SHow hadith");
    console.log(array);
    
    var many:boolean=array.length>1?true:false;
    var content:string;

    if (many) {
      var firstArray =array[0].value;
      var start = "<p class='emphisise-hadith'>";
      var secondArray = array[1].value;
      var otherArray="";
      var end = "</p>";
      for (let i = 2; i < array.length; i++) {
        const element = array[i].value;
        otherArray =  otherArray+element
      }
      content = firstArray +  start+secondArray+end  + otherArray ;
      console.log(secondArray);
      
    } else {
      content=array[0].value;
    }
    return content;
  }
*/

}//class

