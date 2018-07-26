import { Component, OnInit,Input } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { HttpClient } from "@angular/common/http";
import { filter,map ,pluck} from 'rxjs/operators';
import {  WebService } from "../web.service";
import { PartialObserver, Observable, Subject } from 'rxjs';

import { MatSnackBar } from "@angular/material";
import { HadithAddress,Quranaddress } from '../interfaces';

@Component({
  selector: 'app-hadith-box',
  templateUrl: './hadith-box.component.html',
  styleUrls: ['./hadith-box.component.css']
})
export class HadithBoxComponent implements OnInit {
  @Input() apiURL;
  @Input() update;
  boxcontent;
  loading;
  CurrentSource;
  hadithaddress:HadithAddress;
  quranaddress:Quranaddress;
  theC:string;
  theC$:Subject<number>=new Subject();
  constructor(private sanitizer:DomSanitizer,private http:HttpClient,private web:WebService,private snack:MatSnackBar) { }

  ngOnInit() {
    this.web.Loading.subscribe(Bool=>this.loading=Bool)

    this.web.apiRequest$.subscribe(
      (data)=>{
        //===If Hadith
        if(data.source=='hadith'){
        this.web.getHadith(data.url,data.language).subscribe(
          response=>{
            this.boxcontent=response ;
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
        this.web.getQuran(data.url).subscribe(
          (ayat)=>{
            //clean data and storing it
            this.boxcontent=ayat;
            console.log(ayat);
            console.log("Quran request sent");
            //remove the start of the first ayat
            if(data.quranaddress.ayat==1&&data.quranaddress.surah!=1){
              let firstAyat:string= String(ayat);
              firstAyat = firstAyat.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ','')
              this.boxcontent=firstAyat;
            }
            this.CurrentSource=data.source;
            this.web.Loading.next(false)
          },
          s=>{
            this.snack.open(this.CurrentSource +" "+this.apiURL+" Not found", "X", {duration: 5000,});
            this.web.Loading.next(false)
          }
        )


        console.log('Hadith-box');
        
      }

      }


    )//apiRequest subscribe

    this.theC$.subscribe(
      data=>{
        switch (data){
          case 1:{this.theC='Bukhari';break}
          case 2:{this.theC='Muslim';break}
        }
      } 
    )
  }//ngOnInit

}
