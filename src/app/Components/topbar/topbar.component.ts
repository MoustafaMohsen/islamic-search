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
        if (this.lower(p.source) == "quran") {
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
    var value = this.lower(Source);
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
    var request_obj: Lib3.IncomingRequest;

    let source: string = this.lower(sourceParameter);
    let method: string = this.lower(methodParameter);

    let number: number = parseInt(val1);

    let Ch: number = val1;
    let Hadith: number = val2;

    let surah: number = val1;
    let ayat: number = val2;

    let tagNum = parseInt(val1);
    let tagChar = val2 == undefined || val2.length > 1 ? "" : val2 /*"all"*/;
    tagChar;
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
              this.fh["number"].value != number ||
              this.fh["FetchingMethod"].value != method
            ) {
              //Select Method
              this.fh["FetchingMethod"].setValue(method);

              //select values
              this.fh["number"].setValue(number);
              this.fh["number"].markAsTouched();
              this.srv.ValidateHadithInputs("method");
              this.fh["number"].markAsTouched();
            }

            request_obj = {
              Method: 6,
              Refrencetype: "hadith",
              src: 1,
              value1: number,
              name:"DarusSalam",
              tag1: "",
              tag2: "",
              value2: -2,
              value3: -2,
              value4: -2,
              source: "hadith",
              lang: "",
              url: ""
            };

            break;
          }

          case "new": {
            if (
              this.fh["NewChapter"].value != Ch ||
              this.fh["NewHadith"].value != Hadith ||
              this.fh["FetchingMethod"].value != method
            ) {
              //Select Method
              this.fh["FetchingMethod"].setValue(method);

              this.srv.ValidateHadithInputs("method");

              //select values
              this.fh["NewChapter"].setValue(Ch);
              this.srv.ValidateHadithInputs("chapter");
              this.fh["NewChapter"].markAsTouched();

              this.fh["NewHadith"].setValue(Hadith);
              this.fh["NewHadith"].markAsTouched();
            }

            request_obj = {
              Method: 6,
              Refrencetype: "book hadith",
              src: 1,
              value1: Ch,
              tag1: "",
              tag2: "",
              value2: Hadith,
              value3: -2,
              name:"In-Book",
              value4: -2,
              source: "hadith",
              lang: "",
              url: ""
            };

            break;
          }
          case "old": {
            if (
              this.fh["OldChapter"].value != Ch ||
              this.fh["OldHadith"].value != Hadith ||
              this.fh["FetchingMethod"].value != method
            ) {
              //Select Method
              this.fh["FetchingMethod"].setValue(method);

              this.srv.ValidateHadithInputs("method");

              //select values
              this.fh["OldChapter"].setValue(Ch);
              this.srv.ValidateHadithInputs("chapter");
              this.fh["OldChapter"].markAsTouched();

              this.fh["OldHadith"].setValue(Hadith);
              this.fh["OldHadith"].markAsTouched();
            }

            request_obj = {
              Method: 6,
              Refrencetype: "vol book hadith",
              src: 1,
              name:"USC-MSA",
              value1: -2,
              value2: Ch,
              value3: Hadith,
              value4: -2,
              tag1: "",
              tag2: "",
              source: "hadith",
              lang: "",
              url: ""
            };
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
          this.srv.source_options.setValue(this.lower(source));
        }

        switch (method) {
          case "tag": {
            if (
              this.fh["OtherTag"].value != tagNum ||
              this.fh["FetchingMethod"].value != method
            ) {
              //Select Method
              this.fh["FetchingMethod"].setValue(method);

              //select values
              this.fh["OtherTag"].setValue(tagNum);
              this.srv.ValidateHadithInputs("method");
              this.fh["OtherTag"].markAsTouched();

              this.fh["OtherTagChars"].setValue(tagChar);
              this.srv.ValidateHadithInputs("chapter");
              this.fh["OtherTagChars"].markAsTouched();
            }

            if (tagChar == "" /*"all"*/) {
              var request_obj: Lib3.IncomingRequest = {
                Method: 5,
                Refrencetype: "muslim tag",
                src: 2,
                value1: 0,
                value2: 0,
                value3: 0,
                value4: tagNum,
                tag1: "",
                tag2: "",
                source: "hadith",
                lang: "",
                url: ""
              };
            } else {
              var request_obj: Lib3.IncomingRequest = {
                Method: 4,
                Refrencetype: "muslim tag",
                src: 2,
                value1: 0,
                value2: 0,
                value3: 0,
                value4: tagNum,
                tag1: tagChar,
                tag2: "",
                source: "hadith",
                lang: "",
                url: ""
              };
            }

            break;
          }

          case "new": {
            if (
              this.fh["NewChapter"].value != Ch ||
              this.fh["NewHadith"].value != Hadith ||
              this.fh["FetchingMethod"].value != method
            ) {
              //Select Method
              this.fh["FetchingMethod"].setValue(method);
              this.srv.ValidateHadithInputs("method");

              //select values
              this.fh["NewChapter"].setValue(Ch);
              this.srv.ValidateHadithInputs("chapter");
              this.fh["NewChapter"].markAsTouched();

              this.fh["NewHadith"].setValue(Hadith);
              this.fh["NewHadith"].markAsTouched();
            }
            request_obj = {
              Method: 2,
              Refrencetype: "hadith",
              src: 2,
              value1: Ch,
              tag1: "",
              tag2: "",
              value2: Hadith,
              value3: 0,
              value4: 0,
              source: "hadith",
              lang: "",
              url: ""
            };

            break;
          }

          case "old": {
            if (
              this.fh["OldChapter"].value != Ch ||
              this.fh["OldHadith"].value != Hadith ||
              this.fh["FetchingMethod"].value != method
            ) {
              //Select Method
              this.fh["FetchingMethod"].setValue(method);
              this.srv.ValidateHadithInputs("method");

              //select values
              this.fh["OldChapter"].setValue(Ch);
              this.srv.ValidateHadithInputs("chapter");
              this.fh["OldChapter"].markAsTouched();

              this.fh["OldHadith"].setValue(Hadith);
              this.fh["OldHadith"].markAsTouched();
            }
            request_obj = {
              Method: 3,
              Refrencetype: "hadith",
              src: 2,
              value1: 0,
              tag1: "",
              tag2: "",
              value2: Ch,
              value3: Hadith,
              value4: 0,
              source: "hadith",
              lang: "",
              url: ""
            };
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
          this.srv.source_options.setValue(this.lower(source));
        }
        if (
          this.srv.rFQ.get("surah_number").value != surah ||
          this.srv.rFQ.get("ayat_number").value != ayat
        ) {
          this.srv.rFQ.get("surah_number").setValue(surah);
          this.srv.rFQ.get("surah_number").markAsTouched();

          this.srv.rFQ.get("ayat_number").setValue(ayat);
          this.srv.rFQ.get("ayat_number").markAsTouched();
        }

        let _url;
        _url = `https://api.alquran.cloud/ayah/${surah}:${ayat}/`;
        request_obj = {
          source: "quran",
          url: "",
          value1: surah,
          value2: ayat,
          value3: 0,
          Method: 1,
          Refrencetype: "surah ayat lang"
        };

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

  lower(str) {
    if (typeof str == "string") {
      if (str == null) {
        return null;
      } else {
        return str.toLowerCase();
      }
    }
  } //lower

  copyLink() {
    var link = window.location.href;
    this.srv.copyMessage(link);
    this.snack.open(`Copied Link "${link}"`, "x", { duration: 1000 });
  }

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
