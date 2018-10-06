import { Component, OnInit, Output } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { IMyAPIFetchingMethod, Lib3 } from "../interfaces";
import { MyServiceService } from "../my-service.service";
//import {  OldBukhariIndex} from "../SourceOptions/Bukhari";
//import {  Muslim} from "../SourceOptions/Muslim";
import { QuranIndex } from "../SourceOptions/Quran";
import { WebService } from "../web.service";
//import * as hadithJson from "../SourceOptions/jsonPrase/bukhari.json";
//import * as _HadithMap from "../SourceOptions/jsonPrase/BmapNew.json"
import * as _MuslimTag from "./muslimTagsfullchar.json";
import { Subject } from "rxjs";
declare var $: any;

@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
  styleUrls: ["./topbar.component.css"],
})


export class TopbarComponent implements OnInit {
  
  //MuslimTag: string[] = _MuslimTag.default.tags as string[];
  MissinMuslimTag: number[][] = _MuslimTag.default.missing;
  apiURL = "";
  OtherTagCharsArray: string[];
  ayatMax: number;
  myUsingOptions: { value: string; englishName: string }[] = [];
  objectKeys = Object.keys;
  //currentFetchingMethod;
  IncomingRequest:Lib3.IncomingRequest;
  ArContentArray:Lib3.Value[][]//=[[]];
  ArContentAndRedArray:{content:Lib3.Value[],refrence:Lib3.Refrence[]}[]//=[[]];
  EnContentAndRedArray:{content:Lib3.Value[],refrence:Lib3.Refrence[]}[]//=[[]];
  EnContentArray:Lib3.Value[][]//=[[]];
  source_options: FormControl = new FormControl();
  CompLoaded:boolean=false;
//TEST
Testvalue
  constructor(
    public web: WebService,
    private snack: MatSnackBar,
    //private FormBuilder: FormBuilder,
    //private http:HttpClient,
    public srv: MyServiceService,
    public activatedRoute: ActivatedRoute,
    public router:Router
  ) {

  }

  //=======================================================================================ngOnInit//
  //=======================================================================================ngOnInit//
  ngOnInit() {
    //console.log("ngOnInit() Topbar Component");
    

    this.web.IncomingRequests$.subscribe(
      (request)=>{

        //console.log("Hadith Box Sending Incoming Request");
        //console.log(request);
        
        
        //===If Hadith
        if(request.source=='hadith'){
          //Loading
          this.web.Loading.next(true)
          ;
          //if Single Content
          if(request.Method!=5)
          this.web.getHadithBlock(request).subscribe(
            block=>{
             //console.log("====Block Response=====");
             //console.log(block);
              
              //this.ArContentArray=[[]];
              //this.EnContentArray=[[]];
              this.ArContentAndRedArray=[{refrence:null,content:null}]
              this.EnContentAndRedArray=[{refrence:null,content:null}]
              let arC:Lib3.Value[]=block.content.filter(c=>c.name.match(/ar/g) ).map(x=> 
                {
                 //console.log("map()");
                 //console.log(parseInt(x.name.replace(/([a-z|A-Z]+):/g,""))); 
                  let v:Lib3.Value={
                    name:x.name.replace(/([a-z|A-Z]+):/g,""),
                    value:x.value,
                    id:x.id
                  };
                 //console.log("after map()");
                 //console.log(v);
                  
                  return v
                })
              .sort((a,b)=> parseInt(a.name) - parseInt(b.name));
              
              let enC:Lib3.Value[]=block.content.filter( c=>c.name.match(/en/g) ) .map(x=> 
                {
                  let v:Lib3.Value={
                    name:x.name.replace(/([a-z|A-Z]+):/g,""),
                    value:x.value,
                    id:x.id
                  };
                  return v
                })
                .sort((a,b)=> parseInt(a.name) - parseInt(b.name));

                 //console.log("arC");
                  
             //console.log(arC);
             //console.log(enC);
             this.ArContentAndRedArray[0].content=arC.slice();
             this.ArContentAndRedArray[0].refrence=block.refrences.slice();

             this.EnContentAndRedArray[0].content=enC.slice();
             this.EnContentAndRedArray[0].refrence=block.refrences.slice();

              //this.ArContentArray[0]=arC.slice();
              //this.EnContentArray[0]=enC.slice();
              
              this.web.Loading.next(false);
            },
  
            error=>{
              this.snack.open(' ' +request.url+" Not found", "X", {duration: 5000,});
              this.web.Loading.next(false)
            }
  
          );
          //if Array Content
          if(request.Method==5){
            this.web.getHadithBlockArray(request).subscribe(
    
              blocks=>{

                console.log(blocks);
                
               // this.ArContentArray=[[]];
                //this.EnContentArray=[[]];
                this.ArContentAndRedArray=[{refrence:null,content:null}]

                this.EnContentAndRedArray=[{refrence:null,content:null}]

                let arC:Lib3.Value[];
                let enC:Lib3.Value[];
                for (let i  = 0;  i < blocks.length; i++) {

                  const b = blocks[i];
                  arC=b.content.filter( c=>c.name.match(/ar/g) )
                  .map(x=> 
                    {
                      let v:Lib3.Value={
                        name:x.name.replace(/([a-z|A-Z]+):/g,""),
                        value:x.value,
                        id:x.id
                      };
                      return v
                    })
                    .sort((a,b)=> parseInt(a.name) - parseInt(b.name));
  
                  enC=b.content.filter( c=>c.name.match(/en/g) )
                  .map(x=> 
                    {
                      let v:Lib3.Value={
                        name:x.name.replace(/([a-z|A-Z]+):/g,""),
                        value:x.value,
                        id:x.id
                      };
                      return v
                    })
                    .sort((a,b)=> parseInt(a.name) - parseInt(b.name));

                  this.ArContentAndRedArray.push({content:arC.slice(),refrence:b.refrences.slice()})

                  this.EnContentAndRedArray.push({content:enC.slice(),refrence:b.refrences.slice()})

                  //this.ArContentArray[i]=arC.slice()//.sort( x=>x.value.match(/ar/g) );
                  //this.EnContentArray[i]=enC.slice();
                }//for
                if(this.ArContentAndRedArray.length>1)
                this.ArContentAndRedArray.shift();

                if(this.EnContentAndRedArray.length>1)
                this.EnContentAndRedArray.shift();

                this.web.Loading.next(false);
  
              },
    
              error=>{
                this.snack.open(' ' +request.url+" Not found", "X", {duration: 3000,});
                this.web.Loading.next(false)
              }
    
            )
          }

        }//If Hadith

      //===If Quran
        if(request.source=='quran'){
          //Loading
          this.web.Loading.next(true);

          //For arabic
         //console.log(request.url);
         let _url
         _url = `https://api.alquran.cloud/ayah/${request.value1}:${request.value2}/`;
          
          this.web.getQuran(_url+'ar'+'.asad').subscribe(

            (ayat)=>{
             //console.log(ayat);
             this.ArContentAndRedArray=[{refrence:null,content:null}]
              
             
              //clean request and storing it
              this.ArContentAndRedArray[0]={
                content:[{value:ayat.data.text}],
                refrence:[{name:"Surah, Ayat",value1:ayat.data.surah.number,value2:ayat.data.numberInSurah}]
              }

              //this.ArContentArray=[[{value:ayat.data.text}]]


              //remove the start of the first ayat
              if(request.value2==1&&request.value1!=1){
                let firstAyat:string= String(ayat.data.text);
                firstAyat = firstAyat.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ','');
                this.ArContentAndRedArray[0].content=[{value:firstAyat}]
                //this.ArContentArray=[[{value:firstAyat}]]
              }
              this.web.Loading.next(false)
            },

            error=>{
              this.snack.open(" "+request.url+" Not found", "X", {duration: 3000,});
              this.web.Loading.next(false)
            }

          );

          //For English
          this.web.getQuran(_url+'en'+'.asad').subscribe(

            (ayat)=>{
              //clean request and storing it
              //this.EnContentArray=[[{value:ayat.data.text}]]
              this.EnContentAndRedArray=[{refrence:null,content:null}]
              this.EnContentAndRedArray[0]={
                content:[{value:ayat.data.text}],
                refrence:[{name:"Surah, Ayat",value1:ayat.data.surah.number,value2:ayat.data.numberInSurah}]
              }
              //remove the start of the first ayat
              /*
              if(request.value2==1&&request.value1!=1){
                let firstAyat:string= String(ayat.data.text);
                firstAyat = firstAyat.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ','');
                this.EnContentArray=[[{value:firstAyat}]]
              }*/
              this.web.Loading.next(false)
            },

            error=>{
              this.snack.open(" "+request.url+" Not found", "X", {duration: 3000,});
              this.web.Loading.next(false)
            }

          )
          
        }//If Quran

        //If Requesting Array Content 


      }//(request)


    )//IncomingRequests$ subscribe

    //Initial Source=======

    this.activatedRoute.params.subscribe(
      p=>{
        var AlrSent = (t)=>{
          this.snack.open("alread sent","x",{duration:t})
        }
        setTimeout(() => {
          this.CompLoaded=true;
        }, 100);
        //If not Navigated
        //console.log("Navigated State");
        //console.log(this.CompLoaded);
        
        if (!this.CompLoaded) {
          //console.log("----NOT NAVIGATED----");
          //console.log("YOU in home page!!");
          this.UpdateSource("quran");
          this.source_options.setValue("quran", { emitEvent: true });
          this.SetMaxAyat(this.srv.rFQ.get("ayat_number"), 1);
        }
        if(Object.keys(p).length != 0)
        {
          //If quran
          if( this.lower(p.source)=="quran"){
           var request= this.CreateRquestFromUrl( p.source,"", p.par1, p.par2);
           if(!request){
             setTimeout(() => {
              this.snack.open("Does not exist","x",{duration:5000});
             }, 1000);
             this.router.navigate([""])
             return;
           }
           if (this.IncomingRequest==request) {
            AlrSent(1000)
            return;
          }
          else{
            this.web.IncomingRequests$.next(request)
            //console.log("routing request");
            //console.log(request);
          }
          this.IncomingRequest=request;
          }
          //If hadith
          else{
            request=this.CreateRquestFromUrl( p.source, p.par1, p.par2, p.par3);
            if(!request){
              setTimeout(() => {
               this.snack.open("Does not exist","x",{duration:5000});
              }, 1000);
              this.router.navigate([""])
              return;
            }
            if (this.IncomingRequest==request) {
              AlrSent(1000)
             this.IncomingRequest=request;
             return;
           }
            this.web.IncomingRequests$.next(request)
          }
        }
        //if just open HOME page
        else{
          //console.log("YOU in home page!!");
          this.UpdateSource("quran");
          this.source_options.setValue("quran", { emitEvent: true });
          this.SetMaxAyat(this.srv.rFQ.get("ayat_number"), 1);
          //DELETE LINE
        }
      }
    );



    

    this.srv.UpdateInputDisable();
    this.source_options.valueChanges.subscribe(value => {
      //emit value change
      this.srv.rFPI
        .get("FetchingMethod")
        .setValue(this.srv.rFPI.get("FetchingMethod").value);
      //update Source
      this.UpdateSource(value);
      this.srv.ValidateHadithInputs("method");
    });

    //=======Value Changes
    this.srv.rFQ.get("surah_number").valueChanges.subscribe(value => {
      this.SetMaxAyat(this.srv.rFQ.get("ayat_number"), value);
    });
    this.srv.rFPI.get("NewChapter").valueChanges.subscribe(value => {
      this.srv.ValidateHadithInputs("chapter");
    });
    this.srv.rFPI.get("OldChapter").valueChanges.subscribe(value => {
      this.srv.ValidateHadithInputs("chapter");
    });
    this.srv.rFPI.get("OtherTag").valueChanges.subscribe(value => {
      this.srv.ValidateHadithInputs("chapter");
    });
    this.srv.rFPI.get("FetchingMethod").valueChanges.subscribe(value => {
      //console.log("('FetchingMethod').valueChanges");
      //console.log(value);
      
      
      //this.currentFetchingMethod = value;
      //this.srv.currentFetchingMethod = value;
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

  SetMaxAyat(ayat_number: AbstractControl, surahNumber) {
    let suran = surahNumber;
    if (suran <= 0 || suran > 114) return;
    let Surrah = QuranIndex.filter(f => f.number == suran);
    this.ayatMax = Surrah[0].numberOfAyahs;
    ayat_number.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(this.ayatMax),
    ]);
    ayat_number.updateValueAndValidity();
  }

  UpdateSource(Source) {
    var value = this.lower(Source)
    let myAPI: IMyAPIFetchingMethod = {
      name:"",
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

    if (value == "bukhari") {
      //Set Default FetchingMethod
      this.srv.rFPI.get("FetchingMethod").setValue("number");
      this.myUsingOptions = [
        { value: "number", englishName: "Hadith Number" },
        { value: "new", englishName: "In Book Refrence" },
        { value: "old", englishName: "USC-MSA Refrence" },
      ];
      //console.log("Source \"Bukhari\" was choosen");

      this.srv.Source = null;
      let myAPI: IMyAPIFetchingMethod = {
        name:"bukhari",
        status: true,
        new: {
          status: true,
          ch: true,
          vol: false,
          ha: true,
        },
        old: {
          status: true,
          ch: true,
          vol: false,
          ha: true,
        },
        tag: {
          status: false,
          type: "",
        },
        number: true,
      };
      this.srv.Source = {
        source: {
          hadith: {
            status: true,
            muslim: false,
            bukhari: true,
            nasai: false,
            name: "bukhari",
            srcNu: 1,
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
    } //if("Bukhari")

    if (value == "muslim") {
      //Set Default FetchingMethod
      this.srv.rFPI.get("FetchingMethod").setValue("tag");
      //Update Validators
      this.srv.ValidateHadithInputs("method");

      //console.log("Source \"Muslim\" was choosen");
      this.myUsingOptions = [
        { value: "tag", englishName: "Reference" },
        { value: "new", englishName: "In Book Refrence" },
        { value: "old", englishName: "USC-MSA Refrence" },
      ];

      this.srv.Source = null;
      let myAPI: IMyAPIFetchingMethod = {
        name:"muslim",
        status: true,
        new: {
          status: true,
          ch: true,
          vol: false,
          ha: true,
        },
        old: {
          status: true,
          ch: true,
          vol: false,
          ha: true,
        },
        tag: {
          status: true,
          type: "muslim",
        },
        number: false, //true
      };

      this.srv.Source = {
        source: {
          hadith: {
            status: true,
            muslim: true,
            bukhari: false,
            nasai: false,
            name: "muslim",
            srcNu: 2,
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
    } //if("Muslim")

    if (value == "nasai") {
      //Set Default FetchingMethod
      this.srv.rFPI.get("FetchingMethod").setValue("number");
      this.myUsingOptions = [
        { value: "number", englishName: "Hadith Number" },
        { value: "new", englishName: "In Book Refrence" },
        { value: "old", englishName: "USC-MSA Refrence" },
      ];
      //console.log("Source \"Nasai\" was choosen");

      this.srv.Source = null;
      let myAPI: IMyAPIFetchingMethod = {
        name:"nasai",
        status: true,
        new: {
          status: true,
          ch: true,
          vol: false,
          ha: true,
        },
        old: {
          status: true,
          ch: true,
          vol: false,
          ha: true,
        },
        tag: {
          status: false,
          type: "",
        },
        number: true,
      };

      this.srv.Source = {
        source: {
          hadith: {
            status: true,
            muslim: false,
            bukhari: false,
            nasai: true,
            name: "nasai",
            srcNu: 3,
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
    } //if("Nasai")

    if (value == "quran") {
      //console.log("Source \"Quran\" was choosen");
      this.srv.Source = null;
      //console.log("Source To HtmlController quran");
      let myAPI: IMyAPIFetchingMethod = {
        name:"",
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
          quran: true,
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
              nu: false,
            },
          },
          myAPI: myAPI,
        },
      };
    } //if("Quran")
    //console.log("======UpdateSource()");
    //console.log(this.srv.Source);
    //console.log("UpdateSource()======");
  } //SourceToHtmlController()

  


  //=====================================Error Messages//

  //==Hadith//
  getHadithErrot(I_type) {
    //console.log("getHadithErrot()");
    //console.log(I_type);

    switch (I_type.fetchingMethod) {
      case "Chapter":
        {
          if (this.srv.rFPI.get("FetchingMethod").value == "number") {
            let error;
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("required"))
              error = "This field is Required";
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("min"))
              error =
                "Minimum number is " +
                this.srv.rFPI.get(I_type.fieldlName).getError("min").min;
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("max"))
              error =
                "Maximum number is " +
                this.srv.rFPI.get(I_type.fieldlName).getError("max").max;
            return error;
          }
          if (this.srv.rFPI.get("FetchingMethod").value == "new") {
            let error;
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("required"))
              error = "This field is Required";
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("min"))
              error =
                "Minimum number is " +
                this.srv.rFPI.get(I_type.fieldlName).getError("min").min;
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("max"))
              error =
                "Maximum number is " +
                this.srv.rFPI.get(I_type.fieldlName).getError("max").max;
            return error;
          }
          if (this.srv.rFPI.get("FetchingMethod").value == "old") {
            //console.log("Error old are reported");
            let error;
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("required"))
              error = "This field is Required";
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("min"))
              error =
                "Minimum number is " +
                this.srv.rFPI.get(I_type.fieldlName).getError("min").min;
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("max"))
              error =
                "Maximum number is " +
                this.srv.rFPI.get(I_type.fieldlName).getError("max").max;
            return error;
          }
          if (this.srv.rFPI.get("FetchingMethod").value == "tag") {
            //console.log("Error tag are reported");
            let error;
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("required"))
              error = "This field is Required";
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("min"))
              error =
                "Minimum number is " +
                this.srv.rFPI.get(I_type.fieldlName).getError("min").min;
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("max"))
              error =
                "Maximum number is " +
                this.srv.rFPI.get(I_type.fieldlName).getError("max").max;
            return error;
          }
        }
        break;
      case "Hadith":
        {
          if (this.srv.rFPI.get("FetchingMethod").value == "number") {
            let error;
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("required"))
              error = "This field is Required";
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("min"))
              error =
                "Minimum number is " +
                this.srv.rFPI.get(I_type.fieldlName).getError("min").min;
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("max"))
              error =
                "Maximum number is " +
                this.srv.rFPI.get(I_type.fieldlName).getError("max").max;
            return error;
          }
          if (this.srv.rFPI.get("FetchingMethod").value == "new") {
            let error;
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("required"))
              error = "This field is Required";
            if (this.srv.rFPI.get(I_type.otherfieldlName).invalid)
              error = "Please enter a Valid input on chapter";
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("min"))
              error =
                "Minimum number is " +
                this.srv.rFPI.get(I_type.fieldlName).getError("min").min;
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("max"))
              error =
                "Maximum number is " +
                this.srv.rFPI.get(I_type.fieldlName).getError("max").max;
            return error;
          }
          if (this.srv.rFPI.get("FetchingMethod").value == "old") {
            //console.log("Error old are reported");
            let error;
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("required"))
              error = "This field is Required";
            if (this.srv.rFPI.get(I_type.otherfieldlName).invalid)
              error = "Please enter a Valid input on chapter";
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("min"))
              error =
                "Minimum number is " +
                this.srv.rFPI.get(I_type.fieldlName).getError("min").min;
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("max"))
              error =
                "Maximum number is " +
                this.srv.rFPI.get(I_type.fieldlName).getError("max").max;
            return error;
          }
          if (this.srv.rFPI.get("FetchingMethod").value == "tag") {
            let error;
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("required"))
              error = "This field is Required";
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("min"))
              error =
                "Minimum number is " +
                this.srv.rFPI.get(I_type.fieldlName).getError("min").min;
            if (this.srv.rFPI.get(I_type.fieldlName).hasError("max"))
              error =
                "Maximum number is " +
                this.srv.rFPI.get(I_type.fieldlName).getError("max").max;
            return error;
          }
        }
        break;
    }
  }

  getHadithChapternumberError() {
    /*
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
      */
  }
  //Hadith==//


  //==Quran//
  getAyatNumberError() {
    return this.srv.rFQ.get("ayat_number").hasError("required")
      ? "required"
      : this.srv.rFQ.get("ayat_number").hasError("max")
        ? "this Surah only has " + this.srv.rFQ.get("ayat_number").getError("max") + " Ayat"
        : this.srv.rFQ.get("ayat_number").hasError("min")
          ? "Minimum is 1"
          : "Invalid input";
  }

  getSurahError() {
    return this.srv.rFQ.get("surah_number").hasError("required")
      ? "required"
      : this.srv.rFQ.get("surah_number").hasError("max")
        ? "The Quran has 114 Surrah"
        : this.srv.rFQ.get("surah_number").hasError("min")
          ? "Minimum is 1"
          : "Invalid input";
  }
  //Quran==//

  //Error Messages=====================================//

  //=============Navidations//
  Previous() {
    if (
      this.srv.Source.methodAPI.myAPI &&
      this.srv.Source.source.hadith.status
    ) {
      this.srv.rFPI.get("number").setValue(this.srv.rFPI.get("number").value - 1);
      //this.LookupPI("number");
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
      this.srv.rFPI.get("number").setValue(this.srv.rFPI.get("number").value + 1);
      //this.LookupPI("number");
    }

    if (this.srv.Source.source.quran) {
      let ayat = this.srv.rFQ.get("ayat_number").value + 1;
      if (ayat > this.ayatMax) return;
      this.srv.rFQ.get("ayat_number").setValue(ayat);
    }

  }
  //Navidations=============//
  
  CreateNavUrl(){

    let source 
    let method 

    let number 
    
    let Ch
    let Hadith

    let surah
    let ayat

    
    let tagNum 
    let tagChar

    let navurl

    
    source = this.source_options.value;
    method = this.srv.rFPI.get("FetchingMethod").value;

    number = this.srv.rFPI.get("number").value;

    Ch = this.srv.rFPI.get("NewChapter").disabled?this.srv.rFPI.get("OldChapter").value:this.srv.rFPI.get("NewChapter").value;
    Hadith = this.srv.rFPI.get("NewHadith").disabled?this.srv.rFPI.get("OldHadith").value:this.srv.rFPI.get("NewHadith").value;

    tagNum = parseInt(this.srv.rFPI.get("OtherTag").value, 10);
    /*
    var HoldTag: number = parseInt(this.srv.rFPI.get("OtherTag").value, 10);
    tagNum = HoldTag;
    //Check if input is from the Missing hadiths and correct input
    this.MissinMuslimTag.forEach(NumArr => {
      var firstNum = NumArr[0];
      NumArr.forEach(num => {
        if (HoldTag == num) {
          tagNum = firstNum;
        }
      });
    });*/
    tagChar = this.srv.rFPI.get("OtherTagChars").value;
    tagChar = tagChar==undefined||tagChar.length>1?"":tagChar

    surah=this.srv.rFQ.get("surah_number").value
    ayat=this.srv.rFQ.get("ayat_number").value
    
    var inval:boolean=false;
    
    console.log("CreateNAvURl()Values");
    console.log("number");
    console.log(this.srv.rFPI.get("number").value);
    console.log("NewChapter");
    console.log(this.srv.rFPI.get("NewChapter").value);
    console.log("NewHadith");
    console.log(this.srv.rFPI.get("NewHadith").value);
    console.log("OldChapter");
    console.log(this.srv.rFPI.get("OldChapter").value);
    console.log("OldHadith");
    console.log(this.srv.rFPI.get("OldHadith").value);
    console.log("OtherTag");
    console.log(this.srv.rFPI.get("OtherTag").value);
    console.log("OtherTagChars");
    console.log(this.srv.rFPI.get("OtherTagChars").value);
    console.log("surah");
    console.log(this.srv.rFPI.get("surah").value);
    console.log("ayat");
    console.log(this.srv.rFPI.get("ayat").value);
    

     switch ( source ) {
       //If Bukhari
       case "bukhari":
          {

          switch (method) {
            case "number":{
              navurl=`${source}/${method}/${number}`
              break;
            }

            case "new":{
              navurl=`${source}/${method}/${Ch}/${Hadith}`
              break;
            }
            case "old":{
              navurl=`${source}/${method}/${Ch}/${Hadith}`
              break;
            }
            default:
              break;
          }//Swich Child
          inval=this.srv.rFPI.invalid?true:inval;
          break;
        }

        //Muslim
        case "muslim":
         {

          switch (method) {
            case "tag":{
              navurl= tagChar==undefined||tagChar.length>1?`${source}/${method}/${tagNum}`:`${source}/${method}/${tagNum}/${tagChar}`
              //navurl=`${source}/${method}/${tagNum}/${tagChar}`
              break;
            }
            case "new":{
              navurl=`${source}/${method}/${Ch}/${Hadith}`
          

              break;
            }

            case "old":{
              navurl=`${source}/${method}/${Ch}/${Hadith}`
              break;
            }
              
          
            default:
              break;
          }//Swich Child
          inval=this.srv.rFPI.invalid?true:inval;
          break;
        }

        //Quran
        case "quran":
        {
          navurl=`${source}/${surah}/${ayat}/`
          inval=this.srv.rFQ.invalid?true:inval;

          break;
        }
     
       default:inval=true
         break;
     }//Swich Parent



     if( inval ){
      //console.log("Invalid");
      
      //console.log(navurl);
      this.getvalidations(this.srv.rFPI);
      this.getvalidations(this.srv.rFQ);
      this.snack.open("Does not exist","x",{duration:5000});
      return null
    }
    else
    {
      //console.log("Created Navurl");
      //console.log(navurl);
      this.router.navigate([navurl])
      
      return navurl;
      //this.LookupPI();
    }


  }//CreateNavUrl();


  
  CreateRquestFromUrl(sourceParameter?:string,methodParameter?:string,val1?,val2?,val3?){

    var request_obj:Lib3.IncomingRequest;


    let source:string = this.lower(sourceParameter);
    let method:string = this.lower(methodParameter);//number old new tag

    let number:number = parseInt(val1);
    
    let Ch:number=//parseInt(val1);
    val1;
    let Hadith:number=//parseInt(val2);
    val2;

    let surah:number=//parseInt(val1);
    val1;
    let ayat:number=//parseInt(val2);
    val2;

    
    let tagNum = parseInt(val1);
    let tagChar= val2==undefined||val2.length>1?"":val2/*"all"*/;
    tagChar
    console.log("CreateRquestFromUrl()");
    console.log("tagChar");
    console.log(tagChar);

  
    var inval:boolean=false;

    if( !this.srv.isMethodaValid(source,method)||!this.srv.isSourceValid(source) ){
      //console.log("METHOD OR SOURCE CHECK FALIED");
      
       return null
    }

     switch ( source ) {
       //If Bukhari
       case "bukhari":
          {
            //console.log("source");
            //console.log(source);
            
            //console.log("source input value");
            //console.log(this.source_options.value);
            
            
           if (this.source_options.value != source) {
            this.UpdateSource(source);
            //console.log("Setting Value");
            
            this.source_options.setValue(source);
          }

          switch (method) {
            case "number":{
              
              if(this.srv.rFPI.get("number").value != number||
              this.srv.rFPI.get("FetchingMethod").value !=method
              ){
              //Select Method
              this.srv.rFPI.get("FetchingMethod").setValue(method);

              //select values
              this.srv.rFPI.get("number").setValue(number);
              this.srv.rFPI.get("number").markAsTouched();
              this.srv.ValidateHadithInputs("method");
              this.srv.rFPI.get("number").markAsTouched();

            }

              request_obj= {
                Method: 1,
                Refrencetype: "hadith",
                src: 1,
                value1: number,
                tag1: "",
                tag2: "",
                value2: 0,
                value3: 0,
                value4: 0,
                source: "hadith",
                lang: "",
                url:'',
              };
              
              break;
            }

            case "new":{
              if ( this.srv.rFPI.get("NewChapter").value != Ch||
              this.srv.rFPI.get("NewHadith").value != Hadith||
              this.srv.rFPI.get("FetchingMethod").value !=method
              ) {
                
                //Select Method
                this.srv.rFPI.get("FetchingMethod").setValue(method);
                //this.UpdateInputDisable();
              this.srv.ValidateHadithInputs("method");
              
              //select values
              this.srv.rFPI.get("NewChapter").setValue(Ch);
              this.srv.ValidateHadithInputs("chapter");
              this.srv.rFPI.get("NewChapter").markAsTouched();
              
              this.srv.rFPI.get("NewHadith").setValue(Hadith);
              this.srv.rFPI.get("NewHadith").markAsTouched();
            }
              
              request_obj = {
                Method: 2,
                Refrencetype: "hadith",
                src: 1,
                value1: Ch,
                tag1: "",
                tag2: "",
                value2: Hadith,
                value3: 0,
                value4: 0,
                source: "hadith",
                lang: "",
                url:'',
              };

              break;
            }
            case "old":{

              if (this.srv.rFPI.get("OldChapter").value != Ch||
              this.srv.rFPI.get("OldHadith").value != Hadith||
              this.srv.rFPI.get("FetchingMethod").value !=method
              ) {

                //Select Method
                this.srv.rFPI.get("FetchingMethod").setValue(method);
                //this.UpdateInputDisable();
                this.srv.ValidateHadithInputs("method");
                
                //select values
                this.srv.rFPI.get("OldChapter").setValue(Ch);
                this.srv.ValidateHadithInputs("chapter");
                this.srv.rFPI.get("OldChapter").markAsTouched();
                
                this.srv.rFPI.get("OldHadith").setValue(Hadith);
                this.srv.rFPI.get("OldHadith").markAsTouched();
              }

              request_obj = {
                Method: 3,
                Refrencetype: "hadith",
                src: 1,
                value1: 0,
                tag1: "",
                tag2: "",
                value2: Ch,
                value3: Hadith,
                value4: 0,
                source: "hadith",
                lang: "",
                url:'',
              };
              break;
            }
              
          
            default:
              break;
          }//Swich Child

          if(this.srv.rFPI.invalid)
          inval=true;

          break;
        }

        //Muslim
        case "muslim":
         {
           if (this.source_options.value != source) {
             this.UpdateSource(source);
             this.source_options.setValue(this.lower(source));
          }

          switch (method) {
            case "tag":{
              if (this.srv.rFPI.get("OtherTag").value!=tagNum||
              this.srv.rFPI.get("FetchingMethod").value !=method
              //||this.srv.rFPI.get("OtherTagChars").value != tagChar
              ) {

                //Select Method
                this.srv.rFPI.get("FetchingMethod").setValue(method);
                //this.UpdateInputDisable();
                //this.srv.ValidateHadithInputs("method");
                
                //select values
                this.srv.rFPI.get("OtherTag").setValue(tagNum);
                this.srv.ValidateHadithInputs("method");
                this.srv.rFPI.get("OtherTag").markAsTouched();
                
                this.srv.rFPI.get("OtherTagChars").setValue(tagChar);
                this.srv.ValidateHadithInputs("chapter");
                this.srv.rFPI.get("OtherTagChars").markAsTouched();
              }

              if (tagChar == ""/*"all"*/) {
                var request_obj: Lib3.IncomingRequest = {
                  Method: 5,
                  Refrencetype: "muslim tag",
                  src: 2,
                  value1: 0,
                  value2: 0,
                  value3: 0,
                  value4: tagNum,
                  tag1: "",//tagChar,
                  tag2: "",
                  source: "hadith",
                  lang: "",
                  url:'',
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
                  url: "",
                };

              }

              break;
            }

            case "new":{
              if (this.srv.rFPI.get("NewChapter").value != Ch||
              this.srv.rFPI.get("NewHadith").value != Hadith||
              this.srv.rFPI.get("FetchingMethod").value !=method) {

                //Select Method
                this.srv.rFPI.get("FetchingMethod").setValue(method);
                //this.UpdateInputDisable();
                this.srv.ValidateHadithInputs("method");
              
              //select values
              this.srv.rFPI.get("NewChapter").setValue(Ch);
              this.srv.ValidateHadithInputs("chapter");
              this.srv.rFPI.get("NewChapter").markAsTouched();
              
              this.srv.rFPI.get("NewHadith").setValue(Hadith);
              this.srv.rFPI.get("NewHadith").markAsTouched();
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
                url:'',
              };          

              break;
            }

            case "old":{
              if (this.srv.rFPI.get("OldChapter").value != Ch||
              this.srv.rFPI.get("OldHadith").value != Hadith||
              this.srv.rFPI.get("FetchingMethod").value !=method) {
                //Select Method
                this.srv.rFPI.get("FetchingMethod").setValue(method);
                //this.UpdateInputDisable();
                this.srv.ValidateHadithInputs("method");
                
                //select values
                this.srv.rFPI.get("OldChapter").setValue(Ch);
                this.srv.ValidateHadithInputs("chapter");
                this.srv.rFPI.get("OldChapter").markAsTouched();
                
                this.srv.rFPI.get("OldHadith").setValue(Hadith);
                this.srv.rFPI.get("OldHadith").markAsTouched();
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
                url:'',
              };
              break;
            }
            default:
              break;
          }//Swich Child

          if(this.srv.rFPI.invalid)
          inval=true;
          break;
        }

        //Quran
        case "quran":
        {
          if (this.source_options.value != source) {
            this.UpdateSource(source);
            this.source_options.setValue(this.lower(source));
         }
          if (this.srv.rFQ.get("surah_number").value != surah||
          this.srv.rFQ.get("ayat_number").value != ayat
          ) 
          {            
            this.srv.rFQ.get("surah_number").setValue(surah);
            this.srv.rFQ.get("surah_number").markAsTouched();
            
            this.srv.rFQ.get("ayat_number").setValue(ayat);
            this.srv.rFQ.get("ayat_number").markAsTouched();
          }
          
          let _url
          _url = `https://api.alquran.cloud/ayah/${surah}:${ayat}/`;
          request_obj= {
            source: "quran",
            url: "",
            value1: surah,
            value2: ayat,
            value3: 0,
            Method: 1,
            Refrencetype: "surah ayat lang",
          };

          if(this.srv.rFQ.invalid)
          {
            inval=true;
          }

          break;
        }
     
       default:inval=true
         break;
     }//Swich Parent


     if( inval ){
       //console.log("Invalid UrlToRequest");
       //console.log(request_obj);
       
      this.getvalidations(this.srv.rFPI);
      return null//request_obj
    }
    else
    {
      //console.log("OK UrlToRequest");
      //console.log(request_obj);
      
      
      //this.web.IncomingRequests$.next(request_obj);
      return request_obj;

      //this.LookupPI();
    }


  }//SetInputs();


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

  copyLink(){
    var link=window.location.href
    this.srv.copyMessage(link)
    this.snack.open(`Copied Link "${link}"`,"x",{duration:1000})
  }

  //================================================Testing==================================================//
  //================================================Testing==================================================//
  //================================================Testing==================================================//

  
  getvalidations(rF: FormGroup) {
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

  Test() {
    console.log("toutched?");
    console.log(this.srv.rFQ.touched);
    console.log("untouched?");
    /*
    var source = this.source_options.value;
    var method = this.srv.rFPI.get("FetchingMethod").value;

    var number = this.srv.rFPI.get("number").value;

    var Ch = this.srv.rFPI.get("NewChapter").disabled?this.srv.rFPI.get("OldChapter").value:this.srv.rFPI.get("NewChapter").value;
    var Hadith = this.srv.rFPI.get("NewHadith").disabled?this.srv.rFPI.get("OldHadith").value:this.srv.rFPI.get("NewHadith").value;

    console.log(
      "Test Results"
    );
    
    console.log(this.srv.CheckHadithValue(source,method,number));
    console.log("isVAlid CHecker, is Source valid");
    console.log(this.srv.isSourceValid(source));
     
    console.log(this.srv.isMethodaValid(source,number));
    
    console.log("LOG form invalieds");
*/
console.log("URL");

console.log(window.location.href);
this.srv.copyMessage(window.location.href)
/*
    console.log("number");
    console.log(this.srv.rFPI.get("number").invalid);
    console.log("NewChapter");
    console.log(this.srv.rFPI.get("NewChapter").invalid);
    console.log("NewHadith");
    console.log(this.srv.rFPI.get("NewHadith").invalid);
    console.log("OldChapter");
    console.log(this.srv.rFPI.get("OldChapter").invalid);
    console.log("OldHadith");
    console.log(this.srv.rFPI.get("OldHadith").invalid);
    console.log("OtherTag");
    console.log(this.srv.rFPI.get("OtherTag").invalid);
    console.log("OtherTagChars");
    console.log(this.srv.rFPI.get("OtherTagChars").invalid);
    console.log("surah");
    console.log(this.srv.rFPI.get("surah").invalid);
    console.log("ayat");
    console.log(this.srv.rFPI.get("ayat").invalid);
    
    */
    /*
    var nasaiEdited=nasaiIndexChapter.bold;

    for (let i = 0; i < nasaiIndexChapter.bold.length; i++) {
      if (i+1 < nasaiEdited.length)
      if ( ( nasaiEdited[i + 1].ohf -1 ) < nasaiEdited[i].oh) {
         //console.log("nonEqual "+i);
         //console.log(nasaiEdited[i]);  
      }      
    }
    */
   /*
    //console.log("Tag Missing Numbers");
    //console.log(this.MuslimTag.length);
    var allmissing: number[][] = [[]];
    for (let i = 0; i < this.MuslimTag.length; i++) {
      if (i > 8)
        if (
          parseInt(this.MuslimTag[i - 1].match(/(\d+)/g)[0]) !=
          parseInt(this.MuslimTag[i].match(/(\d+)/g)[0]) - 1
        ) {
          var prev = parseInt(this.MuslimTag[i - 1].match(/(\d+)/g)[0]);
          var curr = parseInt(this.MuslimTag[i].match(/(\d+)/g)[0]);
          //console.log(prev );
          //console.log(curr);
          var missinghadithsnumbers: number[] = [];
          var index = 0;
          for (let num = prev; num < curr; num++) {
            missinghadithsnumbers[index] = num;
            index++;
          }
          //console.log("Missing Numbers Array");
          //console.log(missinghadithsnumbers);
          allmissing[i - 9] = missinghadithsnumbers;
        }
    }
    allmissing = this.cleanArray(allmissing);
    //console.log(allmissing);
    var elements = { tags: this.MuslimTag, missing: allmissing };
    //console.log(elements);
    */
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
