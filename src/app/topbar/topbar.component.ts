import { Component, OnInit } from '@angular/core';
import { WebService } from '../web.service';
import { MatSnackBar } from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import {  ApiRequest,hadithaddress } from "../interfaces";
import {  Bukhari } from "../SourceOptions/Bukhari";
import {  Muslim} from "../SourceOptions/Muslim";
import { QuranIndex } from '../SourceOptions/Quran';
declare var $:any;

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})

export class TopbarComponent implements OnInit {
 constructor(private web:WebService,private snack:MatSnackBar,private http:HttpClient) { }

  apiURL=""
  //html controllers
  currentChapter;
  currentVolume;
  showQuran:boolean;
  showHadith:boolean;
  TheHadithaddress:hadithaddress;
  CurrentChapterSource=null;
  HADITHADDRESS:hadithaddress[];
  C;
  lastChaptervalue;  
  lasthadithNumbervalue;
  TheCuurentSource:string='';
  ayatMax:number;

  //FormControll
  SourceOptionsFC:FormControl=new FormControl(null)

  hadithnumberChapterFC:FormControl=new FormControl(null,[Validators.required]);
  chapterFC:FormControl=new FormControl(null,[Validators.required]);

  hadithnumberOptionChapterFC:FormControl=new FormControl(null,[Validators.required]);
  chapterOptionsFC:FormControl=new FormControl(null,[Validators.required]);

  SurahnumberFC:FormControl=new FormControl(null,[Validators.required,Validators.max(114),Validators.min(1)]);
  AyatNumberFC:FormControl=new FormControl(null,[Validators.required,Validators.min(1)]);

  SurahOptionsFC:FormControl=new FormControl(null,[Validators.required,Validators.max(114),Validators.min(1)]);
  AyatOptionsFC:FormControl=new FormControl(null,[Validators.required,Validators.min(1)]);

  ngOnInit() {
    this.SourceOptionsFC.valueChanges.subscribe(
      (value)=>{   
        this.web.Select_source.next(value);
        this.clean();}
    );

    this.web.Select_source.subscribe( r=>{
      switch (r) {
        case "Bukhari":{
          this.showQuran=false;
          this.showHadith=true;
          this.CurrentChapterSource=Bukhari.length;
          this.HADITHADDRESS=Bukhari;
          this.C=1;
          this.TheCuurentSource='hadith';
        }
          break;

        case "Muslim":{
          this.showQuran=false;this.showHadith=true;
          this.CurrentChapterSource=Muslim.length;
          this.HADITHADDRESS=Muslim;
          this.C=2;
          this.TheCuurentSource='hadith';
        }
          break;

        case "Quran":{
          this.showQuran=true;this.showHadith=false;
          this.TheCuurentSource='quran';
        }
          break;

        default:{this.showQuran=false;this.showHadith=false;}
          break;
      }
    });

    this.chapterFC.valueChanges.subscribe(
      value=>{
        if(this.lastChaptervalue==value&&this.chapterFC.status!='VALID') return;

        this.currentChapter=value;
        this.TheHadithaddress  = this.GetHadithAdressByBook(this.currentChapter,this.HADITHADDRESS);
        this.currentVolume = this.TheHadithaddress!=null ?this.TheHadithaddress.volume:null ;

        if(this.TheHadithaddress==null)return

        this.hadithnumberChapterFC.setValue(this.TheHadithaddress.from)        
        this.hadithnumberChapterFC.setValidators([Validators.min(this.TheHadithaddress.from),
          Validators.max(this.TheHadithaddress.to)]);

        
        this.hadithnumberOptionChapterFC.setValidators([Validators.min(this.TheHadithaddress.from),
          Validators.max(this.TheHadithaddress.to)]);

        this.lastChaptervalue=value;
        this.chapterOptionsFC.setValue(value);

      }
    )

    this.chapterOptionsFC.valueChanges.subscribe(
      value=>{
        
        if(this.lastChaptervalue!=value){
          this.lastChaptervalue=value;
          this.currentChapter=value;
          this.chapterFC.setValue(Number(this.chapterOptionsFC.value));
        }
        else{return}
        
        
      }
    )
    
    this.hadithnumberChapterFC.valueChanges.subscribe(
      value=>{
        if(this.lasthadithNumbervalue!=value){
        this.lasthadithNumbervalue=value;
        this.hadithnumberOptionChapterFC.setValue(value);
        }
        else{return}
        
      }
    );

    this.hadithnumberOptionChapterFC.valueChanges.subscribe(
      value=>{
        if(this.lasthadithNumbervalue!=value){
          this.hadithnumberChapterFC.setValue(Number(this.hadithnumberOptionChapterFC.value));
          
        }
        else{return}        
      }
    );

    this.SurahnumberFC.valueChanges.subscribe(
      value=>{this.SetMaxAyat();} 
    )
  }



  LookUp(){//Look up
    switch (this.TheCuurentSource) {

      case 'hadith':{
        let _url = 'https://muflihun.com/svc/hadith?c='+
        this.C+
        '&b='+this.currentChapter+
        '&h='+this.hadithnumberChapterFC.value;

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
  
        }break;

      case 'quran':{
        let _url='https://api.alquran.cloud/ayah/'+ 
        this.SurahnumberFC.value
          +':'+ 
        this.AyatNumberFC.value+
        '/' + 'ar' +'.asad';
        if(_url==this.apiURL){
          this.snack.open("Already sent","X",{duration:1000});
          return;
        }

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
      }break;
    
      default:
        break;
    }
  }

  //on Source Select change


  getHadithChapternumberError(){
    return this.hadithnumberChapterFC.hasError("min")? 'This book starts from '+this.TheHadithaddress.from
    +' Hadiths'
    :
    this.hadithnumberChapterFC.hasError("max")? 'This book ends at '+this.TheHadithaddress.to
    +' Hadiths'
    :
    this.hadithnumberChapterFC.hasError('required')?'required':
    'Invalid input';
  }
  getChapternumberError(){
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
    this.chapterFC.reset();
    this.chapterOptionsFC.reset();
    this.hadithnumberChapterFC.reset();
    this.hadithnumberOptionChapterFC.reset();
    this.SurahnumberFC.reset();
    this.AyatNumberFC.reset();
    this.SurahOptionsFC.reset();
    this.AyatOptionsFC.reset();
  }


  GetHadithAdressByBook(book,SOURCE:hadithaddress[]){
    let x=SOURCE.filter( address=> address.book==Number(book) )
    return x[0];
  }



  SetMaxAyat(){
    let value =this.SurahnumberFC.value;
    if(value <= 0)return
    let Surrah =QuranIndex.filter( f=>f.number==value);
    this.ayatMax = Surrah[0].numberOfAyahs;
  }


  Previous(){

    if( this.TheCuurentSource=='quran' ){
    let ayat =this.AyatNumberFC.value - 1;
    if( ayat <= 0 ) return;
    this.AyatNumberFC.setValue(ayat)
    this.LookUp();
    }
    if(this.TheCuurentSource=='hadith'){
      let hadithNo=this.hadithnumberChapterFC.value - 1;
      if( hadithNo < this.TheHadithaddress.from ) return
      this.hadithnumberChapterFC.setValue(hadithNo);
      this.LookUp();
    }

  }

  Next(){

    if(this.TheCuurentSource=='quran'){
      let ayat  =this.AyatNumberFC.value + 1;
      if(ayat > this.ayatMax)return;
      this.AyatNumberFC.setValue(ayat)
      this.LookUp();
    }

    if(this.TheCuurentSource=='hadith'){
      let hadithNo=this.hadithnumberChapterFC.value + 1;
      if(hadithNo > this.TheHadithaddress.to)return
      this.hadithnumberChapterFC.setValue(hadithNo);
      this.LookUp();
    }

  }
  
}//CLASS



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

    //=================GETTING VALUES//

  //muslim https://muflihun.com/svc/hadith?c=2&b=1&h=1
  Hadithbooks:HadithBook[]=[{book:0,hadiths:null},{book:0,hadiths:null}];
  hadiths:hadith[];

    //Loop Script
    loop(){
      this.loopget(43)
    }//loop

    loopget(i){
      //to get log type from the internet
      
      if(i==0) {return}
      this.http.get<hadith[]>("https://muflihun.com/svc/hadith?c=2&b="+i).subscribe(
        r=>{
          var hold :HadithBook={book:0,hadiths:null}
          hold.book=i
          hold.hadiths=r
          this.Hadithbooks.push(hold)
          this.loopget(i-1);
        });
      }

      xx:hadithaddress[]=[];
      loop2(){
        //to convert Log to adress
        
        let x:hadithaddress;
        for (let i = 0; i <= 43; i++) {
          
          x= this.GetHadithsFromTo(i,MuslimLog,MuslimEnglishIndex);
          console.log(x);
          this.xx.push(x);
        }
        console.log(this.xx);
        
      }
      printloop(){
        console.log(this.Hadithbooks);
        
      }
      //GETTING VALUES=================//

 */