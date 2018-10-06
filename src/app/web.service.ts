import { Injectable } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { HttpClient } from "@angular/common/http";
import { filter,map ,pluck,distinctUntilChanged} from 'rxjs/operators';
import { Subject, PartialObserver } from 'rxjs';
import { ApiRequest, APiHadithRequest, HadithModel } from "./interfaces";
import { Lib3,quran } from "./interfaces";
@Injectable({
  providedIn: 'root'
})
export class WebService {

  //public Url$: Subject<any>=new Subject();
  public Select_source: Subject<any>=new Subject();
  public Loading:Subject<boolean>=new Subject();
  //public apiRequest$:Subject<ApiRequest>=new Subject();
  //public myAPIRequest$:Subject<APiHadithRequest>=new Subject();

  public IncomingRequests$:Subject<Lib3.IncomingRequest>=new Subject();
  public inputValidity$:Subject<string>=new Subject();
  //public BASEURL="http://localhost:1860";
  //public BASEURL="https://islamicsearch.herokuapp.com";
  public BASEURL="https://localhost:5001";
  constructor(private http:HttpClient) { 
    this.IncomingRequests$.subscribe( r=> {
      console.log("WebService IncomingRequests$");
      
      console.log(r);
    }
    )
  }

  getHadith(apiURL , Jsonvalue:string){
    console.log("web----");
    console.log(apiURL);
    console.log("----web");
  return this.http.get(apiURL)
  .pipe( pluck(Jsonvalue),distinctUntilChanged() );

  }

  getQuran(apiURL:string){
    return this.http.get<quran.quranResponse>(apiURL).pipe(
      //pluck('data','text'),distinctUntilChanged()
    )
  }

  getPIHadith(request_obj:APiHadithRequest){
    let sourceBook = 'hadith'
    return this.http.post<HadithModel>(this.BASEURL+'/api/hadith/request/'+sourceBook,request_obj);
  }
  
  justget(apiURL){ return this.http.get(apiURL) }

  
  getHadithBlock(request_obj:Lib3.IncomingRequest){
    console.log(request_obj);
    
    return this.http.post<Lib3.HadithBlocks>(this.BASEURL+'/api/hadith/requestb/',request_obj);
  }
  getHadithBlockArray(request_obj:Lib3.IncomingRequest){
    console.log(request_obj);
    
    return this.http.post<Lib3.HadithBlocks[]>(this.BASEURL+'/api/hadith/requestbs/',request_obj);
  }

}
