import { Component, OnInit,Input } from '@angular/core';
import { EventEmitter } from 'protractor';
import { WebService } from '../web.service';
import { PartialObserver, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import { BukhariEngilshIndex } from "../SourceOptions/Hadith";
import { HttpClient } from "@angular/common/http";
import { HadithBook,hadith, ApiRequest,hadithaddress,hadithEnglishIndex } from "../interfaces";
import {  Bukhari } from "../SourceOptions/Bukhari";
import { MuslimEnglishIndex, Muslim} from "../SourceOptions/Muslim";
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
  BukhariEngilshIndex=BukhariEngilshIndex;
  public observer: Observable<any>;
  update ;//input to hadith component
  //html controllers
  currentChapter;
  currentVolume;
  showQuran:boolean;
  showHadith:boolean;
  disableChapterSelect=false;
  TheHadithaddress:hadithaddress;
  CurrentChapterSource=null;
  HADITHADDRESS:hadithaddress[];
  C;
  theIndex;
  lastChaptervalue;  
  lasthadithNumbervalue;
  TheCuurentSource:string='';
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
      null,[Validators.required]
  );
  chapterOptionsFC:FormControl=new FormControl(//hadith chapter Option
    null,[Validators.required]
);
  constructor(private web:WebService,private snack:MatSnackBar,private http:HttpClient) { }

  ayatMax:number;

  SurahnumberFC:FormControl=new FormControl(null,[Validators.required,Validators.max(114),Validators.min(1)]);
  AyatNumberFC:FormControl=new FormControl(null,[Validators.required,Validators.min(1)]);

  SurahOptionsFC:FormControl=new FormControl(null,[Validators.required,Validators.max(114),Validators.min(1)]);
  AyatOptionsFC:FormControl=new FormControl(null,[Validators.required,Validators.min(1)]);

  ngOnInit() {
    //what to do with Source Select
    this.web.Select_source.subscribe( r=>{
      
      switch (r) {
        case "Bukhari":{
          this.showQuran=false;this.showHadith=true;
          this.theIndex=BukhariEngilshIndex;
          this.CurrentChapterSource=Bukhari.length;
          this.HADITHADDRESS=Bukhari;
          this.C=1;
          this.TheCuurentSource='hadith';
        }
          break;

        case "Muslim":{
          this.showQuran=false;this.showHadith=true;
          this.CurrentChapterSource=Muslim.length;
          this.theIndex=MuslimEnglishIndex;
          this.HADITHADDRESS=Muslim;
          this.C=2;
          this.TheCuurentSource='hadith';
        }
          break;

        case "Quran":{
          this.showQuran=true;this.showHadith=false;
          this.TheCuurentSource='quran';
          console.log(this.TheCuurentSource);
        }
          break;

        default:{this.showQuran=false;this.showHadith=false;}
          break;
      }
    });

    //on hadith chapter change
    this.chapterFC.valueChanges.subscribe(
      value=>{
        //check validity
        if(this.lastChaptervalue==value&&this.chapterFC.status!='VALID') return;

        //----update hadithcount and set validator
        this.currentChapter=value;
        this.TheHadithaddress  = this.GetHadithAdressByBook(this.currentChapter,this.HADITHADDRESS);
        this.currentVolume = this.TheHadithaddress!=null ?this.TheHadithaddress.volume:null ;

        if(this.TheHadithaddress==null)return

        this.hadithnumberChapterFC.setValue(this.TheHadithaddress.from)
        console.log(this.TheHadithaddress);
        
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
/*
    if(!this.hadithnumberChapterFC.invalid&&!this.chapterFC.invalid&&!this.chapterOptionsFC.invalid&&!this.hadithnumberOptionChapterFC.invalid)
{this.snack.open("invalid request","X",{duration:1000});return}
*/
    console.log(this.hadithnumberChapterFC.invalid);
    console.log(this.chapterFC.invalid);
    console.log(this.chapterOptionsFC.invalid);
    console.log(this.hadithnumberOptionChapterFC.invalid);
    console.log(this.hadithnumberOptionChapterFC.errors);
    
    if(this.TheCuurentSource=='hadith'){
      console.log('HADITH');
      let _url = 'https://muflihun.com/svc/hadith?c='+this.C+'&b='+this.currentChapter+'&h='+this.hadithnumberChapterFC.value;
      //Send Request & check so to not send the same request twice
      if(_url==this.apiURL){this.snack.open("Already sent","X",{duration:1000});return}
      this.apiURL=_url;
      this.web.Loading.next(true);
      let _apiRequestHadith:ApiRequest={
        c:this.C,
        url:this.apiURL,
        source:"hadith",
        hadithaddress:{chapter:this.currentChapter,hadith:this.hadithnumberChapterFC.value},
        language:"textArabic"
        };
      this.web.apiRequest$.next(_apiRequestHadith);
      //this.web.Url$.next();
      console.log(this.apiURL);
    
      }
      else if(this.TheCuurentSource=='quran'){
        let _url='https://api.alquran.cloud/ayah/'+ 
        this.SurahnumberFC.value
         +':'+ 
        this.AyatNumberFC.value+
        '/' + 'ar' +'.asad';
        if(_url==this.apiURL){this.snack.open("Already sent","X",{duration:1000});return}
        this.web.Loading.next(true);
        this.apiURL=_url;
  
        let _apiRequestHadith:ApiRequest={
          c:null,
          url:this.apiURL,
          source:"quran",
          quranaddress:{surah:this.SurahnumberFC.value,ayat:this.AyatNumberFC.value},
          language:"ar"
          };
          this.web.apiRequest$.next(_apiRequestHadith);
        console.log('QURAN');
        console.log("===quran");
        console.log(this.apiURL);
        console.log("quran====");

        
      }
    


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
    'Invalid input';
  }
  getChapternumberError(){//FC
    return this.chapterFC.hasError("max")? 'This chapter only has '+this.CurrentChapterSource
    +' books'
    :
    this.chapterFC.hasError('min')?'Minimum is 1':
    this.chapterFC.hasError('required')?'required':
    'Invalid input';
  }

  //==Quran//
  getAyatNumberError(){
  return this.AyatNumberFC.hasError('required')?'requiured':
  this.AyatNumberFC.hasError('max')? 'this Surah only has ' + this.ayatMax +' Ayat':
  this.AyatNumberFC.hasError('min')? 'Minimum is 1':
  'Invalid input'
  }

  getSurahError(){
    return this.SurahnumberFC.hasError('required')?'required':
    this.SurahnumberFC.hasError('max')? 'The Quran has 114 Surrah':
    this.SurahnumberFC.hasError('min')? 'Minimum is 1':
    'Invalid input'
  }
  //Quran==//

  clean(){
    this.chapter=null;
    this.verse=null;
    this.chapter_book=null;
    this.chapterFC.reset();
    this.chapterOptionsFC.reset();
    this.hadithnumberChapterFC.reset();
    this.hadithnumberOptionChapterFC.reset();
    this.SurahnumberFC.reset();
    this.AyatNumberFC.reset();
    this.SurahOptionsFC.reset();
    this.AyatOptionsFC.reset();
  }
  ////testing
  test(){
    
    /*
    var x = MuslimLog.reverse()
    
    console.log(x);
    */
    //console.log(this.GetHadithAdressByBook(50,Bukhari));
    
    }


  GetHadithsCountinBook(book:number,CHAPTER:HadithBook[]){
    return CHAPTER[book-1]==null?  0:  CHAPTER[book-1].hadiths.length;
  }

  GetHadithAdressByBook(book,SOURCE:hadithaddress[]){
    let x=SOURCE.filter( address=> address.book==Number(book) )
    return x[0];
  }

  GetHadithsFromTo(book:number,CHAPTER:HadithBook[],index?:hadithEnglishIndex[]):hadithaddress{
    if(CHAPTER[book-1]==null){return null}

    var from =  Number(CHAPTER[book-1].hadiths[0].hadith) ;
    var to =  Number(CHAPTER[book-1].hadiths[CHAPTER[book-1].hadiths.length-1].hadith);
    let filtered = index.filter( inx=>inx.book == ''+book);
    var volume =Number(filtered!=null? filtered[0].volume : null);

    var hadithaddress:hadithaddress={
      book:book,
      from:from,
      to:to,
      volume:volume
    }

    console.log(hadithaddress);    
    return hadithaddress;
  }


  //=================GETTING VALUES=================//
  //muslim https://muflihun.com/svc/hadith?c=2&b=1&h=1
  Hadithbooks:HadithBook[]=[{book:0,hadiths:null},{book:0,hadiths:null}];
  hadiths:hadith[];

    //Loop Script
    loop(){
      this.loopget(43)
    }//loop

    loopget(i){
      //to get log type from the internet
      /*
      if(i==0) {return}
      this.http.get<hadith[]>("https://muflihun.com/svc/hadith?c=2&b="+i).subscribe(
        r=>{
          var hold :HadithBook={book:0,hadiths:null}
          hold.book=i
          hold.hadiths=r
          this.Hadithbooks.push(hold)
          this.loopget(i-1);
        });*/
    }

    xx:hadithaddress[]=[];
    loop2(){
      //to convert Log to adress
      /*
      let x:hadithaddress;
      for (let i = 0; i <= 43; i++) {
        
        x= this.GetHadithsFromTo(i,MuslimLog,MuslimEnglishIndex);
        console.log(x);
        this.xx.push(x);
      }
      console.log(this.xx);
      */
    }
    printloop(){
      console.log(this.Hadithbooks);
      
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