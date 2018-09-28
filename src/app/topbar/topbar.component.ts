import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { IMyAPIFetchingMethod, Lib3 } from "../interfaces";
import { MyServiceService } from '../my-service.service';
//import {  OldBukhariIndex} from "../SourceOptions/Bukhari";
//import {  Muslim} from "../SourceOptions/Muslim";
import { Bindex, Mindex } from "../SourceOptions/myindex";
import { QuranIndex } from '../SourceOptions/Quran';
import { WebService } from '../web.service';
//import * as hadithJson from "../SourceOptions/jsonPrase/bukhari.json";
//import * as _HadithMap from "../SourceOptions/jsonPrase/BmapNew.json"
import * as _MuslimTag from "./muslimTagsfullchar.json";

declare var $: any;
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  MuslimTag:string[]=_MuslimTag.default.tags as string[];
  MissinMuslimTag:number[][]=_MuslimTag.default.missing;
  apiURL = "";
  OtherTagCharsArray:string[];
  ayatMax: number;
  loading: boolean = false;
  myUsingOptions:{value:string,englishName:string}[]=[];
  objectKeys=Object.keys;
  currentFetchingMethod;
  //FormControll
  rFQ: FormGroup;
  rFPI: FormGroup;
  source_options:FormControl=new FormControl();
  constructor(
    private web: WebService, private snack: MatSnackBar, 
    private FormBuilder: FormBuilder,
    //private http:HttpClient,
    public srv:MyServiceService
  ) {

    this.rFPI = FormBuilder.group({
      'FetchingMethod':[/*"number"*/, [Validators.required] ],
      'number': [{value: [ Validators.min(1) ]}],
      //'NewVol': [{value: null}],
      'NewChapter': [{value: [ Validators.min(1) ]}],
      'NewHadith': [{value: [ Validators.min(1) ] },[ ] ],
      'OldVol': [{value: null}],
      'OldChapter': [{value: [ Validators.min(1) ]}],
      'OldHadith': [{value: [ Validators.min(1) ]}],
      'OtherTag': [{ value: null } ],
      'OtherTagChars': [{ value: "All" } ],
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
    //Initial Source=======

    console.log("===ngOnInit");

    console.log("=Initial Source=");
    console.log(this.srv.Source);

    console.log("ngOnInit===");

    //Initial Source=======
    setTimeout( () => {
      this.SetMaxAyat( this.rFQ.get('ayat_number') , 1 );
      this.UpdateInputDisable()
      this.source_options.setValue('Quran',{emitEvent:true});
    }, 100);

    this.web.Loading.subscribe(b => this.loading = b);
    this.source_options.valueChanges.subscribe(
      (value) => {
        console.log("=======MARK========");
        
        //emit value change
        this.rFPI.get('FetchingMethod').setValue(this.rFPI.get('FetchingMethod').value);
        //update Source
        this.UpdateSource(value);
        //this.ValidateHadithInputs("chapter");
        this.ValidateHadithInputs("method");
      }
    );



    //=======Value Changes

    this.rFQ.get('surah_number').valueChanges.subscribe(
      value => {
        this.SetMaxAyat( this.rFQ.get('ayat_number'),value );
        //this.rFQ.get('ayat_number').setValue(1)
        //this.rFQ.get('ayat_number').setValidators([Validators.required,Validators.max(this.ayatMax),Validators.min(1)])
      }
    )
    //Value Changes=======

    //========Set myUseOptions 

    this.rFPI.get('NewChapter').valueChanges.subscribe(
      (value)=>{
        this.ValidateHadithInputs("chapter");
      }
    );
    this.rFPI.get('OldChapter').valueChanges.subscribe(
      (value)=>{
        this.ValidateHadithInputs("chapter");
      }
    );
    this.rFPI.get('OtherTag').valueChanges.subscribe(
      (value)=>{
        this.ValidateHadithInputs("chapter");
      }
    );
    this.rFPI.get('FetchingMethod').valueChanges.subscribe(
      value => {
        console.log("=======UpdateHtmlController");
        this.UpdateInputDisable();
        this.ValidateHadithInputs("method");
        console.log(this.srv.Source);
        console.log("UpdateHtmlController=======");
      }
    );

    //Set my Use Options========


    this.srv.Navigation$.subscribe((data)=>{
      switch (data.Action) {
        case "next": this.Next()
          break;
        case "previous": this.Previous()
          break;
        default:
          break;
      }
    })
        //==============Old Hadith Method

        //Old Hadith Method==============

  }//ngOnInit========================================================================================//
  //ngOnInit========================================================================================//


  
  
  
  //=====================================Error Messages//

  //==Hadith//
  
  getHadithErrot(I_type){
    switch(I_type.fetchingMethod){
      case "Chapter":{
        
          if(this.currentFetchingMethod=="number"){
            let error
            if( this.rFPI.get(I_type.fieldlName).hasError("required") )
            error = 'This field is Required'
            if( this.rFPI.get(I_type.fieldlName).hasError("min") )
            error = 'Minimum number is '+  this.rFPI.get(I_type.fieldlName).getError("min").min;
            if( this.rFPI.get(I_type.fieldlName).hasError("max") )
            error = 'Maximum number is '+  this.rFPI.get(I_type.fieldlName).getError("max").max;
            return error;
            
          }
          if(this.currentFetchingMethod=="new"){
            let error
            if( this.rFPI.get(I_type.fieldlName).hasError("required") )
            error = 'This field is Required'
            if( this.rFPI.get(I_type.fieldlName).hasError("min") )
            error = 'Minimum number is '+  this.rFPI.get(I_type.fieldlName).getError("min").min;
            if( this.rFPI.get(I_type.fieldlName).hasError("max") )
            error = 'Maximum number is '+  this.rFPI.get(I_type.fieldlName).getError("max").max;
            return error;
          }      
          if(this.currentFetchingMethod=="old"){
            console.log("Error old are reported");
            let error
            if( this.rFPI.get(I_type.fieldlName).hasError("required") )
            error = 'This field is Required'
            if( this.rFPI.get(I_type.fieldlName).hasError("min") )
            error = 'Minimum number is '+  this.rFPI.get(I_type.fieldlName).getError("min").min;
            if( this.rFPI.get(I_type.fieldlName).hasError("max") )
            error = 'Maximum number is '+  this.rFPI.get(I_type.fieldlName).getError("max").max;
            return error;
          }
          if(this.currentFetchingMethod=="tag"){
            let error
            if( this.rFPI.get(I_type.fieldlName).hasError("required") )
            error = 'This field is Required'
            if( this.rFPI.get(I_type.fieldlName).hasError("min") )
            error = 'Minimum number is '+  this.rFPI.get(I_type.fieldlName).getError("min").min;
            if( this.rFPI.get(I_type.fieldlName).hasError("max") )
            error = 'Maximum number is '+  this.rFPI.get(I_type.fieldlName).getError("max").max;
            return error;
          }
        
      }
      break;
      case "Hadith":{
        
        if(this.currentFetchingMethod=="number"){
          let error
          if( this.rFPI.get(I_type.fieldlName).hasError("required") )
          error = 'This field is Required'
          if( this.rFPI.get(I_type.fieldlName).hasError("min") )
          error = 'Minimum number is '+  this.rFPI.get(I_type.fieldlName).getError("min").min;
          if( this.rFPI.get(I_type.fieldlName).hasError("max") )
          error = 'Maximum number is '+  this.rFPI.get(I_type.fieldlName).getError("max").max;
          return error;
          
        }
        if(this.currentFetchingMethod=="new"){
          let error
          if( this.rFPI.get(I_type.fieldlName).hasError("required") )
            error = 'This field is Required'
          if( this.rFPI.get(I_type.otherfieldlName).invalid )
          error = 'Please enter a Valid input on chapter';
          if( this.rFPI.get(I_type.fieldlName).hasError("min") )
          error = 'Minimum number is '+  this.rFPI.get(I_type.fieldlName).getError("min").min;
          if( this.rFPI.get(I_type.fieldlName).hasError("max") )
          error = 'Maximum number is '+  this.rFPI.get(I_type.fieldlName).getError("max").max;
          return error;
        }      
        if(this.currentFetchingMethod=="old"){
          console.log("Error old are reported");
          let error
          if( this.rFPI.get(I_type.fieldlName).hasError("required") )
          error = 'This field is Required'
          if( this.rFPI.get(I_type.otherfieldlName).invalid )
          error = 'Please enter a Valid input on chapter';
          if( this.rFPI.get(I_type.fieldlName).hasError("min") )
          error = 'Minimum number is '+  this.rFPI.get(I_type.fieldlName).getError("min").min;
          if( this.rFPI.get(I_type.fieldlName).hasError("max") )
          error = 'Maximum number is '+  this.rFPI.get(I_type.fieldlName).getError("max").max;
          return error;
        }
        if(this.currentFetchingMethod=="tag"){
          let error
          if( this.rFPI.get(I_type.fieldlName).hasError("required") )
          error = 'This field is Required'
          if( this.rFPI.get(I_type.fieldlName).hasError("min") )
          error = 'Minimum number is '+  this.rFPI.get(I_type.fieldlName).getError("min").min;
          if( this.rFPI.get(I_type.fieldlName).hasError("max") )
          error = 'Maximum number is '+  this.rFPI.get(I_type.fieldlName).getError("max").max;
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
    if (this.srv.Source.source.quran) 
    {
          if(this.rFQ.invalid)return;
          let surah= this.rFQ.get('surah_number').value
          let ayat= this.rFQ.get('ayat_number').value
          this.sendQurantRequest(surah,ayat,"ar");
          return;
    }
    else{
        console.log("no source was choosen\n last source was");
        console.log(this.srv.Source);
    }
  }

  sendQurantRequest(surah,ayat,lang){
    let _url = 'https://api.alquran.cloud/ayah/'+surah+':'+ayat+'/'//+lang+'.asad';
    if (_url == this.apiURL){this.snack.open("Already sent", "X", { duration: 1000 }); return;}
    this.apiURL = _url;
    
    let IncomingRequest:Lib3.IncomingRequest={
      source : "quran",
      url:_url,
      value1:surah,
      value2:ayat,
      value3:lang,
      Method:1,
      Refrencetype:"surah ayat lang"
    }
    this.web.IncomingRequests$.next(IncomingRequest)
  }
/*
  GetHadithAdressByBook(book, SOURCE: hadithaddress[]) {
    let x = SOURCE.filter(address => address.book == Number(book))
    return x[0];
  }
*/


  SetMaxAyat(ayat_number:AbstractControl,surahNumber) {
    let suran = surahNumber;
    if (suran <= 0||suran > 114) return
    let Surrah = QuranIndex.filter(f => f.number == suran);
    this.ayatMax = Surrah[0].numberOfAyahs;
    ayat_number.setValidators([Validators.required, Validators.min(1),Validators.max(this.ayatMax)])
    ayat_number.updateValueAndValidity();
  }


  Previous() {

    if(this.srv.Source.methodAPI.myAPI&&this.srv.Source.source.hadith.status){
      this.rFPI.get("number").setValue(this.rFPI.get("number").value-1);
      this.LookupPI("number");
    }

    if (this.srv.Source.source.quran) {
      let ayat = this.rFQ.get('ayat_number').value - 1;
      if (ayat <= 0) return;
      this.rFQ.get('ayat_number').setValue(ayat)
      this.LookUp();
    }
    /*
    if (this.srv.Source.source.hadith) {
      let hadithNo = this.rFH.get('hadith_number').value - 1;
      if ( this.TheHadithaddress==null||hadithNo < this.TheHadithaddress.from) return
      this.rFH.get('hadith_number').setValue(hadithNo);
      this.LookUp();
    }
*/
  }

  Next() {

    if(this.srv.Source.methodAPI.myAPI&&this.srv.Source.source.hadith.status){
      this.rFPI.get("number").setValue(this.rFPI.get("number").value+1);
      this.LookupPI("number");
    }

    if (this.srv.Source.source.quran) {
      let ayat = this.rFQ.get('ayat_number').value + 1;
      if (ayat > this.ayatMax) return;
      this.rFQ.get('ayat_number').setValue(ayat)
      this.LookUp();
    }
/*
    if (this.srv.Source.source.hadith) {
      let hadithNo = this.rFH.get('hadith_number').value + 1;
      if ( this.TheHadithaddress==null||hadithNo > this.TheHadithaddress.to) return
      this.rFH.get('hadith_number').setValue(hadithNo);
      this.LookUp();
    }
*/
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
      //this.rFPI.get('NewVol').enable({onlySelf: true, emitEvent: false});
      this.rFPI.get('NewChapter').enable({onlySelf: true, emitEvent: false});
      this.rFPI.get('NewHadith').enable({onlySelf: true, emitEvent: false});
      this.currentFetchingMethod ="new";
    }
    if (this.rFPI.get('FetchingMethod').value=="old"&&this.currentFetchingMethod !="old") {
      this.rFPI.disable({onlySelf: true, emitEvent: false})
      this.rFPI.get('FetchingMethod').enable({onlySelf: true, emitEvent: false});
      //this.rFPI.get('OldVol').enable({onlySelf: true, emitEvent: false});
      this.rFPI.get('OldChapter').enable({onlySelf: true, emitEvent: false});
      this.rFPI.get('OldHadith').enable({onlySelf: true, emitEvent: false});
      this.currentFetchingMethod ="old";
    }
    if (this.rFPI.get('FetchingMethod').value=="tag"&&this.currentFetchingMethod !="tag") {
      this.rFPI.disable({onlySelf: true, emitEvent: false})
      this.rFPI.get('FetchingMethod').enable({onlySelf: true, emitEvent: false});
      this.rFPI.get('OtherTag').enable({onlySelf: true, emitEvent: false});
      this.rFPI.get('OtherTagChars').enable({onlySelf: true, emitEvent: false});
      this.currentFetchingMethod ="tag";
    }

  }

  //=========Look up usin My API //

  ValidateHadithInputs(change){
    switch (change) {
      case "chapter":
      this.ValidateHadithHadithInputs()
        break;
      case "method":
      this.ValidateChapterInputs()
        break;
      
      default:
        break;
    }

  }
  //call this everytime a chapter value changes
  ValidateHadithHadithInputs(){
    console.log("\n Validate Hadith Inputs");
    
    //bukhari
    if(this.srv.Source.source.hadith.bukhari){
      /*if (this.currentFetchingMethod=="number") {
        this.rFPI.get("number").setValidators([Validators.required,Validators.max(7563),Validators.min(1)])
      }
      else*/ if(this.currentFetchingMethod=="new"){
        //Get max
        let chapter = this.rFPI.get("NewChapter").value;
        let Inew=Bindex.newList.find( (s)=>s.v1 == chapter ) ; 
        let max = Inew?Inew.v3:null
        this.rFPI.get("NewHadith").setValidators([Validators.required,Validators.max(max),Validators.min(1)])
        this.rFPI.get("NewHadith").updateValueAndValidity();

      }
      else if(this.currentFetchingMethod=="old"){
        console.log("====oldValudate===");
        let chapter = parseInt(this.rFPI.get("OldChapter").value,10);
        let Inew=Bindex.oldList.find( (s)=>s.v1 == chapter ) ; 
        let max = Inew?Inew.v3:null
        let min =Inew?Inew.v2:1
        this.rFPI.get("OldHadith").setValidators([Validators.required,Validators.max(max),Validators.min(min)])
        this.rFPI.get("OldHadith").updateValueAndValidity();
      }

    }//if Bukhari
    

    //muslim
    if(this.srv.Source.source.hadith.muslim){
      console.log("\n muslim source validator");
      /*
      if (this.currentFetchingMethod=="number") {
        this.rFPI.get("number").setValidators([Validators.required,Validators.max(7471),Validators.min(1)])
      }
      else */if(this.currentFetchingMethod=="new"){
        //Get max
        let chapter = this.rFPI.get("NewChapter").value;
        let Inew = Mindex.newList.find( (s)=>s.v1 == chapter )
        let max = Inew?Inew.v2 : null;
        this.rFPI.get("NewHadith").setValidators([Validators.required,Validators.max(max),Validators.min(1)])
        this.rFPI.get("NewHadith").updateValueAndValidity();
        //console.log("ch:"+chapter+" max:"+max+" min:"+min);

      }
      else if(this.currentFetchingMethod=="old"){
        console.log("====oldValudate===");
        let chapter = this.rFPI.get("OldChapter").value ;
        let Iold = Mindex.oldList.find( (s)=>s.v1 == chapter )
        let max = Iold?Iold.v3 : null;
        let min = Iold?Iold.v2 : null;
        this.rFPI.get("OldHadith").setValidators([Validators.required,Validators.max(max),Validators.min(min)])
        this.rFPI.get("OldHadith").updateValueAndValidity();
        console.log("ch:"+chapter+" max:"+max+" min:"+ min);
      }
      else if(this.currentFetchingMethod=="tag"){
        console.log("====OtherTagValidate===");
        let tagNumber = this.rFPI.get("OtherTag").value ;
        let tag = this.MuslimTag.find( (s)=>s.match(/(\d+)/g) == tagNumber );
        let chars:string[]
        if(tag)
        {
          chars=tag.match(/([A-z|a-z])/g);
          if (chars) {
            this.OtherTagCharsArray=chars;
            this.OtherTagCharsArray.unshift("All")
            setTimeout(() => {
              this.rFPI.get('OtherTagChars').setValue("All");
            }, 100);
          }
          else{
            this.OtherTagCharsArray=null
          }
        }
        {
          console.log("==tagNumber==");
          console.log(tagNumber);
          console.log("==tag==");
          console.log(tag);
          console.log("==chars==");
          console.log(chars);
        }
      }

    }//if muslim
    //Nasai Is temporarily Disabled
    {

      //nasai
      /*
      if(this.srv.Source.source.hadith.nasai){
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
  //call this only once a new method is selected
  ValidateChapterInputs(){
    console.log("\n Validate Chapter Inputs");
    //bukhari
    if(this.srv.Source.source.hadith.bukhari){
      if(this.currentFetchingMethod=="number"){
        let numbermax = 7563;
        this.rFPI.get("number").setValidators([Validators.required,Validators.max(numbermax),Validators.min(1)])
      }
      if(this.currentFetchingMethod=="new"){
        let chaptermax = 97;
        this.rFPI.get("NewChapter").setValidators([Validators.required,Validators.max(chaptermax),Validators.min(1)]);
        
      }      
      if(this.currentFetchingMethod=="old"){
        let chaptermax = 93;
        this.rFPI.get("OldChapter").setValidators([Validators.required,Validators.max(chaptermax),Validators.min(1)]);
      }
    }

    //Muslim
    if(this.srv.Source.source.hadith.muslim){
      console.log("\n muslim source validator");
      if(this.currentFetchingMethod=="new"){
        let chaptermax = 56;
        this.rFPI.get("NewChapter").setValidators([Validators.required,Validators.max(chaptermax),Validators.min(1)]);
        
      }      
      if(this.currentFetchingMethod=="old"){
        let chaptermax = 43;
        this.rFPI.get("OldChapter").setValidators([Validators.required,Validators.max(chaptermax),Validators.min(1)]);
      }
      if(this.currentFetchingMethod=="tag"){
        console.log("tag validator was set")
        this.rFPI.get("OtherTag").setValidators([Validators.required,Validators.max(3033),Validators.min(8)])
      }
    }

    //Nasai
    if(this.srv.Source.source.hadith.nasai){
      console.log("\n muslim source validator");
      if(this.currentFetchingMethod=="number"){
        let numbermax = 7471;
        this.rFPI.get("number").setValidators([Validators.required,Validators.max(numbermax),Validators.min(1)])
      }
      if(this.currentFetchingMethod=="new"){
        let chaptermax = 51;
        this.rFPI.get("NewChapter").setValidators([Validators.required,Validators.max(chaptermax),Validators.min(1)]);
        
      }      
      if(this.currentFetchingMethod=="old"){
        let chaptermax = 51;
        this.rFPI.get("OldChapter").setValidators([Validators.required,Validators.max(chaptermax),Validators.min(1)]);
      }
    }
  }

  UpdateSource(value){
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
      //Set Default FetchingMethod
      this.rFPI.get("FetchingMethod").setValue('number');
      this.myUsingOptions=[
        {value:'number',englishName:'Hadith Number'},
        {value:'new',englishName:'In Book Refrence'},
        {value:'old',englishName:'English Book Refrence'}
      ];
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
      //Set Default FetchingMethod
      this.rFPI.get("FetchingMethod").setValue('tag');
      //Update Validators
      this.ValidateHadithInputs("method");

      console.log("Source \"Muslim\" was choosen");
      this.myUsingOptions=[
        {value:'tag',englishName:'Reference'},
        {value:'new',englishName:'In Book Refrence'},
        {value:'old',englishName:'USC-MSA Refrence'}
      ];

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
        number:false//true
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
      //Set Default FetchingMethod
      this.rFPI.get("FetchingMethod").setValue('number');
      this.myUsingOptions=[
        {value:'number',englishName:'Hadith Number'},
        {value:'new',englishName:'In Book Refrence'},
        {value:'old',englishName:'English Book Refrence'}
      ];
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

  LookupPI(forceMethod?:string){
    console.log("==========LookupPI");
    
    console.log(this.rFPI);
    {
      
      var src = this.srv.Source.source.hadith.srcNu;
      var FetchingMethod = this.rFPI.get("FetchingMethod").value
      
      var Hadithnumber = this.rFPI.get("number").value;
      
      var OldVol=0;
      
      var NewChapter = this.rFPI.get("NewChapter").value;
      var NewHadith = this.rFPI.get("NewHadith").value;
      
      var OldChapter = this.rFPI.get("OldChapter").value;
      var OldHadith = this.rFPI.get("OldHadith").value;
      var HoldTag:number = parseInt(this.rFPI.get("OtherTag").value,10);
      var OtherTag:number=HoldTag;
      //Check if input is from the Missing hadiths and correct input
      this.MissinMuslimTag.forEach(NumArr => {
        var firstNum=NumArr[0];
        NumArr.forEach(num => {
          if(HoldTag==num){OtherTag=firstNum}
        });
      });
      var OtherTagChars:string = this.rFPI.get("OtherTagChars").value;
    }
    
    if ( FetchingMethod=="number" || forceMethod =="number" ) {
      //lookup for hadith map
      var request_obj:Lib3.IncomingRequest={
        Method:1,
        Refrencetype:"hadith",
        src:src,
        value1:Hadithnumber,
        tag1:"",
        tag2:"",
        value2:0,
        value3:0,
        value4:0,
        source:"hadith",
        lang:"",
        url:""

      }
      this.web.IncomingRequests$.next(request_obj);
      console.log("====lookupI");console.log("number");console.log(request_obj);
      console.log("====lookupI");
      return;
    }

    if ( FetchingMethod=="new" || forceMethod =="new" ) {
      var request_obj:Lib3.IncomingRequest={
        Method:2,
        Refrencetype:"book hadith",
        src:src,
        value1:NewChapter,
        value2:NewHadith,
        value3:0,
        value4:0,
        tag1:"",
        tag2:"",
        source:"hadith",
        lang:"",
        url:""

      }
      this.web.IncomingRequests$.next(request_obj);
      console.log("====lookupI");console.log("new");console.log(request_obj);
      console.log("====lookupI");
      return;
    }

    if ( FetchingMethod=="old" || forceMethod =="old" ) {
      var request_obj:Lib3.IncomingRequest={
        Method:3,
        Refrencetype:"vol book hadith",
        src:src,
        value1:OldVol,
        value2:OldChapter,
        value3:OldHadith,
        value4:0,
        tag1:"",
        tag2:"",
        source:"hadith",
        lang:"",
        url:""
      }
      this.web.IncomingRequests$.next(request_obj);
      console.log("====lookupI");console.log("old");console.log(request_obj);
      console.log("====lookupI");
      return;
    }

    if ( FetchingMethod=="tag" || forceMethod =="tag" ) {
      if (OtherTagChars=="All") {
        
        var request_obj:Lib3.IncomingRequest={
          Method:5,
          Refrencetype:"muslim tag",
          src:src,
          value1:0,
          value2:0,
          value3:0,
          value4:OtherTag,
          tag1:OtherTagChars,
          tag2:"",
          source:"hadith",
          lang:"",
          url:"",
          
        }
        
        this.web.IncomingRequests$.next(request_obj);
        console.log("====lookupI");console.log("tag");console.log(request_obj);
        console.log("====lookupI");
      }else{
        var request_obj:Lib3.IncomingRequest={
          Method:4,
          Refrencetype:"muslim tag",
          src:src,
          value1:0,
          value2:0,
          value3:0,
          value4:OtherTag,
          tag1:OtherTagChars,
          tag2:"",
          source:"hadith",
          lang:"",
          url:""
          
        }
        
        this.web.IncomingRequests$.next(request_obj);
        console.log("====lookupI");console.log("tag");console.log(request_obj);
        console.log("====lookupI");
      }
      return;
    }

    console.log("LookupPI==========");
  }
  //Look up usin My API =========//






  //================================================Testing==================================================//
  //================================================Testing==================================================//
  //================================================Testing==================================================//
  
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
    /*
    var nasaiEdited=nasaiIndexChapter.bold;

    for (let i = 0; i < nasaiIndexChapter.bold.length; i++) {
      if (i+1 < nasaiEdited.length)
      if ( ( nasaiEdited[i + 1].ohf -1 ) < nasaiEdited[i].oh) {
          console.log("nonEqual "+i);
          console.log(nasaiEdited[i]);  
      }      
    }
    */
    console.log("Tag Missing Numbers");
    console.log(this.MuslimTag.length);
    var allmissing:number[][]=[[]];
    for (let i = 0; i < this.MuslimTag.length; i++) {
      
      if(i>8)
      if( parseInt( this.MuslimTag[i-1].match( /(\d+)/g )[0] ) != parseInt( this.MuslimTag[i].match( /(\d+)/g )[0] ) - 1 ){
        var prev =parseInt( this.MuslimTag[i-1].match( /(\d+)/g )[0] );
        var curr =parseInt( this.MuslimTag[i].match( /(\d+)/g )[0] );
        //console.log(prev );
        //console.log(curr);
        var missinghadithsnumbers:number[]=[];
        var index = 0;
        for (let num = prev; num < curr; num++) {
          missinghadithsnumbers[index]=num
          index++;
        }
        console.log("Missing Numbers Array");
        console.log(missinghadithsnumbers);
        allmissing[i-9]=missinghadithsnumbers
        
        
      }
      
    }
    allmissing=this.cleanArray(allmissing);
    console.log(allmissing);
    var elements = {tags:this.MuslimTag,missing:allmissing}
    console.log(elements);

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

