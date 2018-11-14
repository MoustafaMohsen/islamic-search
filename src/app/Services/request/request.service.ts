import { Injectable } from "@angular/core";
import { WebService } from "../web/web.service";
import { Lib3 } from "src/app/interfaces";
import { MatSnackBar } from "@angular/material";
import { MyServiceService } from "../my/my-handler.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class RequestService {
  ArContentAndRedArray: { content: Lib3.Value[]; refrence: Lib3.Refrence[] }[]=[];
  EnContentAndRedArray: { content: Lib3.Value[]; refrence: Lib3.Refrence[] }[]=[];

  //===============constructor===============//
  constructor(private web: WebService, private snack: MatSnackBar,
    public router: Router,private srv:MyServiceService) {

    this.web.IncomingRequests$.subscribe(
      request => {
        //===If Hadith
        if (request.source == "hadith") {
          if (request.Method == 6) {
          this.web.Loading$.next(true);
            this.web.getManyBlocks(request).subscribe(
              blocks => {
                this.ArContentAndRedArray=this.loadHadithBlocks(blocks,"ar");
                this.EnContentAndRedArray=this.loadHadithBlocks(blocks,"en");
                this.web.Loading$.next(false);
              },
              error => {
                this.notFoundSnack()
                this.web.Loading$.next(false);
              }
            );
          }
        } //If Hadith

        //===If Quran
        if (request.source == "quran") {
          this.web.Loading$.next(true);
          //Loading
          this.web.Loading$.next(true);
          //For arabic
          let _url = `https://api.alquran.cloud/ayah/${request.value1}:${request.value2}/`;

          this.web.getQuran(_url + "ar" + ".asad").subscribe(
            ayat => {
              //this.ArContentAndRedArray = [{ refrence: null, content: null }];
              this.ArContentAndRedArray = [{
                content: [{ value: ayat.data.text }],
                refrence: [
                  {
                    name: "Surah, Ayat",
                    value1: ayat.data.surah.number,
                    value2: ayat.data.numberInSurah
                  }
                ]
              }];
              //remove the start of the first ayat
              if (request.value2 == 1 && request.value1 != 1) {
                let firstAyat: string = String(ayat.data.text);
                firstAyat = firstAyat.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ","");
                this.ArContentAndRedArray[0].content = [{ value: firstAyat }];
              }
              this.web.Loading$.next(false);
            },
            error => {
              this.notFoundSnack()
              this.web.Loading$.next(false);
            }
          );
          //For English
          this.web.getQuran(_url + "en" + ".asad").subscribe(
            ayat => {
              this.EnContentAndRedArray = [{
                content: [{ value: ayat.data.text }],
                refrence: [
                  {
                    name: "Surah, Ayat",
                    value1: ayat.data.surah.number,
                    value2: ayat.data.numberInSurah
                  }
                ]
              }];
              this.web.Loading$.next(false);
            },
            error => {
              this.web.Loading$.next(false);
            }
          );
        } //If Quran
        //If Requesting Array Content
      } //(request)
    ); //IncomingRequests$ subscribe
  } //===============constructor===============//

  FilterContent(b: Lib3.HadithBlocks, lang: string) {
    let regexMatch = lang == "en" ? /en/g : lang == "ar" ? /ar/g : null;
    return b.content
      .filter(c => c.name.match(regexMatch))
      .map(x => {
        let v: Lib3.Value = {
          name: x.name.replace(/([a-z|A-Z]+):/g, ""),
          value: x.value,
          id: x.id
        };
        return v;
      })
      .sort((a, b) => parseInt(a.name) - parseInt(b.name)).slice();
  }
  notFoundSnack(str:string="",duration:number=3000){
    str=str?str:"Not found"
    this.snack.open(str, "X", {duration});
  }
  loadHadithBlocks(blocks:Lib3.HadithBlocks[], lang:string){
    let ContentAndRedArray: { content: Lib3.Value[]; refrence: Lib3.Refrence[] }[]=[]
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      ContentAndRedArray.push({
        content: this.FilterContent(b, lang),
        refrence: b.refrences
      });
    } //for 
    return ContentAndRedArray
  }
  CreateNavUrl() {
    let navurl="";
    let source = this.srv.source_options.value;
    let method = this.srv.rFPI.get("FetchingMethod").value;
    let number = this.srv.rFPI.get("number").value;
    let Ch = this.srv.rFPI.get("NewChapter").disabled
      ? this.srv.rFPI.get("OldChapter").value
      : this.srv.rFPI.get("NewChapter").value;
    let Hadith = this.srv.rFPI.get("NewHadith").disabled
      ? this.srv.rFPI.get("OldHadith").value
      : this.srv.rFPI.get("NewHadith").value;
    let tagNum = parseInt(this.srv.rFPI.get("OtherTag").value, 10);
    let tagChar = this.srv.rFPI.get("OtherTagChars").value;
    tagChar = tagChar == undefined || tagChar.length > 1 ? "" : tagChar;
    let surah = this.srv.rFQ.get("surah_number").value;
    let ayat = this.srv.rFQ.get("ayat_number").value;
    var inval: boolean = false;
    switch (source) {
      //If Bukhari
      case "bukhari": {
        switch (method) {
          case "number": {
            navurl = `${source}/${method}/${number}`;
            break;
          }
          case "new": {
            navurl = `${source}/${method}/${Ch}/${Hadith}`;
            break;
          }
          case "old": {
            navurl = `${source}/${method}/${Ch}/${Hadith}`;
            break;
          }
          default:
            break;
        } //Swich Child
        inval = this.srv.rFPI.invalid ? true : inval;
        break;
      }

      //Muslim
      case "muslim": {
        switch (method) {
          case "tag": {
            navurl =
              tagChar == undefined || tagChar.length > 1
                ? `${source}/${method}/${tagNum}`
                : `${source}/${method}/${tagNum}/${tagChar}`;
            break;
          }
          case "new": {
            navurl = `${source}/${method}/${Ch}/${Hadith}`;
            break;
          }
          case "old": {
            navurl = `${source}/${method}/${Ch}/${Hadith}`;
            break;
          }
          default:
            break;
        } //Swich Child
        inval = this.srv.rFPI.invalid ? true : inval;
        break;
      }

      //Quran
      case "quran": {
        navurl = `${source}/${surah}/${ayat}/`;
        inval = this.srv.rFQ.invalid ? true : inval;
        break;
      }
      default:
        inval = true;
        break;
    } //Swich Parent

    if (inval) {
      this.snack.open("Does not exist", "x", { duration: 5000 });
      return null;
    } else {
      this.router.navigate([navurl]);
      return navurl;
    }
  } //CreateNavUrl();
} //class