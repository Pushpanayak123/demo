import { Component, OnInit, Input } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { DataService } from 'src/app/data.service';
import { math } from '@amcharts/amcharts5';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

 
root:any;
yAxis:any;
xAxis:any;
data:any;
chart:any;
chartValues:any =[];
actualData:any;
requriedData:any;
  feedsData: any  = [];
  allRegions: any =[];
  data1: any = [];
  allCities: any = [];
  selectedCitiyYears: any = [];
  selectedYear:any = 2005;
  selectedCity:any = "Altona";
  selectedRegion:any = "ANZ";
  chartRegister: any = [];
constructor(private dataService : DataService){}


  ngOnInit():void {  
    this.startCallingFunc();
}

async startCallingFunc(){
  await this.dataService.getFeedsData().subscribe((data: any)=>{
    this.feedsData = data.data;
    this.feedDataFunction();
    this.getChartDataFromApi(this.selectedRegion,this.selectedCity,this.selectedYear);
  }) 
}

async getChartDataFromApi(region:any,city:any,year:any){
    await this.dataService.getCountryCapacity(region,city,year).subscribe((data: any)=>{
    this.actualData = data.data[0];
    this.chartValues = [];
     Object.keys(this.actualData).forEach((key: any) => {
       if((key !== "CAP") && (key !== "City") && (key !== "Region") && (key !== "Year")){
         this.chartValues.push({index: key, value: this.actualData[key]})
       }
     })
     this.prepareChart1();
 });
}

prepareChart1(){
  if(this.chartRegister["chartdiv"]){this.chartRegister["chartdiv"].dispose()}
  let root = am5.Root.new("chartdiv");
  root.interfaceColors.set("grid", am5.color(0xffffff));
  root._logo?.dispose();
  // Set themes
  root.setThemes([
    am5themes_Animated.new(root)
  ]);


  // Create chart
  let chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: true,
    panY: true,
    wheelX: "none",
    wheelY: "none",
    pinchZoomX: true
  }));

  chart.children.unshift(am5.Label.new(root, {
    text: `In ${this.actualData.Region}, the maximum capacity of ${this.actualData.City} in the ${this.actualData.Year} was ${math.round(this.actualData.CAP)} kb.`,
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    x: am5.percent(50),
    centerX: am5.percent(50),
    fill: am5.color(0x979ec1),
    paddingTop: 0,
    paddingBottom: 0
  }));


  // Add cursor
  let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
  cursor.lineY.set("visible", false);


  // Create axes
  let xRenderer = am5xy.AxisRendererX.new(root, {
    minGridDistance: 10,
  });

  xRenderer.labels.template.setAll({
    centerY: am5.p0,
    fill: am5.color(0x979ec1),
    fontSize: 12,
    centerX: 0,
    location: 0.3,
    paddingBottom: 20,
  });

  xRenderer.grid.template.setAll({
    visible: false
  });

  let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    maxDeviation: 0.3,
    categoryField: "index",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
  }));

  var label = am5.Label.new(root, {
    text: "Feeds",
    y: am5.p100,
    centerX: am5.p0,
    x: am5.p50,
    centerY: am5.p50,
    fill: am5.color(0x979ec1),
    fontSize: 15
  })
  xAxis.children.unshift(
    label
  );

  let yRenderer = am5xy.AxisRendererY.new(root, {})
    yRenderer.labels.template.setAll({
      fill: am5.color(0x979ec1),
      fontSize: 12,
    })

  let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    maxDeviation: 0.3,
    renderer: yRenderer
    }));

    var label = am5.Label.new(root, {
      rotation: -90,
      text: "Capacity\nThousand Barrels per day(kb/d)",
      textAlign: "center",
      y: am5.p50,
      centerX: am5.p50,
      x: am5.p0,
      centerY: am5.p0,
      fill: am5.color(0x979ec1),
      fontSize: 15
    })
    yAxis.children.unshift(
      label
    );


  // Create series
  let series = chart.series.push(am5xy.ColumnSeries.new(root, {
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value",
    categoryXField: "index",
    fill: am5.color(0x9586ff),
    adjustBulletPosition: false,
    tooltip: am5.Tooltip.new(root, {
      labelText: " Capacity : {valueY}"
    })
  }));
  series.columns.template.setAll({
    width: 50,
    cornerRadiusTL: 5,
    cornerRadiusTR: 5
  });

  series.columns.template.setAll({
    strokeOpacity: 0,
    shadowColor: am5.color(0x000000),
    shadowBlur: 10,
    shadowOffsetX: 4,
    shadowOffsetY: 4
  });

  let data = this.chartValues;

  xAxis.data.setAll(data);
  series.data.setAll(data);


  // Make stuff animate on load
  series.appear(1000);
  chart.appear(1000, 100);

  this.chartRegister["chartdiv"]=root
  }

  feedDataFunction(){
    // to get all the regions this.allRregions
    this.feedsData.forEach((element: any) => {this.allRegions.push(element.region);});

    let selectedData = this.feedsData.filter((i:any) => i.region == this.selectedRegion);
    let data = Object.values(selectedData[0]);
    this.data1 = data[0];

    // get all the cities of selected region
    this.data1.forEach((element: any) => {this.allCities.push(element.city);});
    let selectedFilter = this.data1.filter((i:any) => i.city == this.selectedCity);
    this.selectedCitiyYears = selectedFilter[0].years;
    
  }


  onChangeRegion(ele:any){
    this.selectedRegion = ele.target.value;
    let selectedData = this.feedsData.filter((i:any) => i.region == ele.target.value);
    let data = Object.values(selectedData[0]);
    this.data1 = data[0];
    this.allCities = [];
    this.data1.forEach((element: any) => {this.allCities.push(element.city);});
    this.selectedCity = this.allCities[0];
    let selectedFilter = this.data1.filter((i:any) => i.city == this.selectedCity);
    this.selectedCitiyYears = selectedFilter[0].years
    this.selectedYear = this.selectedCitiyYears[0];
    this.getChartDataFromApi(this.selectedRegion,this.selectedCity,this.selectedYear);
  }

  onChangeCity(ele:any){
    this.selectedCity = ele.target.value;
    let selectedFilter = this.data1.filter((i:any) => i.city == ele.target.value);
    this.selectedCitiyYears = selectedFilter[0].years
    this.selectedYear = this.selectedCitiyYears[0]; 
    this.getChartDataFromApi(this.selectedRegion,this.selectedCity,this.selectedYear);
  }

  async onChangeYear(ele:any){
    this.selectedYear = ele.target.value;
    this.getChartDataFromApi(this.selectedRegion,this.selectedCity,this.selectedYear);  
  }

}