import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import * as _ from 'lodash';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
selected: any = 'Config_0';
  configSelectedData: any;
  
  isloading:boolean = false;
  isInput:boolean = true;
  feedsData: any;
  allRegions: any = [];
  allCities: any = [];
  selectedCitiyYears: any =[];
  data1: any = [];
  apiData :any
  globalCapacity:any;
  comp_limit:any;
  alteredData:any = [];
  keysOf:any = [];
  valuesOf:any;
  selectedYear:any = 2015;
  selectedCity:any = "Altona";
  selectedRegion:any = "ANZ";

  constructor(private dataService : DataService,private router : Router) { }
  
  ngOnInit(): void {
    this.isloading = true;

    this.dataService.getFeedsData().subscribe((data: any)=>{
      this.feedsData = data.data;
    }) 


    this.dataService.getGlobalCapacity().subscribe((data: any)=>{
      this.apiData = data;
      this.globalCapacity = data.global_cap;
      if(this.globalCapacity.length>0){this.isloading = false}
      this.globalCapacity.forEach((element: any) => {element.index  = element.Configuration.split("_")[1];})
      this.globalCapacity.sort((a: any, b: any) => a.index - b.index);
      this.generateDataForScrollbutton();
    })
  }

  generateDataForScrollbutton(){
    this.comp_limit =  this.apiData.comp_limit;
    let global_comp = this.apiData.global_comp;
     this.comp_limit.forEach((element: any) => {
      global_comp.forEach((element1: any) => {
        if(element1.Configuration == element.Configuration && element1.Feed == element.Feed){
          element.averageValue = element1.Composition
        }
      });
    });    

    this.globalCapacity.forEach((element: any) => {element.index  = element['Configuration'].split("_")[1];})
    let data2 = this.globalCapacity.sort((a: any, b: any) => a.index - b.index);
    data2.forEach((element: any) => {this.keysOf.push(element.Configuration);})
    this.alteredData = _.groupBy(this.comp_limit,(i:any) => i.Configuration )
    this.valuesOf =  Object.values(this.alteredData);
    this.configSelectedData = this.alteredData['Config_0'];
  }

  selectConfig(){
    this.configSelectedData = this.alteredData[this.selected];  
  }


  show_value(x:any)
{
 let data = document.getElementById("slider_value");
  data!.innerHTML = x;
}

  exercise2w(){
    this.router.navigate(['/exercise2']);
  }

  switchToInput(){
    this.isInput = true
  }
  switchToOutput(){
    this.isInput = false
  }

  



}
