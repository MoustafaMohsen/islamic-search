import { Routes } from '@angular/router'; 
import { TopbarComponent } from '../Components/topbar/topbar.component';
import { PdfViewerComponent } from "../Components/pdf-viewer/pdf-viewer.component";
import { ContainerComponent } from '../Components/boot/container/container.component';

export const routes:Routes =[
    {path:'' , component:ContainerComponent },
    {path:'pdfview' , component:PdfViewerComponent },
    {path:':source' , component:ContainerComponent },
    {path:':source/:par1' , component:ContainerComponent },
    {path:':source/:par1/:par2' , component:ContainerComponent },
    {path:':source/:par1/:par2/:par3' , component:ContainerComponent },
    {path:'**' , redirectTo:'', pathMatch:'full'}
];