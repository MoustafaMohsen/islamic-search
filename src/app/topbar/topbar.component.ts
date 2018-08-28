import {  Component,  OnInit} from '@angular/core';
import {  WebService} from '../web.service';
import {  MatSnackBar} from '@angular/material';
import {  FormControl,  Validators,  FormBuilder,  FormGroup, ValidationErrors} from '@angular/forms';
import {  HttpClient} from "@angular/common/http";
import {  map,  filter,  pluck} from "rxjs/operators";
import {  ApiRequest,  hadithaddress, APiHadithRequest, HadithModel, ISource, IMyAPIFetchingMethod, hadithIndexch} from "../interfaces";
import {  Bukhari} from "../SourceOptions/Bukhari";
import {  Muslim} from "../SourceOptions/Muslim";
import {  bukhariIndexChapters } from "../SourceOptions/myindex";
import {  QuranIndex} from '../SourceOptions/Quran';
import { MyServiceService } from '../my-service.service';
declare var $: any;
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  apiURL = "";
  //html controllers
  loading: boolean = false;
  currentChapter;
  currentVolume;
  showQuran: boolean;
  showHadith: boolean;
  TheHadithaddress: hadithaddress;
  CurrentChapterSource = null;
  HADITHADDRESS: hadithaddress[];
  Src;
  C;
  lastChaptervalue;
  lasthadithNumbervalue;
  TheCuurentSource: string = '';
  ayatMax: number;
  isValid:boolean=true;
  my:boolean=true;
  myUsingOptions:{value:string,englishName:string}[]=[];
  objectKeys=Object.keys;
  currentFetchingMethod;
  //FormControll
  rFH: FormGroup;
  rFQ: FormGroup;
  rFPI: FormGroup;
  source_options:FormControl=new FormControl('Quran',Validators.required);

  constructor(
    private web: WebService, private snack: MatSnackBar, private FormBuilder: FormBuilder,private http:HttpClient
    ,public srv:MyServiceService
  ) {
    this.rFH = FormBuilder.group({
      'hadith_number': [null, Validators.required],
      'hadith_chapter': [null, Validators.required],
      'hadith_number_options': [null, Validators.required],
      'hadith_chapter_options': [null]
    });

    this.rFPI = FormBuilder.group({
      'FetchingMethod':["number",Validators.required],
      'number': [{value: null}],
      'NewVol': [{value: null}],
      'NewChapter': [{value: null}],
      'NewHadith': [{value: null}],
      'OldVol': [{value: null}],
      'OldChapter': [{value: null}],
      'OldHadith': [{value: null}],
      'OtherTag': [{ value: "null" } ],
      'surah':[{value:1}],
      'ayat':[{value:1}]
    });

    this.rFQ=FormBuilder.group({
      'surah_number': [1, Validators.compose([Validators.required, Validators.max(114), Validators.min(1)])],
      'ayat_number': [1, Validators.compose([Validators.required, Validators.min(1),Validators.max(7)])]
    });
  }

  //=======================================================================================ngOnInit//
  //=======================================================================================ngOnInit//
  ngOnInit() {
    
    //=======Initial Source
    let myAPI:IMyAPIFetchingMethod={
      status:false,
      new:{
        status:false,ch:false,vol:false,ha:false
      },
      old:{
        status:false,ch:false,vol:false,ha:false
      },
      tag:{
        status:false, type:""
      }, 
      number:false
    }
    this.srv.Source={
      source:{
        hadith:{
          status:false, muslim:false, bukhari:false, nasai:false,name:"",srcNu:0
        },
        quran:false,
      },
      methodAPI:{
        oldAPI:{
          state:false,
          fethingmethod:{
            status:false,
            ch:false,
            chOp:false,
            ha:false,
            haOp:false,
            nu:false
          } 
        },
        myAPI:myAPI
      }
    }

    console.log("===ngOnInit");

    console.log("=Initial Source=");
    console.log(this.srv.Source);

    console.log("ngOnInit===");

    //Initial Source=======
    setTimeout( () => {
      this.web.Select_source.next('Quran');
      this.SetMaxAyat();
      this.UpdateInputDisable()
    }, 10);

    this.web.Loading.subscribe(b => this.loading = b);

    this.source_options.valueChanges.subscribe(
      (value) => {
        this.web.Select_source.next(value);
        this.UpdateSource(value);
      }
    );

    this.web.Select_source.subscribe(r => {
      switch (r) {
        case "Bukhari":
          { console.log("Bukhari");
            this.showQuran = false;
            this.showHadith = true;
            this.CurrentChapterSource = Bukhari.length;
            this.HADITHADDRESS = Bukhari;
            this.C = 1;
            this.TheCuurentSource = 'hadith';
            this.myUsingOptions=[
              {value:'number',englishName:'Hadith Number'},
              {value:'new',englishName:'In Book Refrence'},
              {value:'old',englishName:'English Book Refrence'}
            ];
          }
          break;

        case "Muslim":
          { console.log("Muslim");
            this.showQuran = false;this.showHadith = true;
            this.CurrentChapterSource = Muslim.length;
            this.HADITHADDRESS = Muslim;
            this.C = 2;
            this.TheCuurentSource = 'hadith';
            this.myUsingOptions=[
              {value:'tag',englishName:'inBook Number'},
              {value:'number',englishName:'Another Numbering Method'},
              {value:'new',englishName:'In Book Refrence'},
              {value:'old',englishName:'USC-MSA Refrence'}
            ];
          }
          break;

          case "Nasai":
          { 
            console.log("Nasai");
            this.showQuran = false;//this.showHadith = true;
            this.CurrentChapterSource = 51;
            this.C = 3;
            this.TheCuurentSource = 'hadith';
            this.myUsingOptions=[
              {value:'number',englishName:'Hadith Number'},
              {value:'new',englishName:'In Book Refrence'},
              {value:'old',englishName:'English Book Refrence'}
            ];
            console.log(this.myUsingOptions);
            
          }
          break;
        

        case "Quran":
          { console.log("Quran");
            this.showQuran = true;this.showHadith = false;
            this.TheCuurentSource = 'quran';
          }
          break;

        default:{ this.showQuran = false;this.showHadith = false; } break;
      }
      
    });


    //=======Value Changes

    this.rFQ.get('surah_number').valueChanges.subscribe(
      value => {
        this.SetMaxAyat();
        this.rFQ.get('ayat_number').setValue(1)
        //this.rFQ.get('ayat_number').setValidators([Validators.required,Validators.max(this.ayatMax),Validators.min(1)])
      }
    )
    //Value Changes=======
    this.rFPI.valueChanges.subscribe(
      (rFPI)=>{
        console.log("=========HAS Changes============");
        
        
        this.UpdateInputDisable();
        
      }
    );
    //========Set myUseOptions 

    this.rFPI.get('FetchingMethod').valueChanges.subscribe(
      value => {
        console.log("===UpdateHtmlController");
        console.log("=Source=");
        console.log(this.srv.Source);
        console.log("UpdateHtmlController===");
      }
    );

    //Set my Use Options========


        //==============Old Hadith Method

        this.rFH.valueChanges.subscribe(
          form=>{
            //this.NextValid();
            //console.log(this.isValid);
            
          }
        )
    
        this.rFH.get('hadith_chapter').valueChanges.subscribe(
          value => {
            if (this.lastChaptervalue == value && this.rFH.get('hadith_chapter').status != 'VALID') return;
    
            this.currentChapter = value;
            this.TheHadithaddress = this.GetHadithAdressByBook(this.currentChapter, this.HADITHADDRESS);
            this.currentVolume = this.TheHadithaddress != null ? this.TheHadithaddress.volume : null;
    
            if (this.TheHadithaddress == null) return
    
            this.rFH.get('hadith_number').setValue(this.TheHadithaddress.from)
            this.rFH.get('hadith_number').setValidators([Validators.required,Validators.min(this.TheHadithaddress.from),
              Validators.max(this.TheHadithaddress.to)
            ]);
    
            this.rFH.get('hadith_number_options').setValidators([Validators.min(this.TheHadithaddress.from),
              Validators.max(this.TheHadithaddress.to)
            ]);
    
    
            this.lastChaptervalue = value;
            this.rFH.get('hadith_chapter_options').setValue(value);
    
          }
        );
    
        this.rFH.get('hadith_chapter_options').valueChanges.subscribe(
          value => {
    
            if (this.lastChaptervalue != value) {
              this.lastChaptervalue = value;
              this.currentChapter = value;
              this.rFH.get('hadith_chapter').setValue(Number(this.rFH.get('hadith_chapter_options').value));
            } else {
              return
            }
          }
        )
    
        this.rFH.get('hadith_number').valueChanges.subscribe(
          value => {
            if (this.lasthadithNumbervalue != value) {
              this.lasthadithNumbervalue = value;
              this.rFH.get('hadith_number_options').setValue(value);
            } else {
              return
            }
          }
        );
    
        this.rFH.get('hadith_number_options').valueChanges.subscribe(
          value => {
            if (this.lasthadithNumbervalue != value) {
              //this.rFH.get('hadith_number').setValue(Number(this.rFH.get('hadith_number_options').value));
              this.rFH.get('hadith_number').setValue(Number(this.rFH.get('hadith_number_options').value));
            } else {
              return
            }
          }
        );
        //Old Hadith Method==============

  }//ngOnInit========================================================================================//
  //ngOnInit========================================================================================//

  
  
  
  
  
  //=====================================Error Messages//

  //==Hadith//
  getHadithChapternumberError() {
    return this.TheHadithaddress==null?'please set chapter number first':
      this.rFH.get('hadith_number').hasError("min") ? 'This book starts from ' + this.TheHadithaddress.from +' Hadiths' :
      this.rFH.get('hadith_number').hasError("max") ? 'This book ends at ' + this.TheHadithaddress.to +
      ' Hadiths' :
      this.rFH.get('hadith_number').hasError('required') ? 'required' :
      'Invalid input';
  }

  getChapternumberError() {
    return this.rFH.get('hadith_chapter').hasError("max") ? 'This chapter only has ' + this.CurrentChapterSource +
      ' books' :
      this.rFH.get('hadith_chapter').hasError('min') ? 'Minimum is 1' :
      this.rFH.get('hadith_chapter').hasError('required') ? 'required' :
      'Invalid input';
  }
  //Hadith==//

  //==Quran//
  getAyatNumberError() {
    return this.rFQ.get('ayat_number').hasError('required') ? 'required' :
      this.rFQ.get('ayat_number').hasError('max') ? 'this Surah only has ' + this.ayatMax + ' Ayat' :
      this.rFQ.get('ayat_number').hasError('min') ? 'Minimum is 1' :
      'Invalid input'
  }

  getSurahError() {
    return this.rFQ.get('surah_number').hasError('required') ? 'required' :
      this.rFQ.get('surah_number').hasError('max') ? 'The Quran has 114 Surrah' :
      this.rFQ.get('surah_number').hasError('min') ? 'Minimum is 1' :
      'Invalid input'
  }
  //Quran==//

  //Error Messages=====================================//


  LookUp() { //Look up
    switch (this.TheCuurentSource) {

      case 'hadith':
        {
          if(this.rFH.invalid) return;
          let _url ='https://muflihun.com/svc/hadith?c='+this.C+'&b='+this.currentChapter+'&h='+this.rFH.get('hadith_number').value;

          if (_url == this.apiURL) {
            this.snack.open("Already sent", "X", {
              duration: 1000
            });
            return
          }
          this.apiURL = _url;
          this.web.Loading.next(true);

          let _apiRequestHadith: ApiRequest = {
            c: this.C,
            url: this.apiURL,
            source: "hadith",
            hadithaddress: {
              chapter: this.currentChapter,
              hadith: this.rFH.get('hadith_number').value
            },
            language: "textArabic"
          };
          this.web.apiRequest$.next(_apiRequestHadith);
          console.log(_apiRequestHadith);
        } break;

      case 'quran':
        {
          if(this.rFQ.invalid)break;
          let _url = 'https://api.alquran.cloud/ayah/'+this.rFQ.get('surah_number').value+':'+this.rFQ.get('ayat_number').value+'/'+'ar'+'.asad';
          
          if (_url == this.apiURL){this.snack.open("Already sent", "X", { duration: 1000 }); return;}
          
          this.apiURL = _url;
          this.web.Loading.next(true);
          

          let _apiRequestHadith: ApiRequest = {
            c: null,
            url: this.apiURL,
            source: "quran",
            quranaddress: {
              surah: this.rFQ.get('surah_number').value,
              ayat: this.rFQ.get('ayat_number').value
            },
            language: "ar"
          };
          this.web.apiRequest$.next(_apiRequestHadith);
          console.log(_apiRequestHadith);
          
        }
        break;

      default:
        console.log("no source was choosen\n last source was");
        console.log(this.srv.Source);
        break;
    }
  }

  GetHadithAdressByBook(book, SOURCE: hadithaddress[]) {
    let x = SOURCE.filter(address => address.book == Number(book))
    return x[0];
  }



  SetMaxAyat() {
    let suran = this.rFQ.get('surah_number').value;
    if (suran <= 0||suran > 114) return
    let Surrah = QuranIndex.filter(f => f.number == suran);
    this.ayatMax = Surrah[0].numberOfAyahs;
    this.rFQ.get('ayat_number' ).setValidators([Validators.required, Validators.min(1),Validators.max(this.ayatMax)])
  }


  Previous() {

    if(this.srv.Source.methodAPI.myAPI&&this.srv.Source.source.hadith.status){
      this.rFPI.get("number").setValue(this.rFPI.get("number").value-1);
      this.LookupPI();
    }

    if (this.TheCuurentSource == 'quran') {
      let ayat = this.rFQ.get('ayat_number').value - 1;
      if (ayat <= 0) return;
      this.rFQ.get('ayat_number').setValue(ayat)
      this.LookUp();
    }
    if (this.TheCuurentSource == 'hadith') {
      let hadithNo = this.rFH.get('hadith_number').value - 1;
      if ( this.TheHadithaddress==null||hadithNo < this.TheHadithaddress.from) return
      this.rFH.get('hadith_number').setValue(hadithNo);
      this.LookUp();
    }

  }

  Next() {

    if(this.srv.Source.methodAPI.myAPI&&this.srv.Source.source.hadith.status){
      this.rFPI.get("number").setValue(this.rFPI.get("number").value+1);
      this.LookupPI();
    }

    if (this.TheCuurentSource == 'quran') {
      let ayat = this.rFQ.get('ayat_number').value + 1;
      if (ayat > this.ayatMax) return;
      this.rFQ.get('ayat_number').setValue(ayat)
      this.LookUp();
    }

    if (this.TheCuurentSource == 'hadith') {
      let hadithNo = this.rFH.get('hadith_number').value + 1;
      if ( this.TheHadithaddress==null||hadithNo > this.TheHadithaddress.to) return
      this.rFH.get('hadith_number').setValue(hadithNo);
      this.LookUp();
    }

  }
  hasChangeButNotDisable(value){

    let keys=this.objectKeys(this.rFPI);
    for (const key in keys) {
      if (keys.hasOwnProperty(key)) {
        const input = keys[key];
        this.rFPI.get(input).value==value.get(input).value
      }
    }

  }

  UpdateInputDisable(){
    console.log("UpdateInputDisable");
    
    if (this.rFPI.get('FetchingMethod').value=="number"&&this.currentFetchingMethod !="number") {
      this.rFPI.disable({onlySelf: true, emitEvent: false})
      this.rFPI.get('FetchingMethod').enable({onlySelf: true, emitEvent: false});
      this.rFPI.get('number').enable({onlySelf: true, emitEvent: false});
      this.currentFetchingMethod ="number";
    }

    if (this.rFPI.get('FetchingMethod').value=="new"&&this.currentFetchingMethod !="new") {
      this.rFPI.disable({onlySelf: true, emitEvent: false})
      this.rFPI.get('FetchingMethod').enable({onlySelf: true, emitEvent: false});
      this.rFPI.get('NewVol').enable({onlySelf: true, emitEvent: false});
      this.rFPI.get('NewChapter').enable({onlySelf: true, emitEvent: false});
      this.rFPI.get('NewHadith').enable({onlySelf: true, emitEvent: false});
      this.currentFetchingMethod ="new";
    }
    if (this.rFPI.get('FetchingMethod').value=="old"&&this.currentFetchingMethod !="old") {
      this.rFPI.disable({onlySelf: true, emitEvent: false})
      this.rFPI.get('FetchingMethod').enable({onlySelf: true, emitEvent: false});
      this.rFPI.get('OldVol').enable({onlySelf: true, emitEvent: false});
      this.rFPI.get('OldChapter').enable({onlySelf: true, emitEvent: false});
      this.rFPI.get('OldHadith').enable({onlySelf: true, emitEvent: false});
      this.currentFetchingMethod ="old";
    }
    if (this.rFPI.get('FetchingMethod').value=="tag"&&this.currentFetchingMethod !="tag") {
      this.rFPI.disable({onlySelf: true, emitEvent: false})
      this.rFPI.get('FetchingMethod').enable({onlySelf: true, emitEvent: false});
      this.rFPI.get('OtherTag').enable({onlySelf: true, emitEvent: false});
      this.currentFetchingMethod ="tag";
    }

  }

  //=========Look up usin My API //


  UpdateSource(value){
    console.log("SourceToHtmlController");
    let myAPI:IMyAPIFetchingMethod={
      status:false,
      new:{
        status:false,ch:false,vol:false,ha:false
      },
      old:{
        status:false,ch:false,vol:false,ha:false
      },
      tag:{
        status:false, type:""
      }, 
      number:false
    }
    this.srv.Source={
      source:{
        hadith:{
          status:false, muslim:false, bukhari:false, nasai:false,name:"",srcNu:0
        },
        quran:false,
      },
      methodAPI:{
        oldAPI:{
          state:false,
          fethingmethod:{
            status:false,
            ch:false,
            chOp:false,
            ha:false,
            haOp:false,
            nu:false
          } 
        },
        myAPI:myAPI
      }
    }

    if (value=="Bukhari") {
      this.C = 1;
      console.log("Source \"Bukhari\" was choosen");
      this.srv.Source=null;
      let myAPI:IMyAPIFetchingMethod={
        status:true,
        new:{
          status:true,ch:true,vol:false,ha:true
        },
        old:{
          status:true,ch:true,vol:false,ha:true
        },
        tag:{
          status:false, type:""
        }, 
        number:true
      }
      this.srv.Source={
        source:{
          hadith:{
            status:true, muslim:false, bukhari:true, nasai:false,name:"bukhari",srcNu:1
          },
          quran:false,
        },
        methodAPI:{
          oldAPI:{
            state:false,
            fethingmethod:{
              status:false,
              ch:false,
              chOp:false,
              ha:false,
              haOp:false,
              nu:false
            } 
          },
          myAPI:myAPI
        }
      }
    }//if("Bukhari")

    if (value=="Muslim") {
      console.log("Source \"Muslim\" was choosen");
      this.srv.Source=null;
      let myAPI:IMyAPIFetchingMethod={
        status:true,
        new:{
          status:true,ch:true,vol:false,ha:true
        },
        old:{
          status:true,ch:true,vol:false,ha:true
        },
        tag:{
          status:true, type:"muslim"
        }, 
        number:true
      }
      
      this.srv.Source={
        source:{
          hadith:{
            status:true, muslim:true, bukhari:false, nasai:false,name:"muslim",srcNu:2
          },
          quran:false,
        },
        methodAPI:{
          oldAPI:{
            state:false,
            fethingmethod:{
              status:false,
              ch:false,
              chOp:false,
              ha:false,
              haOp:false,
              nu:false
            } 
          },
          myAPI:myAPI
        }
      }
    }//if("Muslim")

    if (value=="Nasai") {
      console.log("Source \"Nasai\" was choosen");
      this.srv.Source=null;
      let myAPI:IMyAPIFetchingMethod={
        status:true,
        new:{
          status:true,ch:true,vol:false,ha:true
        },
        old:{
          status:true,ch:true,vol:false,ha:true
        },
        tag:{
          status:false, type:""
        }, 
        number:true
      }
      
      this.srv.Source={
        source:{
          hadith:{
            status:true, muslim:false, bukhari:false, nasai:true,name:"nasai",srcNu:3
          },
          quran:false,
        },
        methodAPI:{
          oldAPI:{
            state:false,
            fethingmethod:{
              status:false,
              ch:false,
              chOp:false,
              ha:false,
              haOp:false,
              nu:false
            } 
          },
          myAPI:myAPI
        }
      }
    }//if("Nasai")

    if ( value=="Quran" ) {
      console.log("Source \"Quran\" was choosen");
      this.srv.Source=null;
      console.log("Source To HtmlController quran");
      let myAPI:IMyAPIFetchingMethod={
        status:false,
        new:{
          status:false,ch:false,vol:false,ha:false
        },
        old:{
          status:false,ch:false,vol:false,ha:false
        },
        tag:{
          status:false, type:""
        }, 
        number:false
      }
      
      this.srv.Source={
        source:{
          hadith:{
            status:false, muslim:false, bukhari:false, nasai:false,name:"",srcNu:0
          },
          quran:true,
        },
        methodAPI:{
          oldAPI:{
            state:true,
            fethingmethod:{
              status:true,
              ch:true,
              chOp:false,
              ha:true,
              haOp:false,
              nu:false
            } 
          },
          myAPI:myAPI
        }
      }
    }//if("Quran")
    console.log("======UpdateSource()");    
    console.log(this.srv.Source);
    console.log("UpdateSource()======");

  }//SourceToHtmlController()

  LookupPI(){
    console.log("==========LookupPI");
    
    console.log(this.rFPI);
    
    var src = this.C;
    var FetchingMethod = this.rFPI.get("FetchingMethod").value

    var Hadithnumber = this.rFPI.get("number").value;
    
    var NewVol = this.rFPI.get("NewVol").value;
    if ( this.srv.Source.source.hadith.nasai||this.srv.Source.source.hadith.bukhari || this.srv.Source.source.hadith.muslim) {
      NewVol=0;
    }
    var NewChapter = this.rFPI.get("NewChapter").value;
    var NewHadith = this.rFPI.get("NewHadith").value;

    var OldVol = this.rFPI.get("OldVol").value;
    if ( this.srv.Source.source.hadith.nasai||this.srv.Source.source.hadith.bukhari || this.srv.Source.source.hadith.muslim ) {
      NewVol=0;
    }
    var OldChapter = this.rFPI.get("OldChapter").value;
    var OldHadith = this.rFPI.get("OldHadith").value;

    var OtherTag = this.rFPI.get("OtherTag").value;
    
    if ( FetchingMethod=="number" ) {
      var request_obj:APiHadithRequest ={
        src:src,
        number:Hadithnumber,
        in_book_refrence:{book:0,id:0,hadith:0,tag:null},
        old_refrence:{book:0,id:0,hadith:0,vol:0}
      }
      this.web.myAPIRequest$.next(request_obj);
      console.log("====lookupI");console.log("number");console.log(request_obj);
      console.log("====lookupI");
      return;
    }

    if ( FetchingMethod=="new" ) {
      var request_obj:APiHadithRequest ={
        src:src,
        number:null,
        in_book_refrence:{vol:NewVol,book:NewChapter,id:0,hadith:NewHadith,tag:null},
        old_refrence:{book:0,id:0,hadith:0,vol:0}
      }
      this.web.myAPIRequest$.next(request_obj);
      console.log("====lookupI");console.log("new");console.log(request_obj);
      console.log("====lookupI");
      return;
    }

    if ( FetchingMethod=="old" ) {
      var request_obj:APiHadithRequest ={
        src:src,
        number:null,
        in_book_refrence:{book:0,id:0,hadith:0,tag:null},
        old_refrence:{vol:OldVol,book:OldChapter,id:0,hadith:OldHadith}
      }
      this.web.myAPIRequest$.next(request_obj);
      console.log("====lookupI");console.log("old");console.log(request_obj);
      console.log("====lookupI");
      return;
    }

    if ( FetchingMethod=="tag" ) {
      var request_obj:APiHadithRequest ={
        src:src,
        number:null,
        in_book_refrence:{book:0,id:0,hadith:0,tag:OtherTag},
        old_refrence:{vol:0,book:0,id:0,hadith:0}
      }
      this.web.myAPIRequest$.next(request_obj);
      console.log("====lookupI");console.log("tag");console.log(request_obj);
      console.log("====lookupI");
      return;
    }

    console.log("LookupPI==========");
  }
  //Look up usin My API =========//

  //===========Testing==========//
  getvalidations(rF:FormGroup){
    console.log('====Validation');
    
    Object.keys(rF.controls).forEach(key => {

      let controlErrors: ValidationErrors = rF.get(key).errors;
      if (controlErrors != null) {
            Object.keys(controlErrors).forEach(keyError => {
              console.log('Key control: "' + key + '", keyError: "' + keyError + '", err value: ', controlErrors[keyError]);
            });
          }
        });
    console.log('Validation====');

  }


  Test(){

    var bnewIndex:{nh:number;nc:number}[];
    var boldIndex:{oh:number;oc:number}[];
    var indexb:hadithIndexch={bnew:[],bold:[]};
    bukhariIndexChapters.bnew.forEach(element => {
      if(element.nh!=0)indexb.bnew.push(element)
    });

    bukhariIndexChapters.bold.forEach(element => {
      if(element.oh!=0)indexb.bold.push(element)
    });
    console.log(indexb);
    
    console.log(this.rFPI.getRawValue());
    console.log();
  }
  //======Extractor


} //CLASS