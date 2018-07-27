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
