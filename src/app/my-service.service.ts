import { Injectable } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { HttpClient } from "@angular/common/http";
import { filter,map ,pluck,distinctUntilChanged} from 'rxjs/operators';
import { Subject, PartialObserver, Observable,BehaviorSubject } from 'rxjs';
import { ApiRequest, APiHadithRequest, HadithModel, ISource } from "./interfaces";
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Bindex, Mindex } from "./SourceOptions/myindex";
import * as _MuslimTag from "./topbar/muslimTagsfullchar.json";
import { WebService } from './web.service';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class MyServiceService {
  public Source:ISource;
  public Navigation$:Subject<{Action:string,Value?:string}>=new Subject<{Action:string,Value?:string}>();
  public ComponentTracker$:Subject<any>=new Subject();

  public WhenComponentLoads$:Subject<{componentname:string,type?:any,code?:any}>=new Subject();


  currentFetchingMethod;

  MuslimTag: string[] = _MuslimTag.default.tags as string[];
  rFQ: FormGroup;
  rFPI:FormGroup;
  OtherTagCharsArray;
  LoadedComponents:string[]=[];
  constructor(FormBuilder:FormBuilder,private web:WebService) {

    this.WhenComponentLoads$.subscribe(
      message=>{
        //If component already loaded exectue code
        if( this.LoadedComponents.indexOf(message.componentname) !=-1 ){
          //console.log("Component "+message.componentname+" Already loaded");
          message.code
        }

        //else wait for component to load then exectue code
        else{
          //console.log("Waiting for Component "+message.componentname+" To load");
          this.ComponentTracker$.subscribe(
            cname=>{
              //console.log("ComponentTracker$ event Is emited");
              //check if the loaded component is the one wanted
              if (cname==message.componentname) {
                //console.log("Component "+message.componentname+" Has loaded");
                this.LoadedComponents.push(message.componentname);
                message.code();
              }//if
            }
          );//ComponentTracker$
        }//eslse
      }
    );//ComponentMessages$


    this.rFPI = FormBuilder.group({
      FetchingMethod: [, /*"number"*/ [Validators.required]],
      number: [1, Validators.compose( [Validators.min(1)] )],
      NewChapter: [1, Validators.compose([Validators.min(1)] )],
      NewHadith: [1, Validators.compose( [Validators.min(1)])],
      OldVol: [{ value: null }],
      OldChapter: [ 1, Validators.compose([Validators.min(1)]) ],
      OldHadith: [ 1, Validators.compose( [Validators.min(1)]) ],
      OtherTag: [ 9 ],
      OtherTagChars: [ "" ],
      surah: [ 1 ],
      ayat: [ 1 ],
    });

    this.rFQ = FormBuilder.group({
      surah_number: [
        1,
        Validators.compose([
          Validators.required,
          Validators.max(114),
          Validators.min(1),
        ]),
      ],
      ayat_number: [
        1,
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(7),
        ]),
      ],
    });
  }

      //=======Initial Source
    /*
    let myAPI: IMyAPIFetchingMethod = {
      status: false,
      new: {
        status: false,
        ch: false,
        vol: false,
        ha: false,
      },
      old: {
        status: false,
        ch: false,
        vol: false,
        ha: false,
      },
      tag: {
        status: false,
        type: "",
      },
      number: false,
    };
    this.srv.Source = {
      source: {
        hadith: {
          status: false,
          muslim: false,
          bukhari: false,
          nasai: false,
          name: "",
          srcNu: 0,
        },
        quran: false,
      },
      methodAPI: {
        oldAPI: {
          state: false,
          fethingmethod: {
            status: false,
            ch: false,
            chOp: false,
            ha: false,
            haOp: false,
            nu: false,
          },
        },
        myAPI: myAPI,
      },
    };
    */
    //Initial Source=======
  

  
  //Validations
  UpdateInputDisable() {
    //console.log("UpdateInputDisable");

    if (
      this.rFPI.get("FetchingMethod").value == "number" 
      //&&this.currentFetchingMethod != "number"
    ) {
      this.rFPI.disable({ onlySelf: true, emitEvent: false });
      this.rFPI
        .get("FetchingMethod")
        .enable({ onlySelf: true, emitEvent: false });
      this.rFPI.get("number").enable({ onlySelf: true, emitEvent: false });
      //this.currentFetchingMethod = "number";
    }

    if (
      this.rFPI.get("FetchingMethod").value == "new" 
      //&&this.currentFetchingMethod != "new"
    ) {
      this.rFPI.disable({ onlySelf: true, emitEvent: false });
      this.rFPI
        .get("FetchingMethod")
        .enable({ onlySelf: true, emitEvent: false });
      //this.rFPI.get('NewVol').enable({onlySelf: true, emitEvent: false});
      this.rFPI.get("NewChapter").enable({ onlySelf: true, emitEvent: false });
      this.rFPI.get("NewHadith").enable({ onlySelf: true, emitEvent: false });
      //this.currentFetchingMethod = "new";
    }
    if (
      this.rFPI.get("FetchingMethod").value == "old" 
      //&&this.currentFetchingMethod != "old"
    ) {
      this.rFPI.disable({ onlySelf: true, emitEvent: false });
      this.rFPI
        .get("FetchingMethod")
        .enable({ onlySelf: true, emitEvent: false });
      //this.rFPI.get('OldVol').enable({onlySelf: true, emitEvent: false});
      this.rFPI.get("OldChapter").enable({ onlySelf: true, emitEvent: false });
      this.rFPI.get("OldHadith").enable({ onlySelf: true, emitEvent: false });
      //this.currentFetchingMethod = "old";
    }
    if (
      this.rFPI.get("FetchingMethod").value == "tag" 
      //&&this.currentFetchingMethod != "tag"
    ) {
      this.rFPI.disable({ onlySelf: true, emitEvent: false });
      this.rFPI
        .get("FetchingMethod")
        .enable({ onlySelf: true, emitEvent: false });
      this.rFPI.get("OtherTag").enable({ onlySelf: true, emitEvent: false });
      this.rFPI
        .get("OtherTagChars")
        .enable({ onlySelf: true, emitEvent: false });
      //this.currentFetchingMethod = "tag";
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

  HIndex(DeterminYouself:boolean,Indexpar?,Method?:string,Chapter?){
    var method=Method;
    var chapter = parseInt(Chapter, 10);
    var index=Indexpar;
    if (DeterminYouself) {
      index=this.Source.source.hadith.bukhari?Bindex:
      (method=="tag"&&this.Source.source.hadith.muslim)?this.MuslimTag:
      this.Source.source.hadith.muslim?Mindex:
      this.Source.source.hadith.nasai?null:null;
      
    }
    if(method=="tag"){
      let tagNumber = chapter;
      let tagString = index.find(s => s.match(/(\d+)/g) == tagNumber);
      let chars: string[];
      var CharsArray=null;
      if (tagString) {
        chars = tagString.match(/([A-z|a-z])/g);
        if (chars) {
          CharsArray=[]
          for (let i = 0; i < chars.length; i++) {
            CharsArray[i]={
              value :chars[i],
              name:this.upper(chars[i])
            }
            //CharsArray[i].value = chars[i];
           // CharsArray[i].name=this.upper(chars[i]);
          }
          //CharsArray = chars;
          //CharsArray = chars;
          //CharsArray.unshift("all");
          CharsArray.unshift({name:"All",value:""});
          //console.log("CharsArray");
          
          //console.log(CharsArray);
          
        }
      }
      return {CharsArray:CharsArray}
    }
    if(method=="new"){
      let Inew = index.newList.find(s => s.v1 == chapter);
      let maxNew = Inew ? Inew.v3 : null;
      return {max:maxNew,min:1};
    }
    if(method=="old"){
      let IoldL = index.oldList.find(s => s.v1 == chapter);
      let maxOld= IoldL ? IoldL.v3 : null;
      let minOld = IoldL ? IoldL.v2 : 1;
      return {max:maxOld,min:minOld};
    }

  }
    //call this everytime a chapter value changes
  ValidateHadithHadithInputs() {
    //console.log("\n Validate Hadith Inputs");
    //bukhari
    if (this.Source.source.hadith.bukhari) {
      if (//this.currentFetchingMethod == "new"
      this.rFPI.get("FetchingMethod").value == "new" 
      ) {
        //Get max
        let value = this.rFPI.get("NewChapter").value;
        this.rFPI.get("NewHadith").setValidators([
            Validators.required,
            Validators.max( this.HIndex(true,null,"new",value).max ),
            Validators.min(1),
          ]);
        this.rFPI.get("NewHadith").updateValueAndValidity();
      } else if (this.rFPI.get("FetchingMethod").value == "old"
      
      ) {
        //console.log("====oldValudate===");
        let value = parseInt(this.rFPI.get("OldChapter").value, 10);
        let vals = this.HIndex(true,null,"old",value);
        this.rFPI
          .get("OldHadith")
          .setValidators([
            Validators.required,
            Validators.max(vals.max),
            Validators.min(vals.min),
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
            Validators.max(this.HIndex(true,null,"new",value).max),
            Validators.min(1),
          ]);
        this.rFPI.get("NewHadith").updateValueAndValidity();
      } else if (this.rFPI.get("FetchingMethod").value == "old") {
        let value = this.rFPI.get("OldChapter").value;
        let vals =this.HIndex(true,null,"old",value);
        this.rFPI
          .get("OldHadith")
          .setValidators([
            Validators.required,
            Validators.max(vals.max),
            Validators.min(vals.min),
          ]);
        this.rFPI.get("OldHadith").updateValueAndValidity();
      } else if (this.rFPI.get("FetchingMethod").value == "tag") {
        let tagNumber = this.rFPI.get("OtherTag").value;
        let chars=this.HIndex(true,null,"tag",tagNumber).CharsArray
        this.OtherTagCharsArray=chars;
        if (chars) {
            //setTimeout(() => {
              this.rFPI.get("OtherTagChars").setValue("");
            //}, 100);
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

  CheckHadithValue(source:string,method:string,val1?,val2?){
    //console.log("CheckHadithValue");
    //console.log(source);
    //console.log(method);
    //console.log(val1);
    //console.log(val2);
    
    
    
    
    
    //Bukhari
    switch (source) {
      case "bukhari":
        {
          var invalid=method=="number"?false:method=="new"?false:method=="old"?false:true
          if ( invalid ||val1==null) {
            return invalid;
          }
          if (method=="number") {
            let invalid = val1<1||val1>7563?true:false;
            return invalid;
          }
          if (method=="new") {
            let invalid = val1<1||val1>97?true:false;
            if (invalid) {
              return invalid;
            }
            let maxHadaith = this.HIndex(false,Bindex,method,val1).max;
            let minHadith = this.HIndex(false,Bindex,method,val1).min;
            let invalid2 = val2<minHadith||val2>maxHadaith?true:false;
            return invalid2
          }//if "new"
          if (method=="old") {
            let invalid = val1<1||val1>93?true:false;
            if (invalid) {
              return invalid;
            }
            let maxHadaith = this.HIndex(false,Bindex,method,val1).max;
            let minHadith = this.HIndex(false,Bindex,method,val1).min;
            let invalid2 = val2<minHadith||val2>maxHadaith?true:false;
            return invalid2;
          }//if "old"
        }
        break;
    
      default:
      return true
        //break;
    }
  }
  isSourceValid(sourcePar:string){
    var source = this.lower(sourcePar)
    return source=="quran"||source=="bukhari"||source=="muslim"?true:false
  }
  isMethodaValid(sourcePar:string,methodPar:string){
    var source = this.lower(sourcePar);
    var method= this.lower(methodPar);
    //console.log("isMethodaValid()");
    //console.log("source =='"+source+"',and method =='"+method+"'");
    if (source == "quran") {
      return method==undefined||method==""?true:false
    }
    if (source == "bukhari"||source == "muslim") {
      if (method =="new"||method=="old") {
        return true
      }
      if (source == "bukhari") {
        if (method =="number") {
          return true
        }
      }
      if (source == "muslim") {
        if (method =="tag") {
          return true
        }
      }
    }
    //console.log("isMethodaValid()");
    //console.log("WARNING NO IF STATMENT WAS ENVOKED RETURNING FALSE");
    
    return false;

  }//isMethodValid

    //call this everytime a chapter value changes
  ValidateHadithHadithInputsBackUp() {
    //console.log("\n Validate Hadith Inputs");

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
            Validators.min(1),
          ]);
        this.rFPI.get("NewHadith").updateValueAndValidity();
      } else if (this.rFPI.get("FetchingMethod").value == "old") {
        //console.log("====oldValudate===");
        let chapter = parseInt(this.rFPI.get("OldChapter").value, 10);
        let Inew = Bindex.oldList.find(s => s.v1 == chapter);
        let max = Inew ? Inew.v3 : null;
        let min = Inew ? Inew.v2 : 1;
        this.rFPI
          .get("OldHadith")
          .setValidators([
            Validators.required,
            Validators.max(max),
            Validators.min(min),
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
            Validators.min(1),
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
            Validators.min(min),
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
    //console.log("\n Validate Chapter Inputs");
    //bukhari
    if (this.Source.source.hadith.bukhari) {
      if (this.rFPI.get("FetchingMethod").value == "number") {
        let numbermax = 7563;
        this.rFPI
          .get("number")
          .setValidators([
            Validators.required,
            Validators.max(numbermax),
            Validators.min(1),
          ]);
      }
      if (this.rFPI.get("FetchingMethod").value == "new") {
        let chaptermax = 97;
        this.rFPI
          .get("NewChapter")
          .setValidators([
            Validators.required,
            Validators.max(chaptermax),
            Validators.min(1),
          ]);
      }
      if (this.rFPI.get("FetchingMethod").value == "old") {
        let chaptermax = 93;
        this.rFPI
          .get("OldChapter")
          .setValidators([
            Validators.required,
            Validators.max(chaptermax),
            Validators.min(1),
          ]);
      }
    }

    //Muslim
    if (this.Source.source.hadith.muslim) {
      //console.log("\n muslim source validator");
      if (this.rFPI.get("FetchingMethod").value == "new") {
        let chaptermax = 56;
        this.rFPI
          .get("NewChapter")
          .setValidators([
            Validators.required,
            Validators.max(chaptermax),
            Validators.min(1),
          ]);
      }
      if (this.rFPI.get("FetchingMethod").value == "old") {
        let chaptermax = 43;
        this.rFPI
          .get("OldChapter")
          .setValidators([
            Validators.required,
            Validators.max(chaptermax),
            Validators.min(1),
          ]);
      }
      if (this.rFPI.get("FetchingMethod").value == "tag") {
        //console.log("tag validator was set")
        this.rFPI
          .get("OtherTag")
          .setValidators([
            Validators.required,
            Validators.max(3033),
            Validators.min(8),
          ]);
      }
    }

    //Nasai
    if (this.Source.source.hadith.nasai) {
      //console.log("\n muslim source validator");
      if (this.rFPI.get("FetchingMethod").value == "number") {
        let numbermax = 7471;
        this.rFPI
          .get("number")
          .setValidators([
            Validators.required,
            Validators.max(numbermax),
            Validators.min(1),
          ]);
      }
      if (this.rFPI.get("FetchingMethod").value == "new") {
        let chaptermax = 51;
        this.rFPI
          .get("NewChapter")
          .setValidators([
            Validators.required,
            Validators.max(chaptermax),
            Validators.min(1),
          ]);
      }
      if (this.rFPI.get("FetchingMethod").value == "old") {
        let chaptermax = 51;
        this.rFPI
          .get("OldChapter")
          .setValidators([
            Validators.required,
            Validators.max(chaptermax),
            Validators.min(1),
          ]);
      }
    }
  }

  lower(str){
    if( typeof str == "string"){

      if (str==null) {
        return null
      }
      else{
        return str.toLowerCase()
      }
    }
  }//lower
  upper(str){
    if( typeof str == "string"){

      if (str==null) {
        return null
      }
      else{
        return str.toUpperCase()
      }
    }
  }//upper

  copyMessage(val: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
