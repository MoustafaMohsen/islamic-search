export interface HadithBook{
    book:number;
    hadiths:hadith[];
  }
export interface hadith{
    hadith:string;
}
export interface HadithAddress{
  chapter:number;
  hadith:number;
}
export interface Quranaddress{
  chapter:number;
  verse:number;
}
export interface ApiRequest{
  url:string;
  source:string;
  hadithaddress?:HadithAddress;
  quranaddress?:Quranaddress;
  language:string;
}
export interface hadithaddress {
  book:number;
  from:number;
  to:number;
}

