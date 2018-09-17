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