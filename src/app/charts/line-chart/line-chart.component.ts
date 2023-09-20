import { Component, OnInit, Input } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { DataService } from 'src/app/data.service';
import { fill } from 'lodash';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

root:any;
yAxis:any;
xAxis:any;
data:any;
chart:any;
chartValues:any =[];
chartlabel:any =[];
sortedData:any =[];
chartRegister: any= {};
constructor(private dataService : DataService){}

async ngOnInit() {
  this.dataService.getGlobalCapacity().subscribe((data: any)=>{
    this.chartValues = data.global_cap;
    this.chartValues.forEach((element: any) => {element.index  = element['Configuration'].split("_")[1];})
    this.chartValues.sort((a: any, b: any) => a.index - b.index);
    this.prepareChart2();
  })
}

prepareChart2(){
  var root = am5.Root.new("chartdiv1");
  root.interfaceColors.set("grid", am5.color(0xffffff));
  root.setThemes([
    am5themes_Animated.new(root)
  ]);
  root._logo?.dispose();

  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: false,
      wheelX: "none",
      wheelY: "none",
      layout: root.verticalLayout,
    })
  );
  
  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
    behavior: "none"
  }));
  cursor.lineY.set("visible", false);
  
  let data = this.chartValues;;
  
  var xRenderer = am5xy.AxisRendererX.new(root, {});
  xRenderer.grid.template.set("location", 0.5);
  xRenderer.labels.template.setAll({
    location: 0.5,
    multiLocation: 0.5,
    fill: am5.color(0x979ec1),
    fontSize: 10,
  });
  
  var xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "Configuration",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {
      })
    })
  );
  
  xAxis.get("renderer").labels.template.setAll({
    fill: root.interfaceColors.set("secondaryButton", am5.color(0x717693)),
    fillOpacity: 1
  });
  xAxis.get("renderer").labels.template.setAll({
    fill: root.interfaceColors.set("secondaryButtonHover", am5.color(0x717693)),
    fillOpacity: 1
  });

  xAxis.data.setAll(data);
  
  var yRenderer = am5xy.AxisRendererY.new(root, {
    inversed: false,
  });
  yRenderer.labels.template.setAll({
    fill: am5.color(0x979ec1),
    fontSize: 10,
  })
  
  var yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      maxPrecision: 0,
      renderer: yRenderer
    })
    
  );
  
  function createSeries(name:any, field:any) {
    var series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: field,
        categoryXField: "Configuration",
        fill: am5.color(0x42a9d8),
        stroke: am5.color(0x42a9d8),
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "[bold]{name}[/]\n{categoryX}: {valueY}"
        }),
        legendLabelText: "[bold {stroke}]{name}[/]"
      })
    );

    series.set("setStateOnChildren", true);
    series.states.create("hover", {});
  
    series.mainContainer.set("setStateOnChildren", true);
    series.mainContainer.states.create("hover", {});
  
    series.strokes.template.states.create("hover", {
      strokeWidth: 4
    });
    series.strokes.template.setAll({
      strokeWidth: 2,
      shadowColor: am5.color(0x42a9d8),
      shadowBlur: 40,
      shadowOffsetX: 0,
      shadowOffsetY: 100,
      shadowOpacity: 1,
    });
    series.data.setAll(data);
    series.appear(1000);
  }
  
  createSeries("Capacity", "CAP");
  
  var yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      x: am5.percent(100),
      centerX: am5.percent(100),
      renderer: am5xy.AxisRendererY.new(root, {}),
    })
  );
  
  var label = am5.Label.new(root, {
    rotation: -90,
    text: "Thousand Barrels per day(kb/d)",
    y: am5.p50,
    centerX: am5.p50,
    x: am5.p0,
    centerY: am5.p0,
    fill: am5.color(0x979ec1),
    fontSize: 10
  })
  yAxis.children.unshift(
    label
  );
  
  var scrollbarX = am5.Scrollbar.new(root, {
    orientation: "horizontal"
  });

  chart.set("scrollbarX", scrollbarX);

  scrollbarX.thumb.setAll({
    fill: am5.color(0x717693),
    fillOpacity: 1
  });
  

  chart.bottomAxesContainer.children.push(scrollbarX);

  
  var legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50,
      legendLabelText: "[{stroke}]{name}[/]: [bold #979ec1]{categoryX}[/]"
    })
  );
  
  legend.itemContainers.template.states.create("hover", {});
  
  legend.data.setAll(chart.series.values);
  
  chart.appear(1000, 100);
  }


}
