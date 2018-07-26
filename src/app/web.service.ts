import { Injectable } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { HttpClient } from "@angular/common/http";
import { filter,map ,pluck,distinctUntilChanged} from 'rxjs/operators';
import { Subject, PartialObserver } from 'rxjs';
import { ApiRequest } from "./interfaces";

@Injectable({
  providedIn: 'root'
})
export class WebService {

  public Url$: Subject<any>=new Subject();
  public Select_source: Subject<any>=new Subject();
  public Loading:Subject<boolean>=new Subject();
  public apiRequest$:Subject<ApiRequest>=new Subject();

  constructor(private http:HttpClient) { }

  getHadith(apiURL , Jsonvalue:string){
    console.log("web----");
    console.log(apiURL);
    console.log("----web");
  return this.http.get(apiURL)
  .pipe( pluck(Jsonvalue),distinctUntilChanged() );

  }

  getQuran(apiURL:string){
    return this.http.get(apiURL).pipe(
      pluck('data','text'),distinctUntilChanged()
    )
  }
  
  justget(apiURL){ return this.http.get(apiURL) }

}
