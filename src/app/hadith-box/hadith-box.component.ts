import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from "@angular/material";
import { DomSanitizer } from '@angular/platform-browser';
import { Lib3 } from '../interfaces';
import { MyServiceService } from '../my-service.service';
import { WebService } from "../web.service";
declare var $: any;

@Component({
  selector: 'app-hadith-box',
  templateUrl: './hadith-box.component.html',
  styleUrls: ['./hadith-box.component.css']
})
export class HadithBoxComponent implements OnInit {
  @Input() apiURL;
  //Arabicboxcontent:Lib3.Value[]//=[];
  //Englishboxcontent:Lib3.Value[]//=[];

  ArContentArray:Lib3.Value[][]//=[[]];
  EnContentArray:Lib3.Value[][]//=[[]];

  loading:boolean;
  //hadithRefrence:{ number:number, in_book_refrence?: APiIn_Book_Refrence, old_refrence?: APiOld_refrence};
  //theC:string;
  constructor(public srv:MyServiceService,private sanitizer:DomSanitizer,private http:HttpClient,private web:WebService,private snack:MatSnackBar) 
  { }

  ngOnInit() {

    this.web.Loading.subscribe(x=>this.loading=x);

    this.web.IncomingRequests$.subscribe(

      (request)=>{
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
              
              this.ArContentArray=[[]];
              this.EnContentArray=[[]];

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
              
              let enC:Lib3.Value[]=block.content.filter(c=>c.name.match(/en/g) ).map(x=> 
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
              this.ArContentArray[0]=arC.slice();
              this.EnContentArray[0]=enC.slice();
              
              this.web.Loading.next(false);
            },
  
            error=>{
              this.snack.open(' ' +request.url+" Not found", "X", {duration: 5000,});
              this.web.Loading.next(false)
            }
  
          );
          //if Array Content
          if(request.Method==5)
          this.web.getHadithBlockArray(request).subscribe(
  
            blocks=>{
              this.ArContentArray=[[]];
              this.EnContentArray=[[]];
              
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
                
                this.ArContentArray[i]=arC.slice()//.sort( x=>x.value.match(/ar/g) );
                this.EnContentArray[i]=enC.slice();
              }//for
              
              this.web.Loading.next(false);

            },
  
            error=>{
              this.snack.open(' ' +request.url+" Not found", "X", {duration: 3000,});
              this.web.Loading.next(false)
            }
  
          )

      }//If Hadith

      //===If Quran
        if(request.source=='quran'){
          //Loading
          this.web.Loading.next(true);

          //For arabic
         //console.log(request.url);
          
          this.web.getQuran(request.url+'ar'+'.asad').subscribe(

            (ayat)=>{
             //console.log(ayat);
              
              //clean request and storing it
              this.ArContentArray=[[{value:ayat.data.text}]]
              
              //remove the start of the first ayat
              if(request.value2==1&&request.value1!=1){
                let firstAyat:string= String(ayat.data.text);
                firstAyat = firstAyat.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ','');
                this.ArContentArray=[[{value:firstAyat}]]
              }
              this.web.Loading.next(false)
            },

            error=>{
              this.snack.open(" "+request.url+" Not found", "X", {duration: 3000,});
              this.web.Loading.next(false)
            }

          );

          //For English
          this.web.getQuran(request.url+'en'+'.asad').subscribe(

            (ayat)=>{
              //clean request and storing it
              this.EnContentArray=[[{value:ayat.data.text}]]
              //remove the start of the first ayat
              if(request.value2==1&&request.value1!=1){
                let firstAyat:string= String(ayat.data.text);
                firstAyat = firstAyat.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ','');
                this.EnContentArray=[[{value:firstAyat}]]
              }
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

  }//ngOnInit
/*
  ShowArrayContet(array:Lib3.Value[]){
    console.log("SHow hadith");
    console.log(array);
    
    var many:boolean=array.length>1?true:false;
    var content:string;

    if (many) {
      var firstArray =array[0].value;
      var start = "<p class='emphisise-hadith'>";
      var secondArray = array[1].value;
      var otherArray="";
      var end = "</p>";
      for (let i = 2; i < array.length; i++) {
        const element = array[i].value;
        otherArray =  otherArray+element
      }
      content = firstArray +  start+secondArray+end  + otherArray ;
      console.log(secondArray);
      
    } else {
      content=array[0].value;
    }
    return content;
  }
*/

}//class

