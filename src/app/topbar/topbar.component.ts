import { Component, OnInit,Input } from '@angular/core';
import { EventEmitter } from 'protractor';
import { WebService } from '../web.service';
import { PartialObserver, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import { BukhariEngilshIndex } from "../SourceOptions/Hadith";
import { HttpClient } from "@angular/common/http";
import { HadithBook,hadith, ApiRequest,hadithaddress } from "../interfaces";
import { BukhariLog } from "../SourceOptions/Bukhari";
declare var $:any;

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  apiURL=""//'https://muflihun.com/svc/hadith?c=1&b=85&h=80';
  @Input() chapter;
  @Input() number_chapter;
  @Input() number_hadith:number;
  @Input() verse;
  @Input() chapter_book;
  Select_source;
  bukhariChapter=BukhariLog;
  BukhariEngilshIndex=BukhariEngilshIndex;
  public observer: Observable<any>;
  update ;//input to hadith component
  lasturl;
  //html controllers
  currentChapter;
  showQuran:boolean;
  showHadith:boolean;
  disableChapterSelect=false;
  TheHadithaddress:hadithaddress;
  CurrentChapterSource=BukhariEngilshIndex.length;

  lastChaptervalue;  
  lasthadithNumbervalue;
  //FormControll
  hadithnumberChapterFC:FormControl=new FormControl(//hadithnumber
    null,
    [Validators.required]
  );
  hadithnumberOptionChapterFC:FormControl=new FormControl(//hadithnumber
    null,
    [Validators.required]
  );
  chapterFC:FormControl=new FormControl(//hadith chapter
      null,[Validators.required,Validators.max(this.CurrentChapterSource),Validators.min(1)]
  );
  chapterOptionsFC:FormControl=new FormControl(//hadith chapter Option
    null,[Validators.required,Validators.max(this.CurrentChapterSource)]
);
  constructor(private web:WebService,private snack:MatSnackBar,private http:HttpClient) { }



  ngOnInit() {
    //what to do with Source Select
    this.web.Select_source.subscribe( r=>{
      switch (r) {
        case "Bukhari":{this.showQuran=false;this.showHadith=true}
          break;

        case "Muslim":{this.showQuran=false;this.showHadith=true}
          break;

        case "Quran":{this.showQuran=true;this.showHadith=false;}
          break;

        default:{this.showQuran=false;this.showHadith=false;}
          break;
      }
    });

    //on hadith chapter change
    this.chapterFC.valueChanges.subscribe(
      value=>{
        //check validity
        if(value <= 0) return;

        //----update hadithcount and set validator
        this.currentChapter=value;
        this.TheHadithaddress  = this.GetHadithsFromTo(this.currentChapter,BukhariLog);
        
        this.hadithnumberChapterFC.setValidators([Validators.min(this.TheHadithaddress.from),
          Validators.max(this.TheHadithaddress.to)]);

        this.hadithnumberOptionChapterFC.setValidators([Validators.min(this.TheHadithaddress.from),
          Validators.max(this.TheHadithaddress.to)]);

        //---Save value to local var and change chapter option
        this.lastChaptervalue=value;
        this.chapterOptionsFC.setValue(''+value);
        //Save value to local var and change chapter option---

      }
    )

    //on hadith chapter change
    this.chapterOptionsFC.valueChanges.subscribe(
      value=>{
        
        if(this.lastChaptervalue!=value){
          this.lastChaptervalue=value;
          this.currentChapter=value;
          this.chapterFC.setValue(Number(this.chapterOptionsFC.value));
          console.log("chapterOptionsFC change");
        }
        else{return}
        
        
      }
    )
    
    //on hadith number change
    this.hadithnumberChapterFC.valueChanges.subscribe(
      value=>{
        if(this.lasthadithNumbervalue!=value){
        //---Save value to local var and change chapter option
        this.lasthadithNumbervalue=value;
        this.hadithnumberOptionChapterFC.setValue(value);
        //Save value to local var and change chapter option---
        }
        else{return}
        console.log("hadithnumberOptionChapterFC set value");
        console.log(this.hadithnumberOptionChapterFC.value);
        
      }
    );

    //on hadith number change
    this.hadithnumberOptionChapterFC.valueChanges.subscribe(
      value=>{
        if(this.lasthadithNumbervalue!=value){
         // this.lasthadithNumbervalue=value;
          this.hadithnumberChapterFC.setValue(Number(this.hadithnumberOptionChapterFC.value));
          
        }
        else{return}
        console.log("hadithnumberChapterFC set value");
        
      }
    );
  }






  pushLoad(){//Look up

    this.apiURL='https://muflihun.com/svc/hadith?c=1&b='+this.currentChapter+'&h='+this.hadithnumberChapterFC.value;
    //Send Request & check so to not send the same request twice
    if(this.lasturl==this.apiURL){this.snack.open("Already sent","X",{duration:1000});return}

    this.lasturl=this.apiURL;
    this.web.Loading.next(true);

    var _apiRequest:ApiRequest={
      url:this.apiURL,
      source:"hadith",
      hadithaddress:{chapter:this.currentChapter,hadith:this.hadithnumberChapterFC.value},
      language:"textArabic"
    };

    this.web.apiRequest$.next(_apiRequest);
    //this.web.Url$.next();
    console.log(this.apiURL);

  }





  //on Source Select change
  onChangeSourceSelect(e){
    this.web.Select_source.next(e);
    this.clean();
  }
  getHadithChapternumberError(){//FC
    return this.hadithnumberChapterFC.hasError("min")? 'This book starts from '+this.TheHadithaddress.from
    +' Hadiths'
    :
    this.hadithnumberChapterFC.hasError("max")? 'This book ends at '+this.TheHadithaddress.to
    +' Hadiths'
    :
    this.hadithnumberChapterFC.hasError('required')?'required':
    '';
  }
  getChapternumberError(){//FC
    return this.chapterFC.hasError("max")? 'This chapter only has '+this.CurrentChapterSource
    +' books'
    :
    this.chapterFC.hasError('required')?'required':
    '';
  
  }

  clean(){
    this.chapter=null;
    this.verse=null;
    this.chapter_book=null;
    this.chapterFC.reset();
    this.chapterOptionsFC.reset();
    this.hadithnumberChapterFC.reset();
    this.hadithnumberOptionChapterFC.reset();
  }
  ////testing
  logInput(){
    console.log(this.chapter);
    console.log(this.hadithnumberChapterFC.value);
  }


  GetHadithsCountinBook(book:number,CHAPTER:HadithBook[]){
    return CHAPTER[book-1]==null?  0:  CHAPTER[book-1].hadiths.length;
  }

  GetHadithsFromTo(book:number,CHAPTER:HadithBook[]):hadithaddress{
    var from =  Number(CHAPTER[book-1].hadiths[0].hadith) ;
    var to =  Number(CHAPTER[book-1].hadiths[CHAPTER[book-1].hadiths.length-1].hadith)
    var volume 
    var hadithaddress:hadithaddress={
      book:book,
      from:from,
      to:to
    }
    console.log(hadithaddress);    
    return hadithaddress;
  }

}//class









//OLD CODE
/*
//Find hadith by number
  CalcHadithNumber(hadithChapter?:HadithBook[],hadithnumber?:number){//(click) test
    var hadithcount:number=0;
    //loop to count
    hadithChapter.forEach(
      book => {
        book.hadiths.forEach(
          hadith => {
            hadithcount++;
            if (hadithcount==hadithnumber) {
              //execute logic for hadith numbers
              console.log("count==");
              console.log(hadithcount);
              console.log("==count");
              console.log(book.book+" book");
              console.log(hadith.hadith+" ");
            }
        });
    });
    console.log(hadithcount);
  }

//Loop script
Hadithbooks:HadithBook[]=[{book:0,hadiths:null},{book:0,hadiths:null}];
hadiths:hadith[];
  //Loop Script
  loop(){
    for (let i = 1; i <= 93; i++) {
      this.http.get<hadith[]>("https://muflihun.com/svc/hadith?c=1&b="+i).subscribe(
        r=>{
          var hold :HadithBook={book:0,hadiths:null}
          hold.book=i
          hold.hadiths=r
          this.Hadithbooks.push(hold)

        });
     // books.push(hold)
    }
  }//loop
  printloop(){
    console.log(this.Hadithbooks);
    
  }

    //Chapter Select Toggle
  toggleChapterSelect(){
    //check if select Chapter is disabled
    if (this.chapter==""||this.chapter==null) {
      this.disableChapterSelect=false
    }
    else{this.disableChapterSelect=true}
    //update Hadith Count
    //By chapter option
    if(this.chapter_book!=null){
     // this.hadithinChapterCount=this.GetHadithsCountinBook(this.chapter_book,BukhariLog)
    }
    //By chapter number
      else{
       // this.hadithinChapterCount=this.GetHadithsCountinBook(this.chapter,BukhariLog)
      }
      

    
  }
 */