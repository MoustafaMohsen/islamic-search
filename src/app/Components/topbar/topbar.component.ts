import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { IMyAPIFetchingMethod, Lib3 } from "../../interfaces";
import { MyServiceService } from "../../Services/my/my-handler.service";
import { QuranIndex } from "../../Statics/Quran";
import { WebService } from "../../Services/web/web.service";
import { RequestService } from "src/app/Services/request/request.service";
declare var $: any;

@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
  styleUrls: ["./topbar.component.css"]
})
export class TopbarComponent implements OnInit {
  ayatMax: number;
  myUsingOptions: { value: string; englishName: string }[] = [];
  IncomingRequest: Lib3.IncomingRequest;
  //ArContentAndRedArray: { content: Lib3.Value[]; refrence: Lib3.Refrence[] }[]; //=[[]];
  //EnContentAndRedArray: { content: Lib3.Value[]; refrence: Lib3.Refrence[] }[]; //=[[]];
  CompLoaded: boolean = false;
  constructor(
    public web: WebService,
    private snack: MatSnackBar,
    public srv: MyServiceService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public request:RequestService
  ) {}

  //=======================================================================================ngOnInit//
  //=======================================================================================ngOnInit//
  ngOnInit() {
    //Initial Source=======
    // TODO: Seperate Route handling, Remove timout
    this.activatedRoute.params.subscribe(p => {
      var AlrSent = t => {
        this.snack.open("alread sent", "x", { duration: t });
      };
      setTimeout(() => {
        this.CompLoaded = true;
      }, 100);
      //If not Navigated

      if (!this.CompLoaded) {
        this.UpdateSource("quran");
        this.srv.source_options.setValue("quran", { emitEvent: true });
        this.SetMaxAyat(this.srv.rFQ.get("ayat_number"), 1);
      }
      if (Object.keys(p).length != 0) {
        //If quran
        if (this.srv.lower(p.source) == "quran") {
          var request = this.CreateRquestFromUrl(p.source, "", p.par1, p.par2);
          if (!request) {
            setTimeout(() => {
              this.snack.open("Does not exist", "x", { duration: 5000 });
            }, 1000);
            this.router.navigate([""]);
            return;
          }
          if (this.IncomingRequest == request) {
            AlrSent(1000);
            return;
          } else {
            this.web.IncomingRequests$.next(request);
          }
          this.IncomingRequest = request;
        }
        //If hadith
        else {
          request = this.CreateRquestFromUrl(p.source, p.par1, p.par2, p.par3);
          if (!request) {
            setTimeout(() => {
              this.snack.open("Does not exist", "x", { duration: 5000 });
            }, 1000);
            this.router.navigate([""]);
            return;
          }
          if (this.IncomingRequest == request) {
            AlrSent(1000);
            this.IncomingRequest = request;
            return;
          }
          this.web.IncomingRequests$.next(request);
        }
      }
      //if just open HOME page
      else {
        this.UpdateSource("quran");
        this.srv.source_options.setValue("quran", { emitEvent: true });
        this.SetMaxAyat(this.srv.rFQ.get("ayat_number"), 1);
        //DELETE LINE
      }
      
    });

    this.srv.UpdateInputDisable();
    this.srv.source_options.valueChanges.subscribe(value => {
      //emit value change
      this.srv.rFPI
        .get("FetchingMethod")
        .setValue(this.fh["FetchingMethod"].value);
      //update Source
      this.UpdateSource(value);
      this.srv.ValidateHadithInputs("method");
    });

    //=======Value Changes
    this.srv.rFQ.get("surah_number").valueChanges.subscribe(value => {
      this.SetMaxAyat(this.srv.rFQ.get("ayat_number"), value);
    });
    this.fh["NewChapter"].valueChanges.subscribe(value => {
      this.srv.ValidateHadithInputs("chapter");
    });
    this.fh["OldChapter"].valueChanges.subscribe(value => {
      this.srv.ValidateHadithInputs("chapter");
    });
    this.fh["OtherTag"].valueChanges.subscribe(value => {
      this.srv.ValidateHadithInputs("chapter");
    });
    this.fh["FetchingMethod"].valueChanges.subscribe(value => {
      this.srv.UpdateInputDisable();
      this.srv.ValidateHadithInputs("method");
    });
    //Value Changes=======

    //Set my Use Options========
    this.srv.Navigation$.subscribe(data => {
      switch (data.Action) {
        case "next":
          this.Next();
          break;
        case "previous":
          this.Previous();
          break;
        default:
          break;
      }
    });
  } //ngOnInit========================================================================================//

  //==========================================================================Validations//

  get fh (){
    return this.srv.rFPI.controls
  }
  get fq (){
    return this.srv.rFQ.controls
  }

  SetMaxAyat(ayat_number: AbstractControl, surahNumber) {
    let suran = surahNumber;
    if (suran <= 0 || suran > 114) return;
    let Surrah = QuranIndex.filter(f => f.number == suran);
    this.ayatMax = Surrah[0].numberOfAyahs;
    ayat_number.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(this.ayatMax)
    ]);
    ayat_number.updateValueAndValidity();
  }

  UpdateSource(Source) {
    var value = this.srv.lower(Source);
    let myAPI: IMyAPIFetchingMethod = {
      name: "",
      status: false,
      new: {
        status: false,
        ch: false,
        vol: false,
        ha: false
      },
      old: {
        status: false,
        ch: false,
        vol: false,
        ha: false
      },
      tag: {
        status: false,
        type: ""
      },
      number: false
    };
    this.srv.Source = {
      source: {
        hadith: {
          status: false,
          muslim: false,
          bukhari: false,
          nasai: false,
          name: "",
          srcNu: 0
        },
        quran: false
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
            nu: false
          }
        },
        myAPI: myAPI
      }
    };

    if (value == "bukhari") {
      //Set Default FetchingMethod
      this.fh["FetchingMethod"].setValue("number");
      this.myUsingOptions = [
        { value: "number", englishName: "Hadith Number" },
        { value: "new", englishName: "In Book Refrence" },
        { value: "old", englishName: "USC-MSA Refrence" }
      ];

      this.srv.Source = null;
      let myAPI: IMyAPIFetchingMethod = {
        name: "bukhari",
        status: true,
        new: {
          status: true,
          ch: true,
          vol: false,
          ha: true
        },
        old: {
          status: true,
          ch: true,
          vol: false,
          ha: true
        },
        tag: {
          status: false,
          type: ""
        },
        number: true
      };
      this.srv.Source = {
        source: {
          hadith: {
            status: true,
            muslim: false,
            bukhari: true,
            nasai: false,
            name: "bukhari",
            srcNu: 1
          },
          quran: false
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
              nu: false
            }
          },
          myAPI: myAPI
        }
      };
    } //if("Bukhari")

    if (value == "muslim") {
      //Set Default FetchingMethod
      this.fh["FetchingMethod"].setValue("tag");
      //Update Validators
      this.srv.ValidateHadithInputs("method");

      this.myUsingOptions = [
        { value: "tag", englishName: "Reference" },
        { value: "new", englishName: "In Book Refrence" },
        { value: "old", englishName: "USC-MSA Refrence" }
      ];

      this.srv.Source = null;
      let myAPI: IMyAPIFetchingMethod = {
        name: "muslim",
        status: true,
        new: {
          status: true,
          ch: true,
          vol: false,
          ha: true
        },
        old: {
          status: true,
          ch: true,
          vol: false,
          ha: true
        },
        tag: {
          status: true,
          type: "muslim"
        },
        number: false
      };

      this.srv.Source = {
        source: {
          hadith: {
            status: true,
            muslim: true,
            bukhari: false,
            nasai: false,
            name: "muslim",
            srcNu: 2
          },
          quran: false
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
              nu: false
            }
          },
          myAPI: myAPI
        }
      };
    } //if("Muslim")

    if (value == "nasai") {
      //Set Default FetchingMethod
      this.fh["FetchingMethod"].setValue("number");
      this.myUsingOptions = [
        { value: "number", englishName: "Hadith Number" },
        { value: "new", englishName: "In Book Refrence" },
        { value: "old", englishName: "USC-MSA Refrence" }
      ];

      this.srv.Source = null;
      let myAPI: IMyAPIFetchingMethod = {
        name: "nasai",
        status: true,
        new: {
          status: true,
          ch: true,
          vol: false,
          ha: true
        },
        old: {
          status: true,
          ch: true,
          vol: false,
          ha: true
        },
        tag: {
          status: false,
          type: ""
        },
        number: true
      };

      this.srv.Source = {
        source: {
          hadith: {
            status: true,
            muslim: false,
            bukhari: false,
            nasai: true,
            name: "nasai",
            srcNu: 3
          },
          quran: false
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
              nu: false
            }
          },
          myAPI: myAPI
        }
      };
    } //if("Nasai")

    if (value == "quran") {
      this.srv.Source = null;

      let myAPI: IMyAPIFetchingMethod = {
        name: "",
        status: false,
        new: {
          status: false,
          ch: false,
          vol: false,
          ha: false
        },
        old: {
          status: false,
          ch: false,
          vol: false,
          ha: false
        },
        tag: {
          status: false,
          type: ""
        },
        number: false
      };

      this.srv.Source = {
        source: {
          hadith: {
            status: false,
            muslim: false,
            bukhari: false,
            nasai: false,
            name: "",
            srcNu: 0
          },
          quran: true
        },
        methodAPI: {
          oldAPI: {
            state: true,
            fethingmethod: {
              status: true,
              ch: true,
              chOp: false,
              ha: true,
              haOp: false,
              nu: false
            }
          },
          myAPI: myAPI
        }
      };
    } //if("Quran")
  } //SourceToHtmlController()


  //=============Navidations//
  Previous() {
    if (
      this.srv.Source.methodAPI.myAPI &&
      this.srv.Source.source.hadith.status
    ) {
      this.srv.rFPI
        .get("number")
        .setValue(this.fh["number"].value - 1);
    }

    if (this.srv.Source.source.quran) {
      let ayat = this.srv.rFQ.get("ayat_number").value - 1;
      if (ayat <= 0) return;
      this.srv.rFQ.get("ayat_number").setValue(ayat);
    }
  }

  Next() {
    if (
      this.srv.Source.methodAPI.myAPI &&
      this.srv.Source.source.hadith.status
    ) {
      this.srv.rFPI
        .get("number")
        .setValue(this.fh["number"].value + 1);
    }

    if (this.srv.Source.source.quran) {
      let ayat = this.srv.rFQ.get("ayat_number").value + 1;
      if (ayat > this.ayatMax) return;
      this.srv.rFQ.get("ayat_number").setValue(ayat);
    }
  }
  //Navidations=============//


  CreateRquestFromUrl(
    sourceParameter?: string,
    methodParameter?: string,
    val1?,
    val2?,
    val3?
  ) {
    var SetValues=(name:string,value:any,validate="",touch=true,form?:{[key: string]: AbstractControl;})=>{
      form=form?form:this.fh;      
      form[name].setValue(value);
      if(validate)
      this.srv.ValidateHadithInputs(validate);
      if(touch)
      form[name].markAsTouched();
    }
    var createRequest=(source:string,method:number,type:string,name?:string,_src?:number,
      value1?:number,value2?:number,value3?:number,value4?:number,
      tag1?:number,tag2?:number,lang?:number,url?:string
      )=>{
      var minus=(val)=>{
        return val||val==0?val:-2
      }
      var emptyfy=(str)=>{
        return str?str:"";
      }
      let request_obj: Lib3.IncomingRequest = {
        Method: method,
        Refrencetype: type,
        src: _src,
        name:emptyfy(name),
        tag1: emptyfy(tag1),
        tag2: emptyfy(tag2),
        value1:minus(value1),
        value2:minus(value2),
        value3:minus(value3),
        value4:minus(value4),
        source: source,
        lang:emptyfy(lang),
        url:emptyfy(url),
      };
      console.log(request_obj);
      
      return request_obj; 
    }
    
    var noChange=(controller_name:string,compared_value:any,form?:{[key: string]: AbstractControl;})=>{
      form=form?form:this.fh;
      return this.fh[controller_name].value != compared_value
    }
    var request_obj: Lib3.IncomingRequest;

    let source: string = this.srv.lower(sourceParameter);
    let method: string = this.srv.lower(methodParameter);

    let number: number = parseInt(val1);

    /// TODO: Make a Volume getter
    let Vol:number = null;

    let Ch: number = val1;
    let Hadith: number = val2;

    let surah: number = val1;
    let ayat: number = val2;

    let tagNum = parseInt(val1);
    let tagChar = val2== undefined  || val2.length > 1 ? "" : val2 ;
    console.log("CreateRquestFromUrl()");
    console.log("tagChar");
    console.log(tagChar);

    var inval: boolean = false;

    if (
      !this.srv.isMethodaValid(source, method) ||
      !this.srv.isSourceValid(source)
    ) {
      return null;
    }

    switch (source) {
      //If Bukhari
      case "bukhari": {
        if (this.srv.source_options.value != source) {
          this.UpdateSource(source);

          this.srv.source_options.setValue(source);
        }

        switch (method) {
          case "number": {
            if (
              noChange('number',number)||
              noChange('FetchingMethod',method)
            ) {
              SetValues("FetchingMethod",method,'',false)
              SetValues("number",number,'method')
            }
            request_obj=createRequest("hadith",6,"hadith","DarusSalam",1,number)

            break;
          }

          case "new": {
            if (
              noChange('NewChapter',Ch)||
              noChange('NewHadith',Hadith)||
              noChange('FetchingMethod',method)
            ) {
              SetValues("FetchingMethod",method,'method',false)
              SetValues("NewChapter",Ch,'chapter')
              SetValues("NewHadith",Hadith)
            }

            request_obj=createRequest("hadith",6,"book hadith","In-Book",1,Ch,Hadith)


            break;
          }
          case "old": {
            if (
              noChange('OldChapter',Ch)||
              noChange('OldHadith',Hadith)||
              noChange('FetchingMethod',method)
            ) {
              SetValues("FetchingMethod",method,'method',false)
              SetValues("OldChapter",Ch,'chapter')
              SetValues("OldHadith",Hadith)
            }
            request_obj=createRequest("hadith",6,"vol book hadith","USC-MSA",1,Vol,Ch,Hadith)
            break;
          }

          default:
            break;
        } //Swich Child

        if (this.srv.rFPI.invalid) inval = true;

        break;
      }

      //Muslim
      case "muslim": {
        if (this.srv.source_options.value != source) {
          this.UpdateSource(source);
          this.srv.source_options.setValue(this.srv.lower(source));
        }
        switch (method) {
          case "tag": {
            if (noChange('OtherTag',tagNum)||noChange('FetchingMethod',method)) {
              SetValues("FetchingMethod",method,"",false)
              SetValues("OtherTag",tagNum,"method")
              SetValues("OtherTagChars",tagChar,"chapter")
            }
            if (tagChar == "") {
              request_obj=createRequest("hadith",6,"muslim tag","Reference",2,null,null,null,tagNum)
            } else {
              request_obj=createRequest("hadith",6,"muslim tag","Reference",2,null,null,null,tagNum,tagChar)
            }
            break;
          }
          case "new": {
            if (
              noChange('NewChapter',Ch)||
              noChange('NewHadith',Hadith)||
              noChange('FetchingMethod',method)
            ) {
              SetValues("FetchingMethod",method,"method",false)
              SetValues("NewChapter",Ch,"chapter")
              SetValues("NewHadith",Hadith)
            }
            request_obj=createRequest("hadith",6,"book hadith","In-Book",2,Ch,Hadith);
            break;
          }
          case "old": {
            if (
              noChange('OldChapter',Ch)||
              noChange('OldHadith',Hadith)||
              noChange('FetchingMethod',method)
              ) {
              SetValues("FetchingMethod",method,"method",false)
              SetValues("OldChapter",Ch,"chapter")
              SetValues("OldHadith",Hadith)
            }
            request_obj=createRequest("hadith",6,"book hadith","USC-MSA",2,Ch,Hadith);
            break;
          }
          default:
            break;
        } //Swich Child

        if (this.srv.rFPI.invalid) inval = true;
        break;
      }

      //Quran
      case "quran": {
        if (this.srv.source_options.value != source) {
          this.UpdateSource(source);
          this.srv.source_options.setValue(this.srv.lower(source));
        }
        if (
          this.fq['surah_number'].value!=surah||
          this.fq['ayat_number'].value!=ayat
        ) {
          SetValues("surah_number",surah,"",true,this.fq)
          SetValues("ayat_number",ayat,"",true,this.fq)
        }
        request_obj=createRequest("quran",1,"surah ayat lang","Quran-Book",null,surah,ayat);
        if (this.srv.rFQ.invalid) {
          inval = true;
        }
        break;
      }
      default:
        inval = true;
        break;
    } //Swich Parent

    if (inval) {
      this.getvalidations(this.srv.rFPI);
      return null; //request_obj
    } else {
      return request_obj;
    }
  } //SetInputs();



  //================================================Testing==================================================//
  //================================================Testing==================================================//

  getvalidations(rF: FormGroup) {
    console.log("====Validation");
    Object.keys(rF.controls).forEach(key => {
      let controlErrors: ValidationErrors = rF.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log(
            'Key control: "' +
              key +
              '", keyError: "' +
              keyError +
              '", err value: ',
            controlErrors[keyError]
          );
        });
      }
    });
    console.log("Validation====");
  }

  //======Extractor

  cleanArray(actual) {
    var newArray = new Array();
    for (var i = 0; i < actual.length; i++) {
      if (actual[i]) {
        newArray.push(actual[i]);
      }
    }
    return newArray;
  }
} //CLASS
