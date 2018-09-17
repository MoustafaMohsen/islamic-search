import { Injectable } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { HttpClient } from "@angular/common/http";
import { filter,map ,pluck,distinctUntilChanged} from 'rxjs/operators';
import { Subject, PartialObserver, Observable,BehaviorSubject } from 'rxjs';
import { ApiRequest, APiHadithRequest, HadithModel, ISource } from "./interfaces";

@Injectable({
  providedIn: 'root'
})
export class MyServiceService {
  constructor() { }
  
  public Source:ISource;
  public ResponseHadith$:Subject<HadithModel>=new Subject<HadithModel>();
  public Navigation$:Subject<{Action:string,Value?:string}>=new Subject<{Action:string,Value?:string}>();
  

}
