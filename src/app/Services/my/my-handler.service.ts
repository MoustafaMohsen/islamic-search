import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { ISource } from "../../interfaces";
import { Bindex, Mindex } from "../../Statics/myindex";
import * as _MuslimTag from "../../Statics/muslimTagsfullchar.json";
import { WebService } from "../web/web.service";
declare var $: any;

@Injectable({
  providedIn: "root"
})
export class MyServiceService {
  public Source: ISource;
  public Navigation$: Subject<{
    Action: string;
    Value?: string;
  }> = new Subject<{ Action: string; Value?: string }>();
  public ComponentTracker$: Subject<any> = new Subject();

  currentFetchingMethod;

  MuslimTag: string[] = _MuslimTag.default.tags as string[];
  rFQ: FormGroup;
  rFPI: FormGroup;
  OtherTagCharsArray;
  LoadedComponents: string[] = [];
  constructor(FormBuilder: FormBuilder, private web: WebService) {
    this.rFPI = FormBuilder.group({
      FetchingMethod: [, /*"number"*/ [Validators.required]],
      number: [1, Validators.compose([Validators.min(1)])],
      NewChapter: [1, Validators.compose([Validators.min(1)])],
      NewHadith: [1, Validators.compose([Validators.min(1)])],
      OldVol: [{ value: null }],
      OldChapter: [1, Validators.compose([Validators.min(1)])],
      OldHadith: [1, Validators.compose([Validators.min(1)])],
      OtherTag: [9],
      OtherTagChars: [""],
      surah: [1],
      ayat: [1]
    });

    this.rFQ = FormBuilder.group({
      surah_number: [
        1,
        Validators.compose([
          Validators.required,
          Validators.max(114),
          Validators.min(1)
        ])
      ],
      ayat_number: [
        1,
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(7)
        ])
      ]
    });
  }

  //Validations
  UpdateInputDisable() {
    if (this.rFPI.get("FetchingMethod").value == "number") {
      this.rFPI.disable({ onlySelf: true, emitEvent: false });
      this.rFPI
        .get("FetchingMethod")
        .enable({ onlySelf: true, emitEvent: false });
      this.rFPI.get("number").enable({ onlySelf: true, emitEvent: false });
    }

    if (this.rFPI.get("FetchingMethod").value == "new") {
      this.rFPI.disable({ onlySelf: true, emitEvent: false });
      this.rFPI
        .get("FetchingMethod")
        .enable({ onlySelf: true, emitEvent: false });

      this.rFPI.get("NewChapter").enable({ onlySelf: true, emitEvent: false });
      this.rFPI.get("NewHadith").enable({ onlySelf: true, emitEvent: false });
    }
    if (this.rFPI.get("FetchingMethod").value == "old") {
      this.rFPI.disable({ onlySelf: true, emitEvent: false });
      this.rFPI
        .get("FetchingMethod")
        .enable({ onlySelf: true, emitEvent: false });

      this.rFPI.get("OldChapter").enable({ onlySelf: true, emitEvent: false });
      this.rFPI.get("OldHadith").enable({ onlySelf: true, emitEvent: false });
    }
    if (this.rFPI.get("FetchingMethod").value == "tag") {
      this.rFPI.disable({ onlySelf: true, emitEvent: false });
      this.rFPI
        .get("FetchingMethod")
        .enable({ onlySelf: true, emitEvent: false });
      this.rFPI.get("OtherTag").enable({ onlySelf: true, emitEvent: false });
      this.rFPI
        .get("OtherTagChars")
        .enable({ onlySelf: true, emitEvent: false });
    }
  }

  ValidateHadithInputs(change) {
    switch (change) {
      case "chapter":
        this.ValidateHadithHadithInputs();
        break;
      case "method":
        this.ValidateChapterInputs();
        break;

      default:
        break;
    }
  }

  HIndex(DeterminYouself: boolean, Indexpar?, Method?: string, Chapter?) {
    var method = Method;
    var chapter = parseInt(Chapter, 10);
    var index = Indexpar;
    if (DeterminYouself) {
      index = this.Source.source.hadith.bukhari
        ? Bindex
        : method == "tag" && this.Source.source.hadith.muslim
          ? this.MuslimTag
          : this.Source.source.hadith.muslim
            ? Mindex
            : this.Source.source.hadith.nasai
              ? null
              : null;
    }
    if (method == "tag") {
      let tagNumber = chapter;
      let tagString = index.find(s => s.match(/(\d+)/g) == tagNumber);
      let chars: string[];
      var CharsArray = null;
      if (tagString) {
        chars = tagString.match(/([A-z|a-z])/g);
        if (chars) {
          CharsArray = [];
          for (let i = 0; i < chars.length; i++) {
            CharsArray[i] = {
              value: chars[i],
              name: this.upper(chars[i])
            };
          }

          CharsArray.unshift({ name: "All", value: "" });
        }
      }
      return { CharsArray: CharsArray };
    }
    if (method == "new") {
      let Inew = index.newList.find(s => s.v1 == chapter);
      let maxNew = Inew ? Inew.v3 : null;
      return { max: maxNew, min: 1 };
    }
    if (method == "old") {
      let IoldL = index.oldList.find(s => s.v1 == chapter);
      let maxOld = IoldL ? IoldL.v3 : null;
      let minOld = IoldL ? IoldL.v2 : 1;
      return { max: maxOld, min: minOld };
    }
  }
  //call this everytime a chapter value changes
  ValidateHadithHadithInputs() {
    //bukhari
    if (this.Source.source.hadith.bukhari) {
      if (this.rFPI.get("FetchingMethod").value == "new") {
        //Get max
        let value = this.rFPI.get("NewChapter").value;
        this.rFPI
          .get("NewHadith")
          .setValidators([
            Validators.required,
            Validators.max(this.HIndex(true, null, "new", value).max),
            Validators.min(1)
          ]);
        this.rFPI.get("NewHadith").updateValueAndValidity();
      } else if (this.rFPI.get("FetchingMethod").value == "old") {
        let value = parseInt(this.rFPI.get("OldChapter").value, 10);
        let vals = this.HIndex(true, null, "old", value);
        this.rFPI
          .get("OldHadith")
          .setValidators([
            Validators.required,
            Validators.max(vals.max),
            Validators.min(vals.min)
          ]);
        this.rFPI.get("OldHadith").updateValueAndValidity();
      }
    } //if Bukhari

    //muslim
    if (this.Source.source.hadith.muslim) {
      if (this.rFPI.get("FetchingMethod").value == "new") {
        //Get max
        let value = this.rFPI.get("NewChapter").value;
        this.rFPI
          .get("NewHadith")
          .setValidators([
            Validators.required,
            Validators.max(this.HIndex(true, null, "new", value).max),
            Validators.min(1)
          ]);
        this.rFPI.get("NewHadith").updateValueAndValidity();
      } else if (this.rFPI.get("FetchingMethod").value == "old") {
        let value = this.rFPI.get("OldChapter").value;
        let vals = this.HIndex(true, null, "old", value);
        this.rFPI
          .get("OldHadith")
          .setValidators([
            Validators.required,
            Validators.max(vals.max),
            Validators.min(vals.min)
          ]);
        this.rFPI.get("OldHadith").updateValueAndValidity();
      } else if (this.rFPI.get("FetchingMethod").value == "tag") {
        let tagNumber = this.rFPI.get("OtherTag").value;
        let chars = this.HIndex(true, null, "tag", tagNumber).CharsArray;
        this.OtherTagCharsArray = chars;
        if (chars) {
          this.rFPI.get("OtherTagChars").setValue("");
        }
      }
    } //if muslim
    //Nasai Is temporarily Disabled
    {
      //nasai
      /*
      if(this.Source.source.hadith.nasai){
        console.log("\n muslim source validator");
        if (this.currentFetchingMethod=="number") {
        this.rFPI.get("number").setValidators([Validators.required,Validators.max(5758),Validators.min(1)])
      }
      else if(this.currentFetchingMethod=="new"){
        //Get max
        let chapter = this.rFPI.get("NewChapter").value;
        let bnew = nasaiIndexChapter.bnew.find( (s)=>s.nc == chapter );
        if (!bnew) {
          console.log("====bold is null===");
          console.log(chapter);
        }
        let max = bnew?bnew.nh : null;
        //let min =Previousbnew?Previousbnew.nh : 1;
        this.rFPI.get("NewHadith").setValidators([Validators.required,Validators.max(max),Validators.min(1)])
        this.rFPI.get("NewHadith").updateValueAndValidity();
        //console.log("ch:"+chapter+" max:"+max+" min:"+min);
        
      }
      else if(this.currentFetchingMethod=="old"){
        console.log("====oldValudate===");
        let chapter = this.rFPI.get("OldChapter").value ;
        let bold = nasaiIndexChapter.bold.find( (s)=>s.oc == chapter )
        if (!bold) {
          console.log("====bold is null===");
          console.log(chapter);
        }
        let min = bold?bold.ohf : null;
        let max = bold?bold.oh : null;
        this.rFPI.get("OldHadith").setValidators([Validators.required,Validators.max(max),Validators.min(1)])
        this.rFPI.get("OldHadith").updateValueAndValidity();
        console.log("ch:"+chapter+" max:"+max+" min:"+ 1);
      }
      
    }//if nasai
    */
    }
  }

  CheckHadithValue(source: string, method: string, val1?, val2?) {
    //Bukhari
    switch (source) {
      case "bukhari":
        {
          var invalid =
            method == "number"
              ? false
              : method == "new"
                ? false
                : method == "old"
                  ? false
                  : true;
          if (invalid || val1 == null) {
            return invalid;
          }
          if (method == "number") {
            let invalid = val1 < 1 || val1 > 7563 ? true : false;
            return invalid;
          }
          if (method == "new") {
            let invalid = val1 < 1 || val1 > 97 ? true : false;
            if (invalid) {
              return invalid;
            }
            let maxHadaith = this.HIndex(false, Bindex, method, val1).max;
            let minHadith = this.HIndex(false, Bindex, method, val1).min;
            let invalid2 = val2 < minHadith || val2 > maxHadaith ? true : false;
            return invalid2;
          } //if "new"
          if (method == "old") {
            let invalid = val1 < 1 || val1 > 93 ? true : false;
            if (invalid) {
              return invalid;
            }
            let maxHadaith = this.HIndex(false, Bindex, method, val1).max;
            let minHadith = this.HIndex(false, Bindex, method, val1).min;
            let invalid2 = val2 < minHadith || val2 > maxHadaith ? true : false;
            return invalid2;
          } //if "old"
        }
        break;

      default:
        return true;
      //break;
    }
  }
  isSourceValid(sourcePar: string) {
    var source = this.lower(sourcePar);
    return source == "quran" || source == "bukhari" || source == "muslim"
      ? true
      : false;
  }
  isMethodaValid(sourcePar: string, methodPar: string) {
    var source = this.lower(sourcePar);
    var method = this.lower(methodPar);

    if (source == "quran") {
      return method == undefined || method == "" ? true : false;
    }
    if (source == "bukhari" || source == "muslim") {
      if (method == "new" || method == "old") {
        return true;
      }
      if (source == "bukhari") {
        if (method == "number") {
          return true;
        }
      }
      if (source == "muslim") {
        if (method == "tag") {
          return true;
        }
      }
    }

    return false;
  } //isMethodValid

  //call this everytime a chapter value changes
  ValidateHadithHadithInputsBackUp() {
    //bukhari
    if (this.Source.source.hadith.bukhari) {
      if (this.rFPI.get("FetchingMethod").value == "new") {
        //Get max
        let chapter = this.rFPI.get("NewChapter").value;
        let Inew = Bindex.newList.find(s => s.v1 == chapter);
        let max = Inew ? Inew.v3 : null;
        this.rFPI
          .get("NewHadith")
          .setValidators([
            Validators.required,
            Validators.max(max),
            Validators.min(1)
          ]);
        this.rFPI.get("NewHadith").updateValueAndValidity();
      } else if (this.rFPI.get("FetchingMethod").value == "old") {
        let chapter = parseInt(this.rFPI.get("OldChapter").value, 10);
        let Inew = Bindex.oldList.find(s => s.v1 == chapter);
        let max = Inew ? Inew.v3 : null;
        let min = Inew ? Inew.v2 : 1;
        this.rFPI
          .get("OldHadith")
          .setValidators([
            Validators.required,
            Validators.max(max),
            Validators.min(min)
          ]);
        this.rFPI.get("OldHadith").updateValueAndValidity();
      }
    } //if Bukhari

    //muslim
    if (this.Source.source.hadith.muslim) {
      if (this.rFPI.get("FetchingMethod").value == "new") {
        //Get max
        let chapter = this.rFPI.get("NewChapter").value;
        let Inew = Mindex.newList.find(s => s.v1 == chapter);
        let max = Inew ? Inew.v3 : null;
        this.rFPI
          .get("NewHadith")
          .setValidators([
            Validators.required,
            Validators.max(max),
            Validators.min(1)
          ]);
        this.rFPI.get("NewHadith").updateValueAndValidity();
      } else if (this.rFPI.get("FetchingMethod").value == "old") {
        let chapter = this.rFPI.get("OldChapter").value;
        let Iold = Mindex.oldList.find(s => s.v1 == chapter);
        let max = Iold ? Iold.v3 : null;
        let min = Iold ? Iold.v2 : null;
        this.rFPI
          .get("OldHadith")
          .setValidators([
            Validators.required,
            Validators.max(max),
            Validators.min(min)
          ]);
        this.rFPI.get("OldHadith").updateValueAndValidity();
      } else if (this.rFPI.get("FetchingMethod").value == "tag") {
        let tagNumber = this.rFPI.get("OtherTag").value;
        let tag = this.MuslimTag.find(s => s.match(/(\d+)/g) == tagNumber);
        let chars: string[];
        if (tag) {
          chars = tag.match(/([A-z|a-z])/g);
          if (chars) {
            this.OtherTagCharsArray = chars;
            this.OtherTagCharsArray.unshift("all");
            setTimeout(() => {
              this.rFPI.get("OtherTagChars").setValue("");
            }, 100);
          } else {
            this.OtherTagCharsArray = null;
          }
        }
      }
    } //if muslim
    //Nasai Is temporarily Disabled
    {
      //nasai
      /*
      if(this.Source.source.hadith.nasai){
        console.log("\n muslim source validator");
        if (this.rFPI.get("FetchingMethod").value=="number") {
        this.rFPI.get("number").setValidators([Validators.required,Validators.max(5758),Validators.min(1)])
      }
      else if(this.rFPI.get("FetchingMethod").value=="new"){
        //Get max
        let chapter = this.rFPI.get("NewChapter").value;
        let bnew = nasaiIndexChapter.bnew.find( (s)=>s.nc == chapter );
        if (!bnew) {
          console.log("====bold is null===");
          console.log(chapter);
        }
        let max = bnew?bnew.nh : null;
        //let min =Previousbnew?Previousbnew.nh : 1;
        this.rFPI.get("NewHadith").setValidators([Validators.required,Validators.max(max),Validators.min(1)])
        this.rFPI.get("NewHadith").updateValueAndValidity();
        //console.log("ch:"+chapter+" max:"+max+" min:"+min);
        
      }
      else if(this.rFPI.get("FetchingMethod").value=="old"){
        console.log("====oldValudate===");
        let chapter = this.rFPI.get("OldChapter").value ;
        let bold = nasaiIndexChapter.bold.find( (s)=>s.oc == chapter )
        if (!bold) {
          console.log("====bold is null===");
          console.log(chapter);
        }
        let min = bold?bold.ohf : null;
        let max = bold?bold.oh : null;
        this.rFPI.get("OldHadith").setValidators([Validators.required,Validators.max(max),Validators.min(1)])
        this.rFPI.get("OldHadith").updateValueAndValidity();
        console.log("ch:"+chapter+" max:"+max+" min:"+ 1);
      }
      
    }//if nasai
    */
    }
  }
  //call this only once a new method is selected Or number is set
  ValidateChapterInputs() {
    //bukhari
    if (this.Source.source.hadith.bukhari) {
      if (this.rFPI.get("FetchingMethod").value == "number") {
        let numbermax = 7563;
        this.rFPI
          .get("number")
          .setValidators([
            Validators.required,
            Validators.max(numbermax),
            Validators.min(1)
          ]);
      }
      if (this.rFPI.get("FetchingMethod").value == "new") {
        let chaptermax = 97;
        this.rFPI
          .get("NewChapter")
          .setValidators([
            Validators.required,
            Validators.max(chaptermax),
            Validators.min(1)
          ]);
      }
      if (this.rFPI.get("FetchingMethod").value == "old") {
        let chaptermax = 93;
        this.rFPI
          .get("OldChapter")
          .setValidators([
            Validators.required,
            Validators.max(chaptermax),
            Validators.min(1)
          ]);
      }
    }

    //Muslim
    if (this.Source.source.hadith.muslim) {
      if (this.rFPI.get("FetchingMethod").value == "new") {
        let chaptermax = 56;
        this.rFPI
          .get("NewChapter")
          .setValidators([
            Validators.required,
            Validators.max(chaptermax),
            Validators.min(1)
          ]);
      }
      if (this.rFPI.get("FetchingMethod").value == "old") {
        let chaptermax = 43;
        this.rFPI
          .get("OldChapter")
          .setValidators([
            Validators.required,
            Validators.max(chaptermax),
            Validators.min(1)
          ]);
      }
      if (this.rFPI.get("FetchingMethod").value == "tag") {
        this.rFPI
          .get("OtherTag")
          .setValidators([
            Validators.required,
            Validators.max(3033),
            Validators.min(8)
          ]);
      }
    }

    //Nasai
    if (this.Source.source.hadith.nasai) {
      if (this.rFPI.get("FetchingMethod").value == "number") {
        let numbermax = 7471;
        this.rFPI
          .get("number")
          .setValidators([
            Validators.required,
            Validators.max(numbermax),
            Validators.min(1)
          ]);
      }
      if (this.rFPI.get("FetchingMethod").value == "new") {
        let chaptermax = 51;
        this.rFPI
          .get("NewChapter")
          .setValidators([
            Validators.required,
            Validators.max(chaptermax),
            Validators.min(1)
          ]);
      }
      if (this.rFPI.get("FetchingMethod").value == "old") {
        let chaptermax = 51;
        this.rFPI
          .get("OldChapter")
          .setValidators([
            Validators.required,
            Validators.max(chaptermax),
            Validators.min(1)
          ]);
      }
    }
  }

  lower(str) {
    if (typeof str == "string") {
      if (str == null) {
        return null;
      } else {
        return str.toLowerCase();
      }
    }
  } //lower
  upper(str) {
    if (typeof str == "string") {
      if (str == null) {
        return null;
      } else {
        return str.toUpperCase();
      }
    }
  } //upper

  copyMessage(val: string) {
    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
  }
}
