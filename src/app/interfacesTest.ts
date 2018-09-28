//Hadith interface for 1 hadith sample
declare module namespace1 {

    export interface Reference {
        code: string;
        suffix: string;
        parts: {
            part: any;};
    }
  
    export interface References {
        reference: Reference[];
    }
  
    export interface Arabic {
        text: string[];
    }
  
    export interface English {
        text: string[];
    }
  
    export interface RootObject {
        references: References;
        arabic: Arabic;
        english: English;
        verseReferences?: any;
    }
  
  }
  
  
  
  //Interface 2 for 50 hadith sample on muslim.json
  export declare module namespace2 {
    export interface Reference {
       code: string;
       suffix: string;
       parts: {
           part: string[];//arrayfiy
       };
   }
   export interface reference2 {
        chapter: string;
        firstVerse: string;
        lastVerse: string;
      
   }
   export interface Hadith {
       references: {
           reference: Reference[];};

       arabic: {
           text: string[];};//arrayfiy

        english: {
            text: string[];};//arrayfiy

        verseReferences: {
            reference: reference2[];};
    }
  
  }


export declare module namespace {

    export interface Parts {
        part: string[];
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


    export interface HadithCollection {
        code: string;
        name: string;
        copyright: string;
        referenceDefinitions: ReferenceDefinitions;
        hadiths: namespace2.Hadith;
    }

    export interface JSONBOOK {
        hadithCollection: HadithCollection;
    }

}



//Interface 3
export declare module namespace3 {
    export interface Reference {
       code: string;
       suffix: string;
       parts: [{astring:string}];
   }
   export interface reference2 {
        chapter: string;
        firstVerse: string;
        lastVerse: string;
      
   }
   export interface Hadith {

        references: Reference[];

        arabic: [{astring:string}];//arrayfiy

        english: [{astring:string}];//arrayfiy

        verseReferences: reference2[];

        src: number;
    }
  
  }



