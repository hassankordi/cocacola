import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
// import {
//   ApexAxisChartSeries,
//   ApexChart,
//   ApexTitleSubtitle,
//   ApexDataLabels,
//   ApexFill,
//   ApexMarkers,
//   ApexYAxis,
//   ApexXAxis,
//   ApexTooltip
// } from "ng-apexcharts";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend
} from "ng-apexcharts";



export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};
import { CurrentActivityService } from 'src/app/Services/current-activity.service';
import { SignalRService } from 'src/app/signal-r.service';
import { DashboardService } from '../dashboard.service';
import { dataSeries } from "./data-series";

@Component({
  selector: 'app-machine-tag-explore',
  templateUrl: './machine-tag-explore.component.html',
  styleUrls: ['./machine-tag-explore.component.scss']
})
export class MachineTagExploreComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;


  emptyArray: any = false;


  tagsData: any = []
  mySeries: any = []

  tags: any = []
  activeTag = {
    displayName: "any",
    columnName: "any",
  }



  tagTableName: any;
  tableDate: any = [];
  tableTagData: any = [];


  location: any;
  allLines: any;
  allMachines: any;

  selectedLocation = "Alex";
  factoryId: any = 1;
  selectedLine = null;
  selectedMachine = null;
  startDate = null;
  endDate = null;
  selectedLineNumber: any = null



  openMachineSelect = false
  openDuration = false
  displayData = false

  showChart: boolean = false

  formVal;





  openDialogBtn: boolean = false;
  lineName: any
  machineindicator: any = {
    oee: 0,
    avalability: 0,
    productionOutput: 0,
    expected: 0
  };
  machineID: any = "machine Name"
  machineCurrentState: any;
  machineCurrentStatus: any;
  machineTimeLine: any;
  machineAvailabilityBottle: any = 0;



  constructor(
    public _CurrentActivityService: CurrentActivityService,
    private dashboardService: DashboardService,
    public signalRService: SignalRService,
    private datePipe: DatePipe) {

    this.chartOptions = {
      series: [
        {
          name: "",
          data: []
        }

      ],
      chart: {
        height: 350,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      colors: ["#77B6EA", "#545454"],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: "Machine Tag Graph",
        align: "left"
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      markers: {
        size: 1
      },
      xaxis: {

        categories: [],
        type: "datetime"

      },
      yaxis: {
        title: {
          text: "Tag"
        },

      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };
  }



  ngOnInit() {

    //Factories
    this.dashboardService.getFactories().subscribe((res) => {
      this.location = res;
      console.log("kk", res);
      this.dashboardService
        .getLinesFactories(this.location[0].id)
        .subscribe((res) => {
          console.log("j", res);
          this.allLines = res;


        });
    });
  }

  filter(event) {
    this.displayData = false
    let data = {
      machineId: this.selectedMachine,
      factory: Number(this.factoryId),
      line: Number(this.selectedLineNumber),
      start: this.startDate,
      end: this.endDate,
    }
    console.log(data);

    // get properties name like => speed , cout ..ect 
    this.dashboardService.getMachineTagProperties(this.selectedMachine).subscribe((res: any) => {
      // feh properties
     if(res.length != 0){
      console.log(res);
      this.emptyArray = false
      this.displayData = true
      this.activeTag = res[0]
      res.shift()
      this.tags = res;
     }
     else{
      this.emptyArray = true
      this.displayData = false

     }
     
    })

    // get machine tag data (speed data) ..ect 
    this.dashboardService.getMachineTag(data).subscribe((res: any) => {

      console.log(res);
      this.tagsData = [];
      this.mySeries = [];
      this.tableDate=[];
      this.tableTagData = []
      
      // feh data
      if (res.length != 0) {
        this.emptyArray = false
        this.displayData = true
        this.tagTableName = this.activeTag.displayName
        this.tagsData = res;
        res.forEach((elem) => {
        
          
          this.mySeries.push([elem.timeStamp.replace("T", " "), Number(elem[this.activeTag.columnName].toFixed(0))])
          this.tableDate.push(elem.timeStamp.replace("T", " "))
          this.tableTagData.push(Number(elem[this.activeTag.columnName].toFixed(0)))
        })
        this.showChart = true;
        this.chartOptions.series = [
          {
            name: this.activeTag.displayName,
            data: this.mySeries
          }
        ]
        this.chartOptions.yaxis = {
          title: {
            text: this.activeTag.displayName,
          }
        }
        console.log(this.chartOptions.series[0].data);
      }
      // mfe4 data (empty array)
      else {
        this.showChart = false;
        this.emptyArray = true;
        this.displayData = false

        this.tagTableName = ""
        this.tagsData = [];
        this.activeTag = {
          displayName: "any",
          columnName: "any",
        }

      }
     
    })


  }


  // tag = data 
  // e = button element 
  // filter tag reads view 
  filterTagReads(tag, e) {
    this.showChart = false;
    this.mySeries = []
    this.tableDate = []
    this.tableTagData = []
 
    console.log(tag, e);
    this.tagTableName = tag.displayName
    this.tagsData.forEach((elem) => {
      this.mySeries.push([elem.timeStamp.replace("T", " "), Number(elem[tag.columnName].toFixed(0))])


      this.tableDate.push(elem.timeStamp.replace("T", " "))
      this.tableTagData.push(Number(elem[tag.columnName].toFixed(0)))
    })

    console.log(this.mySeries);
    this.chartOptions.series = [
      {
        name: tag.displayName,
        data: this.mySeries
      }
    ]
    this.chartOptions.yaxis = {
      title: {
        text: tag.displayName,
      }
    }
    this.showChart = true;


    let links = document.getElementsByClassName('tag-btn');
    console.log(links);

    for (let i = 0; i < links.length; i++) {
      links[i].classList.remove('activeLink')
      console.log(i);
    }
    let elem = e.target
    elem.classList.add('activeLink')


  }


  // pick a date 
  durationStatus(event) {
    console.log(event);
    // check if start date or end date is null
    if (event.value[0] == null || event.value[1] == null) {
      this.openDialogBtn = false
    }
    else {
      this.startDate = event.value[0]
      this.endDate = event.value[1]
      this.startDate = this.datePipe.transform(this.startDate, "yyyy-MM-dd h:mm:ss")
      this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd h:mm:ss")
      this.openDialogBtn = true
      console.log(this.startDate, this.endDate);

    }


  }

  selectLocation(elem) {
    this.selectedLine = null;
    this.allLines = [];
    this.allMachines = [];
    this.openMachineSelect = false
    this.openDuration = false

    this.factoryId = elem.id
    this.dashboardService.getLinesFactories(elem.id).subscribe((res) => {
      console.log("jjjj", res);
      this.allLines = res;
    }, (err) => {
      console.log(err);

    });
  }

  selectLine(elem) {
    console.log(elem);

    console.log(elem);
    // this.selectedLine = elem.lineNum
    this.selectedLineNumber = elem.lineNum
    this.openMachineSelect = true

    this.dashboardService.getMachinePlan(elem.id).subscribe((res) => {
      console.log(res);
      this.allMachines = res

    }, (err) => {
      console.log(err);

    })
  }
  selectMachine() {
    console.log(this.selectedMachine);
    if (this.selectedMachine == null) {
      this.openDuration = false
    }
    else {
      this.openDuration = true
    }

  }


}
