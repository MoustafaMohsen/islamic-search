import { Routes } from '@angular/router'; 
import { TopbarComponent } from './topbar/topbar.component';
import { HadithBoxComponent } from './hadith-box/hadith-box.component';

export const routes:Routes =[
    {path:'' , component:TopbarComponent },
    {path:'**' , redirectTo:'', pathMatch:'full'}
];