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
  surah:number;
  ayat:number;
}
export interface ApiRequest{
  c:number;
  url:string;
  source:string;
  hadithaddress?:HadithAddress;
  quranaddress?:Quranaddress;
  language:string;
}


export interface hadithaddress {
  book:number;
  volume?:number;
  from:number;
  to:number;
}
export interface hadithEnglishIndex{ 
  book: string; 
  bookName: string; 
  volume: string; 
}
//http://api.alquran.cloud/ayah/1:7/en.asad
//http://api.alquran.cloud/ayah/[[surah:number]]:[[ayat:number]]/[[language(en,ar,fr):string]].asad
export interface quranAyat{
  code: number;//request status code
  status: string; //request status state
  data: {
      number: number; //ayat number 
      text: string; // The ayat text **
      edition: {
          identifier: string;
          language: string;
          name: string;
          englishName: string;
          format: string;
          type: string;
      };
      surah: {
          number: number; //surah nummber 
          name: string; //surah name **
          englishName: string; //surrah name English**
          englishNameTranslation: string; //surrah name transelated English**
          numberOfAyahs: number; // max ayat number
          revelationType: string; //maccian/madanian
      };
      numberInSurah: number;
      juz: number;
      manzil: number;
      page: number;
      ruku: number;
      hizbQuarter: number;
      sajda: boolean;
  };

 
}

export interface QIndex{
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}




export interface APiHadithRequest{
  id?:number;
  src:number;
  number?: number;
  in_book_refrence?: APiIn_Book_Refrence;
  old_refrence?: APiOld_refrence
}

export interface APiOld_refrence{
  id?: number;
  vol: number;
  book: number;
  hadith: number;
}

export interface APiIn_Book_Refrence{
  id?: number;
  tag: string;
  book: number;
  hadith: number;
  vol?:number;
}

export interface HadithModel{
  id?:number,
  src?: number,
  number?: number,
  arabicHTML?: string,
  arabicText?: string,
  englishHTML?: string,
  englishText?: string,
  in_book_refrence?: APiIn_Book_Refrence,
  old_refrence?: APiOld_refrence
}


export interface ISource{
  source:{
    hadith:{
      status:boolean; muslim:boolean; bukhari:boolean; nasai:boolean;name?:string;srcNu:number
    };
    quran:boolean;
  };
  methodAPI:{
    oldAPI:{
      state:boolean;
      fethingmethod?:{
        status:boolean,
        ch:boolean,
        chOp:boolean,
        ha:boolean,
        haOp:boolean,
        nu:boolean
      } 
    };
    myAPI:IMyAPIFetchingMethod
  };
};

export interface IMyAPIFetchingMethod{
    status:boolean;
    new:{
      status:boolean;ch:boolean;vol:boolean;ha:boolean
    };
    old:{
      status:boolean;ch:boolean;vol:boolean;ha:boolean
    };
    tag:{
      status:boolean; type:string;
    }; 
    number:boolean;
}
export interface hadithIndexch{
  bnew: {
      nh: number;
      nc: number;
  }[];
  bold: {
      ohf?:number,
      oh: number;
      oc: number;
  }[];
  maxNumber?:number;
  maxTag?:string;
  maxChar?:string;
}

const ty="Narrated Maimun bin Siyah that he asked Anas bin Malik, \"O Abu Hamza! What makes the life and property of a person sacred?\" He replied, \"Whoever says, 'None has the right to be worshipped but Allah', faces our Qibla during the prayers, prays like us and eats our slaughtered animal, then he is a Muslim, and has got the same rights and obligations as other Muslims have.\""
declare module HadithJson {

  export interface Xml {
      "@version": string;
      "@encoding": string;
  }

  export interface Parts {
      part: any;
  }

  export interface ReferenceDefinition {
      isPrimary: string;
      code: string;
      name: string;
      valuePrefix: string;
      parts: Parts;
  }

  export interface ReferenceDefinitions {
      referenceDefinition: ReferenceDefinition[];
  }

  export interface Parts2 {
      part: any;
  }

  export interface Reference {
      code: string;
      suffix?: any;
      parts: Parts2;
  }

  export interface References {
      reference: Reference[];
  }

  export interface Arabic {
      text: any;
  }

  export interface English {
      text: string[];
  }

  export interface VerseReferences {
      reference: any;
  }

  export interface Hadith {
      references: References;
      arabic: Arabic;
      english: English;
      verseReferences: VerseReferences;
  }

  export interface Hadiths {
      hadith: Hadith[];
  }

  export interface HadithCollection {
      code: string;
      name: string;
      copyright?: any;
      referenceDefinitions: ReferenceDefinitions;
      hadiths: Hadiths;
  }

  export interface RootObject {
      "?xml": Xml;
      hadithCollection: HadithCollection;
  }

}



export namespace Lib3
{
    export interface MyProperty
    {
        Name: string;
        Vol: number;
        Book: number;
        Hadith: number;
        type: string;
        TagChar: string;
        TagNumber: number;


    }

    export interface IncomingRequest
    {
        src?: number;
        Method?: number;
        Refrencetype?: string;
        value1?: number;
        value2?: number;
        value3?: number;
        value4?: number;
        tag1?: string;
        tag2?: string;
        source?:string;
        url?:string;
        lang?:string;
        name?:string;

    }
    export interface Value
    {
        id?: number;
        name?: string;
        value?: string;
    }


    export interface Refrence
    {
        id: number;
        name: string;
        Refrencetype: string;
        value1: number;
        value2: number;
        value3: number;
        value4: number;
        tag1: string;
        tag2: string;
    }

    export interface HadithBlocks
    {
        id: number;
        Refrences: Refrence[];
        content: Value[];
        sources: Value[];
        src: number;
        number?:number;
    }
}

export interface HadithJson{
  "?xml": {
    "@version": string,
    "@encoding": string
  }
  hadithCollection:HadithCollection
}
export interface HadithCollection{
  code : string,
  name : string,
  copyright : string,
  referenceDefinitions:{
    referenceDefinition:referenceDefinition[]
  },
  hadiths?:hadithJson[]
}
export interface referenceDefinition{
  isPrimary : string,
  code : string,
  name : string,
  valuePrefix : string,
  parts: {
    part: any
  }
}
export interface hadithJson{
  references:{reference:refrencehadithJson},
  hadith: Hadith[];

}
export interface refrencehadithJson{
  
    code: string,
    suffix: string,
    parts: {
    part: any
    }
  
}

export interface VerseReferences2 {
  chapter: string;
  firstVerse: string;
  lastVerse: string;
}

export interface VerseReferences {
  reference: VerseReferences2[];
}
export interface Hadith {
  arabic: {text: string[] };
  english: { text: string[] };
  verseReferences?: VerseReferences;
}


export module quran {

  export interface Edition {
      identifier: string;
      language: string;
      name: string;
      englishName: string;
      format: string;
      type: string;
  }

  export interface Surah {
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
      numberOfAyahs: number;
      revelationType: string;
  }

  export interface Data {
      number: number;
      text: string;
      edition: Edition;
      surah: Surah;
      numberInSurah: number;
      juz: number;
      manzil: number;
      page: number;
      ruku: number;
      hizbQuarter: number;
      sajda: boolean;
  }

  export interface quranResponse {
      code: number;
      status: string;
      data: Data;
  }

}







