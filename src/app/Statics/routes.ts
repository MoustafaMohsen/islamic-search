import { Routes } from '@angular/router'; 
import { ContainerComponent } from '../Components/boot/container/container.component';
import { InputsComponent } from '../Components/inputs/inputs.component';

export const routes:Routes =[
    {path:'' , component:ContainerComponent },
    {path:':source' , component:ContainerComponent },
    {path:':source/:par1' , component:ContainerComponent },
    {path:':source/:par1/:par2' , component:ContainerComponent },
    {path:':source/:par1/:par2/:par3' , component:ContainerComponent },
    {path:'**' , redirectTo:'', pathMatch:'full'}
];