import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarComponent } from './topbar.component';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/*
  //Loop script
  Hadithbooks=[{book:0,start:null,end:null}];
  //Send Sequential Request 
  loop(i){
      this.http.get<{hadith:number}[]>("https://muflihun.com/svc/hadith?c=1&b="+i).subscribe(
        r=>{
          let firstHadith= r[0].hadith;
          let lastHadith =  r[ r.length -1 ].hadith;
          let hadith = {
            book:i,
            start:firstHadith,
            end:lastHadith
          }
          this.Hadithbooks.push(hadith);
          setTimeout(() => {
            
            this.loop(i+1)
            console.log("hadith "+i +"is done");
          }, 1200);

      },
      ()=>{
        setTimeout(() => {
          if(i<=93)
          this.loop(i+1);
          console.log("hadith "+i +"FAILED");
          
        }, 1200);
      }
      );      
  }//loop
  printloop(){
    console.log(this.Hadithbooks);
    
  }



  CompareIndexes(){
    let oldIndex=OldBukhariIndex;
    let newIndex=bukhariIndexChapters.bold;
    for (let i = 1 ; i < newIndex.length; i++) {
      console.log(i);
      
      const element = newIndex[i - 1 ];
      let oldElement = oldIndex.find( (book)=>book.book ==  i );
      if(oldElement.from != element.ohf){
        console.log("Start old:"+ oldElement.from +", Start new:"+ element.ohf);
        
      }
      if(oldElement.to != element.oh){
        console.log("end old"+ oldElement.to +", end new:" +element.oh);
        
      }
      
    }
  }




  
  mySaveText(filename, text:string) {
    var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    var url = URL.createObjectURL(blob);

    let downloadUsingUrl=function(url,filename){
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = filename;
      a.textContent = 'Download file!';
  
      a.id =  Math.random().toString(36).substring(7);
      a.click();
      setTimeout(() => {
        $('#'+a.id).remove();
      }, 100);
    }//downloadUsingUrl

    downloadUsingUrl(url,filename)
    
  }//mySaveText


  ObjectsToArray(parsed):any[]{
    var element=[];
    //if not an array
    if ( typeof parsed == "string" ) {
      //console.log("It's a string ");
      element = [parsed];
    }
    //if array
    else{
      //console.log("It's an Object");
      element = parsed;            
    }
    return element;
  }//ObjectsToArray

  ObjectForceToArray(parsed):any[]{
    var element=[];

    if( !Array.isArray(parsed) ){
      element = [parsed];
    }else{
      element=parsed;
    }

    //console.log("forced array")
    

    return element;
  }//ObjectsToArray
  
  tsfilePraseJson(path?:string){
    console.log("YOU ARE USING TS METHOD");

    let JsonHADITH = this.hadithjson.default;

    //scope into object
    if( Array.isArray(JsonHADITH.hadithCollection.hadiths) ){ throw "CRUCIAL ERROR, HADITHS IS NOT OBJECT !!!"}
    let hadiths = JsonHADITH.hadithCollection.hadiths.hadith ;
    let model=[];
    for (let i = 0; i < hadiths.length; i++) {
      let Hadith = hadiths[i];
      //The working object
      let araprased = Hadith.arabic.text;
      let arabicText=this.ObjectsToArray(araprased);

      if (Hadith.english == null || Hadith.arabic == null) {
        console.log("CAUTION INFO MISSING");
        console.log(Hadith);
        console.log(i);
      }
      let parsed = Hadith.english?Hadith.english.text:"";
      let englishText=this.ObjectsToArray(parsed);



      let Reference:namespace3.Reference[]= this.ObjectForceToArray(Hadith.references.reference);
      let Part:[{astring:string}]
      
      //console.log("Hadith.references");
      //console.log(Hadith.references);
      //console.log("number");
      //console.log(i);
      
      
      for (let i2 = 0; i2 < Hadith.references.reference.length; i2++) {
        let refrence = Hadith.references.reference[i2];
        let partPrased = refrence.parts.part;
        Part=this.AssignObjectinArrayElements( "astring",this.ObjectsToArray(partPrased) ) as [{astring:string}];
        //Adjusting Part
        Reference[i2].parts = Part;

        let suf= Reference[i2].suffix?Reference[i2].suffix:"";
        Reference[i2].suffix=suf;
      }

      let correctedVerseRef: any = {
        reference:null
      };

      let refrence2:namespace2.reference2[]=[{
        chapter:"-1",
        firstVerse:"-1",
        lastVerse:"-1"
      }];

      if (Hadith.verseReferences !=null) {
        let refrence2 = Hadith.verseReferences.reference;
        correctedVerseRef.reference = this.ObjectForceToArray(refrence2);
      }else{
        correctedVerseRef = { reference:refrence2 }
      }
      
      //Adjusting hadith
      let element:namespace3.Hadith={
        references:Reference,
        arabic:this.AssignObjectinArrayElements("astring",arabicText) as [{ astring: string; }],
        english: this.AssignObjectinArrayElements("astring",englishText) as [{ astring: string; }],
        verseReferences:correctedVerseRef.reference,
        src:1
      }



      model.push(element);
    }//for

    //let HadithCol:namespace2.Hadith[] = model;
    let PrepedHadith:namespace3.Hadith[] = model;
    JsonHADITH.hadithCollection.hadiths = null;
    JsonHADITH.hadithCollection.hadiths = {hadith:PrepedHadith};
    let JsonHADITHOut:namespace.JSONBOOK = JsonHADITH;
    
    this.mySaveText( "JsonHADITHHadith.json", JSON.stringify(JsonHADITH) );
    console.log("=====HADITH====");
    //console.log(JsonHADITHOut);
    
      
  }//tsfilePraseJson

  AssignObjectinArrayElements = function(objectname:string,array){
    let out=[];
    for (let i = 0; i < array.length; i++) {
      let object = new Object;
      const element = array[i];
      object[objectname] = element
      out.push(object)
    }//for
    return out;
  }

  parseJson(input?:string,looparray?:boolean,fromefile?:boolean){

    //if input is TS file
    if(fromefile){
      this.tsfilePraseJson();
    }
    //if input is array
    else
    if(looparray){
      //let file = this.FileUpload.file[0];
      //var reader = new FileReader();
      console.log(this.FileUpload);
      let str = null;
      let parsedcollection = JSON.parse(str);
      //scope into object
      let hadiths = parsedcollection.hadiths.hadith;
      
      
      let model=[];
      for (let i = 0; i < hadiths.length; i++) {

        let element;
        //The working object
        const parsed = hadiths[i].arabic.text;

        //if not an array
        if ( typeof parsed == "string" ) {
          console.log("It's a string ");
          element = [parsed];
        }
        //if array
        else{
          console.log("It's an Object");
          element = parsed;            
        }
        
        model.push(element);
      }//for

      let content = JSON.stringify(str)
      this.mySaveText("testdownload.json", content )
        
    }//looparray



    
    //no don't looparray
    else{
      let str = input;
      let parsed = JSON.parse(str);
  
      //if parsed is not an array
      if ( typeof parsed[0] == "string" ) {
        console.log("It's a sting ");
        console.log(parsed);
        
        
      }else{
        console.log("It's an Object");
        console.log(parsed);
        
      }
    }
  }


  TestGet(){
    //var url = "http://localhost:1860/api/hadith/db/"
    var url ="http://localhost:1860/api/hadith/show/"
    var start = Date.now()
    var now ;
    for (let i = 0; i < 500 ; i++) {
      let src = 1;
      if( i%10 ==0 ){
        src = 2;
      }
      
      this.http.get( url +5).subscribe(
        (r)=> {

          if(i == 499)
          {
            console.log("HOW LONG IT TOOK in milliseconds");
            console.log(start - Date.now());
          }
        }


        );
      }
      
  }//TestGet()

  TestRequest(){
    var request_obj:Lib3.IncomingRequest =
    {
      Method:1,
      src:1,
      value1:50,
      Refrencetype:"",
      tag1:"",
      tag2:"",
      value2:0,
      value3:0,
      value4:0
    }
    this.web.getHadithBlock(request_obj).subscribe(
      Response=>
      {
        console.log(Response)
      }
    );
  }
  */
//OLD CODE
/*
//Find hadith by number
  CalcHadithNumber(hadithChapter?:HadithBook[],hadithnumber?:number){//(click) test
    var hadithcount:number=0;
    //loop to count
    hadithChapter.forEach(
      book => {
        book.hadiths.forEach(
          hadith => {
            hadithcount++;
            if (hadithcount==hadithnumber) {
              //execute logic for hadith numbers
              console.log("count==");
              console.log(hadithcount);
              console.log("==count");
              console.log(book.book+" book");
              console.log(hadith.hadith+" ");
            }
        });
    });
    console.log(hadithcount);
  }

//Loop script
Hadithbooks:HadithBook[]=[{book:0,hadiths:null},{book:0,hadiths:null}];
hadiths:hadith[];
  //Loop Script
  loop(){
    for (let i = 1; i <= 93; i++) {
      this.http.get<hadith[]>("https://muflihun.com/svc/hadith?c=1&b="+i).subscribe(
        r=>{
          var hold :HadithBook={book:0,hadiths:null}
          hold.book=i
          hold.hadiths=r
          this.Hadithbooks.push(hold)

        });
     // books.push(hold)
    }
  }//loop
  printloop(){
    console.log(this.Hadithbooks);
    
  }

    //Chapter Select Toggle
  toggleChapterSelect(){
    //check if select Chapter is disabled
    if (this.chapter==""||this.chapter==null) {
      this.disableChapterSelect=false
    }
    else{this.disableChapterSelect=true}
    //update Hadith Count
    //By chapter option
    if(this.chapter_book!=null){
     // this.hadithinChapterCount=this.GetHadithsCountinBook(this.chapter_book,BukhariLog)
    }
    //By chapter number
      else{
       // this.hadithinChapterCount=this.GetHadithsCountinBook(this.chapter,BukhariLog)
      }
      

    
  }

    //=================GETTING VALUES//

  //muslim https://muflihun.com/svc/hadith?c=2&b=1&h=1
  Hadithbooks:HadithBook[]=[{book:0,hadiths:null},{book:0,hadiths:null}];
  hadiths:hadith[];

    //Loop Script
    loop(){
      this.loopget(43)
    }//loop

    loopget(i){
      //to get log type from the internet
      
      if(i==0) {return}
      this.http.get<hadith[]>("https://muflihun.com/svc/hadith?c=2&b="+i).subscribe(
        r=>{
          var hold :HadithBook={book:0,hadiths:null}
          hold.book=i
          hold.hadiths=r
          this.Hadithbooks.push(hold)
          this.loopget(i-1);
        });
      }

      xx:hadithaddress[]=[];
      loop2(){
        //to convert Log to adress
        
        let x:hadithaddress;
        for (let i = 0; i <= 43; i++) {
          
          x= this.GetHadithsFromTo(i,MuslimLog,MuslimEnglishIndex);
          console.log(x);
          this.xx.push(x);
        }
        console.log(this.xx);
        
      }
      printloop(){
        console.log(this.Hadithbooks);
        
      }
      //GETTING VALUES=================//

 */
        /*
      case false:
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

*/


/*
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
        );*/

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