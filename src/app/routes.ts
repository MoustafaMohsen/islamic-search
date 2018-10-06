import { Routes } from '@angular/router'; 
import { TopbarComponent } from './topbar/topbar.component';
import { HadithBoxComponent } from './hadith-box/hadith-box.component';

export const routes:Routes =[
    {path:'' , component:TopbarComponent },
    {path:':source' , component:TopbarComponent },
    {path:':source/:par1' , component:TopbarComponent },
    {path:':source/:par1/:par2' , component:TopbarComponent },
    {path:':source/:par1/:par2/:par3' , component:TopbarComponent },
    {path:'**' , redirectTo:'', pathMatch:'full'}
];