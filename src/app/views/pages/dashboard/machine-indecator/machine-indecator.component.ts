import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ChartComponent } from '@syncfusion/ej2-angular-charts';
import { ApexAnnotations, ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexPlotOptions, ApexResponsive, ApexStates, ApexStroke, ApexTheme, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/APIsServices/api.service';
import { CurrentActivityService } from 'src/app/Services/current-activity.service';
import { DashboardFilter } from 'src/app/Shared/models/DashboardFilter';
import { SignalRService } from 'src/app/signal-r.service';
// import { ChartOptions } from '../dashboard.component';
import { DashboardService } from '../dashboard.service';




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
  selector: 'app-machine-indecator',
  templateUrl: './machine-indecator.component.html',
  styleUrls: ['./machine-indecator.component.scss']
})
export class MachineIndecatorComponent implements OnInit {


  positionOptions: TooltipPosition[] = ["above"];
  position = new FormControl(this.positionOptions[0]);
  public line1Timeline: Partial<ChartOptions>;
  dashboardFilter: DashboardFilter = new DashboardFilter();

  line1Data = {
    name: "Line 1",
    data: [],
  };


  line1Null = null;


  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

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

  formVal;
  sub1$: Subscription;
  sub2$: Subscription;




  openDialogBtn: boolean = false;

  lineName: any

  machineindicator: any = {
    oee: 0,
    avalability: 0,
    productionOutput: 0,
    expected: 0
  };
  machineID:any = "machine Name"
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
  ngOnDestroy(): void {

  }
  ngAfterViewInit(): void { }
  ngOnInit(): void {
    // this.availbilBar.style.width ='90%'





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
    // console.log("ok", elem );
    // this.dashboardFilter.Factory = elem.name;

    this.dashboardService.getLinesFactories(elem.id).subscribe((res) => {
      console.log("jjjj", res);
      this.allLines = res;
    }, (err) => {
      console.log(err);

    });
  }

  selectLine(elem) {
    console.log(elem);
    this.dashboardFilter.LineID = elem.id;
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


  DrawTimeLine(Data: any) {
    setTimeout(() => {
      // console.log(this._CurrentActivityService.timeLine.lines_Timeline[0]);
      this.line1Data.data = [];


      this.line1Null = Data;

      // console.log(this.line1Null);
      this.line1Null?.forEach((element) => {
        if (element.identifier == "Line 1") {
          if (element.state == "Offline") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#e22517",
            };
            this.line1Data.data.push(obj);
          } else if (element.state == "Waiting") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#dadada",
            };
            this.line1Data.data.push(obj);
          } else if (element.state == "Online") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#29a32c",
            };
            this.line1Data.data.push(obj);
          }
        } else if (element.identifier == "Line 2") {
          if (element.state == "Offline") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#e22517",
            };

          } else if (element.state == "Waiting") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#dadada",
            };

          } else if (element.state == "Online") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#29a32c",
            };

          }
        } else if (element.identifier == "Line 3") {
          if (element.state == "Offline") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#e22517",
            };

          } else if (element.state == "Waiting") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#dadada",
            };

          } else if (element.state == "Online") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#29a32c",
            };

          }
        } else if (element.identifier == "Line 4") {
          if (element.state == "Offline") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#e22517",
            };

          } else if (element.state == "Waiting") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#dadada",
            };

          } else if (element.state == "Online") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#29a32c",
            };

          }
        } else if (element.identifier == "Line 5") {
          if (element.state == "Offline") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#e22517",
            };

          } else if (element.state == "Waiting") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#dadada",
            };

          } else if (element.state == "Online") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#29a32c",
            };

          }
        }
      });

      this.line1Timeline.series = [this.line1Data];


      console.log(this.line1Data);
      if (this.line1Data.data == []) {
        this.line1Null = null;
      } else {
        this.line1Null = this.line1Data;
      }



    });
  }

  fromDate(event) {
    let date = new Date(event.value);
    let modifiedTime = date.toISOString()
    // this.date1 = modifiedTime.replace('22:00:00.000Z' , "").concat("00:00:00.000Z");
    // this.dashboardFilter.startDate = this.date1
    console.log(this.dashboardFilter)

  }



  filter(event) {
    this.machineindicator = {}
    this.machineCurrentState = 0
    this.machineCurrentStatus = "offline"
    this.machineAvailabilityBottle = 0

    this.displayData = false
    let data = {
      machineId: this.selectedMachine,
      factory: Number(this.factoryId),
      line: Number(this.selectedLineNumber),
      start: this.startDate,
      end: this.endDate,
    }
    console.log(data);

    this.dashboardService.getMachineIndIndicator(data).subscribe((res: any) => {
      console.log(res);
      
     this.machineID = res[0]?.machine;
     console.log(this.machineID);
     console.log(res[0]?.machine);
     

      if (res[0]?.machineindicator.length) {

        this.machineindicator = res[0].machineindicator[0];
        this.machineCurrentState = res[0].state
        this.machineCurrentStatus = res[0].status
        this.machineTimeLine = res[0].machinetimeline
        console.log(this.machineindicator);
        console.log(this.machineCurrentState);
        console.log(this.machineCurrentStatus);
        console.log(this.machineTimeLine);
        console.log(res);
        this.displayData = true

        this.machineAvailabilityBottle = (this.machineindicator.productionOutput / this.machineindicator.expected) * 100

        this.machineAvailabilityBottle = this.machineAvailabilityBottle.toFixed(0)
        console.log(this.machineAvailabilityBottle);
        // availbilBar.style.width = `${this.machineAvailabilityBottle}`

      }
      else {
        this.displayData = true
        this.machineCurrentState = res[0].state
        this.machineCurrentStatus = res[0].status
        this.machineindicator = {
          oee: 0,
          avalability: 0,
          productionOutput: 0,
          expected: 0
        };
      }
      console.log(res);





    }, (err) => {
      console.log(err);

    })
    // hassan's last ay haga 

    // this.dashboardService.getTimeLine(this.dashboardFilter).subscribe((res) => {
    //   if (res.lines_Timeline) {
    //     this.DrawTimeLine(res.lines_Timeline);


    //   }
    // });
  }




}
