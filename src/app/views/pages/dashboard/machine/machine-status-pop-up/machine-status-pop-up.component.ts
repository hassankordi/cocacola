import { Component, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexStroke,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  markers: ApexMarkers;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'machine-status-pop-up',
  templateUrl: './machine-status-pop-up.component.html',
})

export class MachineStatusPopUp {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public yaxis: ApexYAxis;
  public xaxis: ApexXAxis;

  constructor(@Inject(MAT_DIALOG_DATA) public myData: any ) {
   
    let arr =[]
    // replate (T) in the date and push data to array
     myData.forEach(element => {
      arr.push([ element.timestamp.replace("T" , " ")  ,element.state ])
    });

    console.log(arr);
    
    this.chartOptions = {
      series: [
        {
          name: "state",
          data:arr
        }
      ],
      chart: {
        type: "line",
        height: 350,
        
      },
      stroke: {
        curve: "stepline"
      },
      dataLabels: {
        enabled: false
      },
      title: {
        text: "STATUS",
        align: "left"
      },
      markers: {
        hover: {
          sizeOffset: 4
        }
      }
    };
    this.yaxis = {
      labels: {
        formatter: function (val) {
          return (val ).toFixed(0);
        }
      },
      title: {
        text: "Status"
      }
    };

    this.xaxis = {
      type: "datetime" , 
      labels: {
        show:true ,

        
      },
     
    };
  }



}