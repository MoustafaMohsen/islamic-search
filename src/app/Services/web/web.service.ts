import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { distinctUntilChanged, pluck } from "rxjs/operators";
import { APiHadithRequest, HadithModel, Lib3, quran } from "../../interfaces";
@Injectable({
  providedIn: "root"
})
export class WebService {
  public Select_source: Subject<any> = new Subject();
  public Loading: Subject<boolean> = new Subject();
  public IncomingRequests$: Subject<Lib3.IncomingRequest> = new Subject();
  public inputValidity$: Subject<string> = new Subject();
  //public BASEURL="http://localhost:1860";
  public BASEURL="https://islamicsearch.herokuapp.com";
  //public BASEURL = "https://localhost:5001";
  constructor(private http: HttpClient) {
    this.IncomingRequests$.subscribe(r => {
      console.log("WebService IncomingRequests$");

      console.log(r);
    });
  }

  getHadith(apiURL, Jsonvalue: string) {
    console.log("web----");
    console.log(apiURL);
    console.log("----web");
    return this.http.get(apiURL).pipe(
      pluck(Jsonvalue),
      distinctUntilChanged()
    );
  }

  getQuran(apiURL: string) {
    return this.http.get<quran.quranResponse>(apiURL).pipe();
  }

  getPIHadith(request_obj: APiHadithRequest) {
    let sourceBook = "hadith";
    return this.http.post<HadithModel>(
      this.BASEURL + "/api/hadith/request/" + sourceBook,
      request_obj
    );
  }

  justget(apiURL) {
    return this.http.get(apiURL);
  }

  getHadithBlock(request_obj: Lib3.IncomingRequest) {
    console.log(request_obj);

    return this.http.post<Lib3.HadithBlocks>(
      this.BASEURL + "/api/hadith/requestb/",
      request_obj
    );
  }
  getHadithBlockArray(request_obj: Lib3.IncomingRequest) {
    console.log(request_obj);

    return this.http.post<Lib3.HadithBlocks[]>(
      this.BASEURL + "/api/hadith/requestbs/",
      request_obj
    );
  }
}
