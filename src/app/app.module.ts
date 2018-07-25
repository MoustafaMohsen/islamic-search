import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SafePipe } from './safe.pipe';
import { TopbarComponent } from './topbar/topbar.component';
import { RouterModule,Routes } from '@angular/router'; 

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCheckboxModule,MatButtonToggleModule,MatSliderModule,
  MatCardModule,MatProgressBarModule,MatToolbarModule,MatAutocompleteModule
  ,MatSlideToggleModule,MatSnackBarModule,MatDividerModule,MatProgressSpinnerModule
  ,MatIconModule
} from '@angular/material';
import { MatInputModule } from "@angular/material/input";
import {MatFormFieldModule} from '@angular/material/form-field';
import { HadithBoxComponent } from './hadith-box/hadith-box.component';
import {MatSelectModule} from '@angular/material/select';
import { NumberArrayPipe } from './number-array.pipe';
import { AddressArrayPipe } from './address-array.pipe';


export const appRoutes:Routes =[
    {path:'s' , component:AppComponent}
];
const material=[
  BrowserAnimationsModule,
  MatButtonModule, MatCheckboxModule,MatButtonToggleModule,
  MatSliderModule,MatCardModule,MatProgressBarModule,MatToolbarModule,MatAutocompleteModule,
  MatFormFieldModule,MatSlideToggleModule,MatSnackBarModule,MatDividerModule,MatProgressSpinnerModule,
  MatInputModule,MatIconModule
]

@NgModule({
  declarations: [
    AppComponent,
    SafePipe,
    TopbarComponent,
    HadithBoxComponent,
    NumberArrayPipe,
    AddressArrayPipe
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MatSelectModule,
    HttpClientModule,
    FormsModule,
    //material
    material
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
