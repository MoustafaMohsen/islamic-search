import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.css']
})
export class SourceComponent implements OnInit {

  //BASEURL
  @Input() BASEURL

  constructor() {

  }

  ngOnInit() {
  }

}
