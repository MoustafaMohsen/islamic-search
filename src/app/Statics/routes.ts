import { Routes } from '@angular/router'; 
import { TopbarComponent } from '../Components/topbar/topbar.component';
import { PdfViewerComponent } from "../Components/pdf-viewer/pdf-viewer.component";

export const routes:Routes =[
    {path:'' , component:TopbarComponent },
    {path:'pdfview' , component:PdfViewerComponent },
    {path:':source' , component:TopbarComponent },
    {path:':source/:par1' , component:TopbarComponent },
    {path:':source/:par1/:par2' , component:TopbarComponent },
    {path:':source/:par1/:par2/:par3' , component:TopbarComponent },
    {path:'**' , redirectTo:'', pathMatch:'full'}
];