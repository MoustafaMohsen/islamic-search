import { Component, OnInit,Input } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { HttpClient } from "@angular/common/http";
import { filter,map ,pluck} from 'rxjs/operators';
import {  WebService } from "../web.service";
import { PartialObserver, Observable } from 'rxjs';

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

  constructor(private sanitizer:DomSanitizer,private http:HttpClient,private web:WebService,private snack:MatSnackBar) { }

  ngOnInit() {
    this.web.Loading.subscribe(Bool=>this.loading=Bool)

    this.web.apiRequest$.subscribe(
      (data)=>{
        this.web.get(data.url,data.language).subscribe(
          response=>{
            this.boxcontent=response ;
            this.web.Loading.next(false);
            //set addresses
            this.hadithaddress=data.hadithaddress;
            this.quranaddress=data.quranaddress;
            this.CurrentSource=data.source;
          },
          s=>{
            this.snack.open(this.CurrentSource +this.apiURL+" Not found", "X", {duration: 5000,});
            this.web.Loading.next(false) 
          }
        )
      }
    )//apiRequest subscribe
  }//ngOnInit

  ngOnChanges(update){

  }


}
