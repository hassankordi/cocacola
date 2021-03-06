import { DatePipe, formatDate } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { TooltipPosition } from "@angular/material/tooltip";
import { NgbCalendar, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { ChartComponent } from "@syncfusion/ej2-angular-charts";
import {
  ApexAnnotations,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexPlotOptions,
  ApexResponsive,
  ApexStates,
  ApexStroke,
  ApexTheme,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from "ng-apexcharts";
import { Subscription } from "rxjs";
import { ApiService } from "src/app/APIsServices/api.service";
import { CurrentActivityService } from "src/app/Services/current-activity.service";
import { DashboardFilter } from "src/app/Shared/models/DashboardFilter";
import { SignalRService } from "src/app/signal-r.service";
// import { ChartOptions } from '../dashboard.component';
import { DashboardService } from "../dashboard.service";

export type ChartOptions = {
  chart: ApexChart;
  annotations: ApexAnnotations;
  colors: string[];
  dataLabels: ApexDataLabels;
  series: ApexAxisChartSeries;
  stroke: ApexStroke;
  labels: string[];
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  states: ApexStates;
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  theme: ApexTheme;
};
@Component({
  selector: "app-machine-indecator",
  templateUrl: "./machine-indecator.component.html",
  styleUrls: ["./machine-indecator.component.scss"],
})
export class MachineIndecatorComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  positionOptions: TooltipPosition[] = ["above"];
  position = new FormControl(this.positionOptions[0]);
  public line1Timeline: Partial<ChartOptions>;
  dashboardFilter: DashboardFilter = new DashboardFilter();

 
  line1Data = {
    name: "Line 1",
    data: [],
  };

  hassanArrayTest = [];

  line1Null = null;

  

  location: any;
  allLines: any;
  allMachines: any;

  // this array holds al machines data
  allMachinesIndicatorData: any = [];

  // load animation
  showGifImg: any = false;

  selectedLocation = "";
  factoryId: any = 1;
  selectedLine = null;
  selectedMachine = null;
  startDate = null;
  endDate = null;
  selectedLineNumber: any = null;
  plantName: any;

  openMachineSelect = false;
  openDuration = false;
  displayData = false;

  formVal;
  sub1$: Subscription;
  sub2$: Subscription;

  machineIdName;

  openDialogBtn: boolean = false;

  // this variable for =>  if ouda sent me an empty array with out any properties
  emptyArray: boolean = false;

  lineName: any;

  machineindicator: any = {
    oee: 0,
    avalability: 0,
    productionOutput: 0,
    expected: 0,
  };
  machineID: any = null;
  machineCurrentState: any;
  machineCurrentStatus: any;
  machineTimeLine: any;
  machineAvailabilityBottle: any = 0;

  // end
  //constructor
  constructor(
    public _CurrentActivityService: CurrentActivityService,
    private dashboardService: DashboardService,
    public signalRService: SignalRService,
    private datePipe: DatePipe
  ) {
    // start
    this.line1Timeline = {
      series: [],
      chart: {
        height: 100,
        type: "rangeBar",
        toolbar: {
          show: false,
        },
      },

      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
          dataLabels: {
            hideOverflowingLabels: true,
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeUTC: false,
          format: "HH:mm",
          style: {
            colors: [],
            fontSize: "12px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 800,
            cssClass: "apexcharts-xaxis-label",
          },
        },
      },
      yaxis: {
        show: false,
      },

      grid: {
        show: false,
        row: {
          colors: ["#f3f4f5", "#fff"],
          opacity: 0,
        },
      },
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          return (
            '<div class="arrow_box p-2">' +
            "<span>" +
            // w.globals.initialSeries[seriesIndex].data[dataPointIndex].state
            // +'<br>'+
            formatDate(
              new Date(
                w.globals.initialSeries[seriesIndex].data[dataPointIndex].y[0]
              ),
              "hh:mm a",
              "en"
            ) +
            " - " +
            formatDate(
              new Date(
                w.globals.initialSeries[seriesIndex].data[dataPointIndex].y[1]
              ),
              "hh:mm a",
              "en"
            ) +
            "</span>" +
            "</div>"
          );
        },
      },
    };
    // end
  }
  ngOnDestroy(): void {}
  ngAfterViewInit(): void {}
  ngOnInit(): void {
    this.plantName = "Alex";
    this.dashboardService.pageName.next('Machine Indicators')

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

  // select duraciton 
  durationStatus(event) {
    console.log(event);
    // check if start date or end date is null
    if (event.value[0] == null || event.value[1] == null) {
      this.openDialogBtn = false;
    } else {
      this.startDate = event.value[0];
      this.endDate = event.value[1];
      this.startDate = this.datePipe.transform(
        this.startDate,
        "yyyy-MM-dd h:mm:ss"
      );
      this.endDate = this.datePipe.transform(
        this.endDate,
        "yyyy-MM-dd h:mm:ss"
      );
      this.openDialogBtn = true;

      console.log(this.startDate, this.endDate);
    }
  }

  selectLocation(elem) {
    this.plantName = elem.name;
    this.selectedLine = null;
    this.allLines = [];
    this.allMachines = [];
    this.openMachineSelect = false;
    this.openDuration = false;

    this.factoryId = elem.id;
   

    // get lines after select factory 
    this.dashboardService.getLinesFactories(elem.id).subscribe(
      (res) => {
        console.log("jjjj", res);
        this.allLines = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  selectLine(elem) {
    console.log(elem);
    this.dashboardFilter.LineID = elem.id;
    console.log(elem);
    // this.selectedLine = elem.lineNum
    this.selectedLineNumber = elem.lineNum;
    this.openMachineSelect = true;

    // get machines after select line 
    this.dashboardService.getMachinePlan(elem.id).subscribe(
      (res) => {
        console.log(res);
        this.allMachines = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  selectMachine() {
    console.log(this.selectedMachine);
    if (this.selectedMachine == null) {
      this.openDuration = false;
    } else {
      this.openDuration = true;
    }
  }

  // this function has no invoke !! 
  // fromDate(event) {
  //   let date = new Date(event.value);
  //   let modifiedTime = date.toISOString();
  //   // this.date1 = modifiedTime.replace('22:00:00.000Z' , "").concat("00:00:00.000Z");
  //   // this.dashboardFilter.startDate = this.date1
  //   console.log(this.dashboardFilter);
  // }

  filter(event) {
    // logic after click 
    this.showGifImg = true;
    this.displayData = false;
    this.emptyArray = false;


    this.line1Timeline.series = [];
    this.hassanArrayTest = [];

    this.machineindicator = {};
    this.machineCurrentState = 0;
    this.machineCurrentStatus = "offline";
    this.machineAvailabilityBottle = 0;

  //  this (data) for send it to machine indicator 
    let data = {
      machineId: this.selectedMachine,
      factory: this.plantName,
      line: Number(this.selectedLineNumber),
      start: this.startDate,
      end: this.endDate,
    };
    console.log(data);

    this.dashboardService.getMachineIndIndicator(data).subscribe(
      (res: any) => {
        this.showGifImg = false;

        console.log("heeeeeey", res);

        console.log(res);
        this.allMachinesIndicatorData = [];
        res.forEach((elem) => {
          console.log(elem);
          this.allMachinesIndicatorData.push(...elem.machineindicator);
        });
        console.log("hasldhsaflksahf", this.allMachinesIndicatorData);

        //  this line is important for ngif (34an el span aly masek el current status )
        this.machineID = res[0]?.machine;
        console.log(res[0]?.machine);

        if (this.allMachinesIndicatorData.length) {
          this.emptyArray = false;
          this.displayData = true;

          this.machineindicator = res[0].machineindicator[0];
          this.machineCurrentState = res[0].state;
          this.machineCurrentStatus = res[0].status;
          this.machineTimeLine = res[0].machinetimeline;

          console.log(this.machineTimeLine);
          //  this.line1Null =  res[0].machinetimeline
          console.log("yup", this.line1Null);
          let allMachinesTimeLineData = [];
          this.allMachinesIndicatorData.forEach((element) => {
            // every element is a single machine
            console.log("222222222", element.machinetimeline);
            allMachinesTimeLineData.push(element.machinetimeline);
          });

          this.line1Null = allMachinesTimeLineData;
          this.line1Null?.forEach((machineTimeLineArray) => {
            // machineTimeLineArray is a array of time line for a single machine
            console.log(machineTimeLineArray);

            let singleMachineObj = {
              name: "ha",
              data: [],
            };
            console.log(machineTimeLineArray);

            // after for loop ended i have data for one machine
            for (let i = 0; i < machineTimeLineArray.length; i++) {
              // i = object of array l single machine

              if (machineTimeLineArray[i].state == "Offline") {
                let obj = {
                  x: "Time",
                  y: [
                    new Date(machineTimeLineArray[i].stateStartTime).getTime(),
                    new Date(machineTimeLineArray[i].stateEndTime).getTime(),
                  ],
                  fillColor: "#e22517",
                };
                this.line1Data.data.push(obj);
                singleMachineObj.data.push(obj);
                // this.hassanArrayTest[i].data.push(obj);
              } else if (machineTimeLineArray[i].state == "Waiting") {
                let obj = {
                  x: "Time",
                  y: [
                    new Date(machineTimeLineArray[i].stateStartTime).getTime(),
                    new Date(machineTimeLineArray[i].stateEndTime).getTime(),
                  ],
                  fillColor: "#dadada",
                };
                this.line1Data.data.push(obj);
                // this.hassanArrayTest[i].data.push(obj);
                // console.log(this.line1Data);
                singleMachineObj.data.push(obj);
              } else if (machineTimeLineArray[i].state == "Online") {
                let obj = {
                  x: "Time",
                  y: [
                    new Date(machineTimeLineArray[i].stateStartTime).getTime(),
                    new Date(machineTimeLineArray[i].stateEndTime).getTime(),
                  ],
                  fillColor: "#29a32c",
                };
                this.line1Data.data.push(obj);
                // this.hassanArrayTest[i].data.push(obj);
                singleMachineObj.data.push(obj);
              } else if (
                machineTimeLineArray[i].state == "Cleaning in Process"
              ) {
                let obj = {
                  x: "Time",
                  y: [
                    new Date(machineTimeLineArray[i].stateStartTime).getTime(),
                    new Date(machineTimeLineArray[i].stateEndTime).getTime(),
                  ],
                  fillColor: "#576FE6",
                };
                this.line1Data.data.push(obj);
                // this.hassanArrayTest[i].data.push(obj);
                singleMachineObj.data.push(obj);
              }
            }
            this.hassanArrayTest.push(singleMachineObj);

            console.log(this.hassanArrayTest);
           
         
          

          
        

            console.log(this.hassanArrayTest);
          });

          // this.line1Timeline.series = [this.line1Data];

          this.line1Timeline.series = this.hassanArrayTest;

          console.log("56524", allMachinesTimeLineData);

          console.log("ya raaaaab", this.line1Data);
          console.log("hanthola", this.line1Timeline.series);
          console.log("lksaclknslnkacknkllk", this.hassanArrayTest);

          // this.machineAvailabilityBottle = (this.machineindicator.productionOutput / this.machineindicator.expected) * 100

          // this.machineAvailabilityBottle = this.machineAvailabilityBottle.toFixed(0)
          // console.log(this.machineAvailabilityBottle);
          // availbilBar.style.width = `${this.machineAvailabilityBottle}`
        } else {
          // console.log( res[0].machineindicator);

          if (res.length != 0) {
            this.emptyArray = false;
            this.displayData = true;
            this.machineCurrentState = res[0]?.state;
            this.machineCurrentStatus = res[0].status;
            this.machineIdName = res[0].machine;
            this.machineindicator = {
              oee: 0,
              avalability: 0,
              productionOutput: 0,
              expected: 0,
            };
          } else {
            // done

            this.displayData = false;
            this.emptyArray = true;
          }
        }
        console.log(res);
        console.log(this.displayData);
        console.log(this.emptyArray);
      },
      (err) => {
        this.showGifImg = false;
        console.log(err);
      }
    );
   
  }
}
