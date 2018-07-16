import { Injectable } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { HttpClient } from "@angular/common/http";
import { filter,map ,pluck,distinctUntilChanged} from 'rxjs/operators';
import { Subject, PartialObserver } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebService {

  public subject: Subject<any>=new Subject();
  public Select_source: Subject<any>=new Subject();
  public Loading:Subject<Boolean>=new Subject();

  constructor(private http:HttpClient) { }

  get(apiURL , Jsonvalue:string){
    console.log("web----");
    console.log(apiURL);
    console.log("----web");
  return this.http.get(apiURL)
  .pipe( pluck(Jsonvalue),distinctUntilChanged() );

  }

}
