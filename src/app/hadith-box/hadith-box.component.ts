import { Component, OnInit,Input } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {  WebService } from "../web.service";
import { PartialObserver, Observable, Subject } from 'rxjs';
import { MatSnackBar } from "@angular/material";
import { HadithAddress,Quranaddress, APiOld_refrence, APiIn_Book_Refrence } from '../interfaces';
import { MyServiceService } from '../my-service.service';
declare var $: any;

@Component({
  selector: 'app-hadith-box',
  templateUrl: './hadith-box.component.html',
  styleUrls: ['./hadith-box.component.css']
})
export class HadithBoxComponent implements OnInit {
  @Input() apiURL;
  @Input() update;
  Arabicboxcontent;
  Englishboxcontent;
  loading;
  CurrentSource;
  hadithaddress:HadithAddress;
  hadithRefrence:{ number:number, in_book_refrence?: APiIn_Book_Refrence, old_refrence?: APiOld_refrence};
  quranaddress:Quranaddress;
  theC:string;
  theC$:Subject<number>=new Subject();
  ifram_src:string = "https://www.sunnah.com/bukhari/1";
  constructor(public srv:MyServiceService,private sanitizer:DomSanitizer,private http:HttpClient,private web:WebService,private snack:MatSnackBar) 
  { }

  ngOnInit() {
    //this.web.Loading.subscribe(Bool=>this.loading=Bool)

    this.web.apiRequest$.subscribe(
      (data)=>{
        //===If Hadith
        if(data.source=='hadith'){
        this.web.getHadith(data.url,data.language).subscribe(
          response=>{
            this.Arabicboxcontent=response ;
            this.web.Loading.next(false);
            //set addresses
            this.hadithaddress=data.hadithaddress;
            this.quranaddress=data.quranaddress;
            this.CurrentSource=data.source;
            this.theC$.next(data.c);
            
          },
          s=>{
            this.snack.open(this.CurrentSource+' ' +this.apiURL+" Not found", "X", {duration: 5000,});
            this.web.Loading.next(false)
          }
        )
      }
      //===If Quran
      if(data.source=='quran'){
        this.web.Loading.next(true);
        this.web.getQuran(data.url).subscribe(
          (ayat)=>{
            //clean data and storing it
            this.Arabicboxcontent=ayat;
            //remove the start of the first ayat
            if(data.quranaddress.ayat==1&&data.quranaddress.surah!=1){
              let firstAyat:string= String(ayat);
              firstAyat = firstAyat.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ','')
              this.Arabicboxcontent=firstAyat;
            }
            this.CurrentSource=data.source;
            this.web.Loading.next(false)
          },
          s=>{
            this.snack.open(this.CurrentSource +" "+this.apiURL+" Not found", "X", {duration: 5000,});
            this.web.Loading.next(false)
          }
        )
        
      }

      }


    )//apiRequest subscribe


    this.web.myAPIRequest$.subscribe(
      (request_obj)=>{
        this.loading=true
        
        //SEND Request
        this.web.getPIHadith(request_obj).subscribe(

          (r)=>{
            this.srv.ResponseHadith$.next(r);
            this.Arabicboxcontent = r.arabicHTML;
            this.Englishboxcontent =r.englishHTML;
            console.log("<<==========HadithBox");
            console.log(r);
            console.log(r.arabicText);
            console.log("HadithBox==========>");
            this.loading=false
          },

          (e)=>{
            this.snack.open( "Not found","x" ,{duration:5000} )
            this.loading=false
          }
        );

      }
    );

    this.theC$.subscribe(
      data=>{
        switch (data){
          case 1:{this.theC='Bukhari';break}
          case 2:{this.theC='Muslim';break}
        }
      } 
    );
    this.srv.ResponseHadith$.subscribe(
      (data)=>
      {
        this.hadithRefrence={
          number : data.number,
          in_book_refrence:data.in_book_refrence,
          old_refrence : data.old_refrence
        } 
        console.log("+++++ResponseHadith$");
        console.log(data);
        console.log("ResponseHadith$+++++");
      });
  }//ngOnInit


}//class

