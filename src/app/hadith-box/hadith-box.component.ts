import { Component, OnInit,Input } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { HttpClient } from "@angular/common/http";
import { filter,map ,pluck} from 'rxjs/operators';
import {  WebService } from "../web.service";
import { PartialObserver, Observable } from 'rxjs';

import { MatSnackBar } from "@angular/material";

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
  State="Hadith";

  constructor(private sanitizer:DomSanitizer,private http:HttpClient,private web:WebService,private snack:MatSnackBar) { }

  ngOnInit() {
      this.web.Loading.subscribe(Bool=>this.loading=Bool)
    this.web.subject.subscribe(
       (r)=>{ 
        this.web.get(this.apiURL,'textArabic').subscribe( 
          r=>{
            this.boxcontent=r ;
            this.web.Loading.next(false)
          },
          s=>{this.snack.open(this.State+this.apiURL+" Not found", "X", {duration: 5000,});this.web.Loading.next(false) }
        )

        } 
    )
  }

  ngOnChanges(update){

  }


}
