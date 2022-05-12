import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexGrid,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexMarkers,
  ApexStroke,
  ApexLegend,
  ApexResponsive,
  ApexTooltip,
  ApexFill,
  ApexDataLabels,
  ApexPlotOptions,
  ApexTitleSubtitle,
} from "ng-apexcharts";
import { Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { DashboardFilter } from "src/app/Shared/models/DashboardFilter";
import { DashboardService } from "../dashboard.service";
import { EditTablePopupComponent } from "./edit-table-popup/edit-table-popup.component";
import { ProductPlanPopupComponent } from "./product-plan-popup/product-plan-popup.component";
export type ChartOptions = {
  series: ApexAxisChartSeries;
  nonAxisSeries: ApexNonAxisChartSeries;
  colors: string[];
  grid: ApexGrid;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  markers: ApexMarkers;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  tooltip: ApexTooltip;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  labels: string[];
  title: ApexTitleSubtitle;
};

/** Constants used to fill up our data base. */


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
@Component({
  selector: "app-plan",
  templateUrl: "./plan.component.html",
  styleUrls: ["./plan.component.scss"],
})
export class PlanComponent implements OnInit, AfterViewInit {
  public chartOptions: Partial<ChartOptions>;
  // table
  displayedColumns: string[] = [
    "Factory",
    "Line",
    "Start Date",
    "End Date",
    "Main Reason",
    "Sub Reason",
    "Edit",
    "Delete",
  ];
  displayedColumns2: string[] = [
    "Factory",
    "Line",
    "shift Time",
    "Product Name",
    "Target",
    "Edit",
    "Delete",
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dateControl = new FormControl("");
  dateControl2 = new FormControl("");
  date2?: any = [];
  selected: Date | null;
  selected2: Date | null ;
  location?: any = [];
  allLines?: any = [];
  allMachines?: any = [];
  allShifts?: any = [];
  openLines_Shift: boolean = true;
  openMachine: boolean = true;
  subReasonDropDownValue: any;
  showReduceSpeedField: boolean = true;
  factoryName?: string;
  lineNumber?: number;
  machineNameVar?: string;
  startDateTime?: Date;
  endDateTime?: Date;
  MainReasonValue?: number;
  shiftNumber?: number;
  reasonValue?: number;
  TimePicker1: any;
  TimePicker2: any;
  getTime1?: any;
  getTime2?: any;
  openTime1: boolean = true;
  openTime2: boolean = true;
  datePicker: any;
  technicalSKUVar: any;
  calenderEventToTable: String;
  calenderPlanDate: any;
  targetInp: any;
  tableGridData = [];
  tableGridData2 = [];
  dashboardFilter: DashboardFilter = new DashboardFilter();
  planningObj = {};
  openAddBtnInFactory: boolean = true;
  openAddBtnInMainReason: boolean = true;
  openAddBtnInSubReason: boolean = true;
  openAddBtnInDate: boolean = true;

  processSkipInputValue?: any;
  planTableGrid = [];
  dataSource;
  dataSource2;
  ss = [];
  dateAndTime: any;
  shiftTime: any;
  locationName: any;
  lineName: any;
  machine: any;
  mainReasonName: any;
  subReasonName: any;
  skuArr = [];
  dataDialog;
  chartSub = new Subject();
  chartSubAsync = this.chartSub.asObservable();

  constructor(
    private dashboardService: DashboardService,
    public dialog: MatDialog
    
  ) {}

  // main reasons dropDown Array
  MainReason = [
    { name: "Change Over", value: 1 },
    { name: "Down Time", value: 2 },
    { name: "Non Scheduled Time Line", value: 3 },
    { name: "Norms", value: 4 },
    { name: "Process Skip", value: 5 },
    { name: "Reduced Speed", value: 6 },
    { name: "Scheduled Maintenance Down Time", value: 7 },
  ];

  // end table data
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource2.paginator = this.paginator;
  }

  ngOnInit(): void {
 


    this.dataSource = new MatTableDataSource<PeriodicElement>(
      this.tableGridData
    );
    this.dataSource2 = new MatTableDataSource<PeriodicElement>(
      this.planTableGrid
    );
    // get factories
    this.dashboardService.getFactories().subscribe((res) => {
      this.location = res;
      this.dashboardService
        //  get factory lines in the first time
        .getLinesFactories(this.location[0].id)
        .subscribe((res) => {
          this.allLines = res;
        });
    });

    this.chartOptions = {
      series: [],

      chart: {
        height: 200,
        type: "rangeBar",
        stacked: false,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "100%",
        },
      },
      xaxis: {
        type: "datetime",
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100],
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
      },
    };
  }

  // location and Lines of the factory
  selectLocation(elem, id, locationName) {
    this.locationName = locationName;
    this.factoryName = elem;
    this.dashboardFilter.Factory = elem;
    this.openLines_Shift = false;
    this.openAddBtnInFactory = false;
    this.dashboardService.getLinesFactories(id).subscribe((res) => {
      this.allLines = res;
    });
    // shift plan
    this.dashboardService.getShiftsPlan(id).subscribe((res) => {
      this.allShifts = res;
    });
  }

  // lines id
  selectLineId(lineId, lineNum, lineNam) {
    this.lineName = lineNam;
    //  get machine from line id
    this.dashboardService.getMachinePlan(lineId).subscribe((res) => {
      console.log("done", res);
      this.allMachines = res;
      this.openMachine = false;
      this.lineNumber = lineNum;
    });

    this.dashboardService.getSku(this.factoryName, lineId).subscribe((res) => {
      this.skuArr = res;
    });
  }
  // machine click
  machineName(plcName, machine) {
    console.log("plcName", plcName);
    this.machineNameVar = plcName;
    this.machine = machine;
  }

  // shift click
  selectShift(shiftNum, startShiftTime) {
    console.log(shiftNum, "ok");
    this.shiftNumber = shiftNum;
    this.shiftTime = startShiftTime;
    console.log(this.shiftTime)
  }

  // event of calender
  CalenderDate(event) {
    this.ss = [];
    if (event) {
      let myDate = new Date(event);
      myDate.setDate(myDate.getDate() + 1);
      this.calenderEventToTable = myDate.toISOString().replace("T22", "T00");
      console.log(this.calenderEventToTable);
      this.datePicker = myDate.toISOString().replace("22:00:00.000Z", "");
      this.openTime1 = false;
      this.openAddBtnInDate = false;
      this.dashboardService.getGridplanTableData(this.calenderEventToTable).subscribe((res) => {
          this.tableGridData = res;
          this.tableGridData2 = res;
          this.tableGridData2.forEach((elem) => {
            var mm = {
              name: elem.mainReason,
              data: [
                {
                  x: "Down Time",
                  y: [
                    new Date(elem.startTime).getTime() + 7200000,
                    new Date(elem.endTime).getTime() + 7200000,
                  ],
                },
              ],
            };
            this.ss.push(mm);
            this.chartOptions.series = this.ss;
          });

          console.log(this.ss);
        });
    }
  }

  // time picker 1
  timePicker1(event) {
   
    let date = new Date(event);
    let modifiedTime = date.toLocaleTimeString("en-GB");
    let concatFormatTime = modifiedTime.concat(".000Z");
    this.getTime1 = this.datePicker + "" + concatFormatTime;
    console.log(this.getTime1);
    this.openTime2 = false
  }

  // time picker 2
  timePicker2(event) {
    let date = new Date(event);
    let modifiedTime2 = date.toLocaleTimeString("en-GB");
    let concatFormatTime2 = modifiedTime2.concat(".000Z");
    this.getTime2 = this.datePicker + "" + concatFormatTime2;
    console.log(this.getTime2);
  }

  sendMainReasonValue(value, mainReasonName) {
    this.mainReasonName = mainReasonName;
    this.openAddBtnInMainReason = false;
    this.MainReasonValue = value;
    if (value == 1) {
      this.dashboardService.getChangeOverPlanning().subscribe((res) => {
        this.subReasonDropDownValue = res;
        this.showReduceSpeedField = true;
      });
    } else if (value == 2) {
      this.dashboardService.getDownTimePlanning().subscribe((res) => {
        this.subReasonDropDownValue = res;
        this.showReduceSpeedField = true;
      });
    } else if (value == 3) {
      this.dashboardService.getNonScheduledDownTimes().subscribe((res) => {
        this.subReasonDropDownValue = res;
        this.showReduceSpeedField = true;
      });
    } else if (value == 4) {
      this.dashboardService.getNormsPlanning().subscribe((res) => {
        this.subReasonDropDownValue = res;
        this.showReduceSpeedField = true;
      });
    } else if (value == 5) {
      this.dashboardService.getProcess_Skip_Planning().subscribe((res) => {
        this.subReasonDropDownValue = res;
        this.showReduceSpeedField = true;
      });
    } else if (value == 6) {
      this.showReduceSpeedField = false;
    } else if (value == 7) {
      this.dashboardService
        .getScheduledMaintenanceDownTimes()
        .subscribe((res) => {
          this.subReasonDropDownValue = res;
          this.showReduceSpeedField = true;
        });
    }
  }

  //subReasonClick
  subReasonClick(reasonVal) {
    this.reasonValue = reasonVal;
    this.openAddBtnInSubReason = false;
  }

  //  post add btn
  Add() {
    if (this.MainReasonValue == 1) {
      this.planningObj = {
        factory: this.factoryName,
        line: this.lineNumber,
        machine: this.machineNameVar,
        shiftStartTime: this.getTime1,
        startTime: this.getTime1,
        endTime: this.getTime2,
        changeOverType: this.reasonValue,
      };
      console.log("ob", this.planningObj);
      this.dashboardService
        .postChangeOverPlanning(this.planningObj)
        .subscribe((res) => {
          console.log("1", res);
        });
    } else if (this.MainReasonValue == 2) {
      this.planningObj = {
        factory: this.factoryName,
        line: this.lineNumber,
        machine: this.machineNameVar,
        shiftStartTime: this.getTime1,
        startTime: this.getTime1,
        endTime: this.getTime2,
        downTime: this.reasonValue,
      };
      this.dashboardService
        .postDownTimePlanning(this.planningObj)
        .subscribe((res) => {
          console.log("2", res);
        });
    } else if (this.MainReasonValue == 3) {
      this.planningObj = {
        factory: this.factoryName,
        line: this.lineNumber,
        machine: this.machineNameVar,
        shiftStartTime: this.getTime1,
        startTime: this.getTime1,
        endTime: this.getTime2,
        nonSchedualedDownTimeType: this.reasonValue,
      };
      console.log("33", this.planningObj);
      this.dashboardService
        .postNonScheduledDownTimes(this.planningObj)
        .subscribe((res) => {
          console.log("3", res);
        });
    } else if (this.MainReasonValue == 4) {
      this.planningObj = {
        factory: this.factoryName,
        line: this.lineNumber,
        machine: this.machineNameVar,
        shiftStartTime: this.getTime1,
        startTime: this.getTime1,
        endTime: this.getTime2,
        norms: this.reasonValue,
      };
      this.dashboardService
        .postNormsPlanning(this.planningObj)
        .subscribe((res) => {
          console.log("4", res);
        });
    } else if (this.MainReasonValue == 5) {
      this.planningObj = {
        factory: this.factoryName,
        line: this.lineNumber,
        machine: this.machineNameVar,
        shiftStartTime: this.getTime1,
        startTime: this.getTime1,
        endTime: this.getTime2,
        processSkipType: this.reasonValue,
      };
      this.dashboardService
        .postProcess_Skip_Planning(this.planningObj)
        .subscribe((res) => {
          console.log("5", res);
        });
    } else if (this.MainReasonValue == 6) {
      this.planningObj = {
        factory: this.factoryName,
        line: this.lineNumber,
        machine: this.machineNameVar,
        shiftStartTime: this.getTime1,
        startTime: this.getTime1,
        endTime: this.getTime2,
        reducedSpeed: this.processSkipInputValue,
      };
      this.dashboardService
        .postReduced_Speed_Planning(this.planningObj)
        .subscribe((res) => {
          console.log("6", res);
        });
    } else if (this.MainReasonValue == 7) {
      this.planningObj = {
        factory: this.factoryName,
        line: this.lineNumber,
        machine: this.machineNameVar,
        shiftStartTime: this.getTime1,
        startTime: this.getTime1,
        endTime: this.getTime2,
        schedualedMaintenanceDownTimeType: this.reasonValue,
      };
      this.dashboardService
        .postScheduledMaintenanceDownTimes(this.planningObj)
        .subscribe((res) => {
          console.log("7", res);
        });
    }
  }

  AddBtnFunc() {
    if (
      this.openAddBtnInFactory == false &&
      this.openAddBtnInDate == false &&
      this.openAddBtnInMainReason == false &&
      this.openAddBtnInSubReason == false
    ) {
      return false;
    } else {
      return true;
    }
  }

  calenderPlan(calenderPlan) {
    if (calenderPlan) {
      let myDate = new Date(calenderPlan);
      myDate.setDate(myDate.getDate() + 1);
      this.calenderPlanDate = myDate
        .toISOString()
        .replace("T22:00:00.000Z", "");
      if (this.shiftTime) {
        let time = this.shiftTime.slice(10).replace('+02:00' , '');
        this.dateAndTime = this.calenderPlanDate + "" + time;
        console.log(this.dateAndTime);
      }

      this.dashboardService.getPlanShiftMaterialConsumptions(this.calenderPlanDate)
        .subscribe((res) => {
          this.planTableGrid = res;
          console.log(this.planTableGrid);
        });

        
    }
  }

  // get SKU
  techSKU(technicalSKU) {
    this.technicalSKUVar = technicalSKU;
    console.log(this.technicalSKUVar);
  }

  // post planMaterialConsumptions
  planMaterialConsumptions() {
    let obj = {
      factory: this.factoryName,
      line: this.lineNumber,
      machine: this.machineNameVar,
      shiftStartTime: this.dateAndTime,
      sku: this.technicalSKUVar,
      target: this.targetInp,
    };
    if(obj) {
      this.dashboardService.PlanShiftMaterialConsumptions(obj).subscribe();
    }
  }
  // delete 1 table grid
  onDelete(element) {
    console.log(element);
    this.tableGridData = this.tableGridData.filter((u) => u.id !== element.id);
    console.log(this.tableGridData);

   

    if (element.mainReason == "Change Over") {
      this.dashboardService
        .deleteChangeOverPlanning(element.id)
        .subscribe((res) => {
          console.log(res);
        });
    } else if (element.mainReason == "Non_Schedualed Down Time") {
      this.dashboardService
        .deleteNonScheduledDownTimes(element.id)
        .subscribe((res) => {
          console.log(res);
        });
    } else if (element.mainReason == "Norms") {
      this.dashboardService.deleteNormsPlanning(element.id).subscribe();
    } else if (element.mainReason == "Down Time") {
      this.dashboardService.deleteDownTimePlanning(element.id).subscribe();
    } else if (element.mainReason == "Process Skip") {
      this.dashboardService.deleteProcess_Skip_Planning(element.id).subscribe();
    } else if (element.mainReason == "Reduced Speed") {
      this.dashboardService
        .deleteReduced_Speed_Planning(element.id)
        .subscribe();
    } else if (element.mainReason == "Schedualed Maintenance Down Time") {
      this.dashboardService
        .deleteScheduledMaintenanceDownTimes(element.id)
        .subscribe();
    }
  }
  // open to edit
  openDialogEdit(element) {
    console.log(element, "okkkk");

    element.date = this.calenderEventToTable.replace('T00:00:00.000Z' , '');
    console.log("from plan", element);
    this.dialog
      .open(EditTablePopupComponent, {
        width: "1000px",
        height: "600px",
        data: element,
      })
      .afterClosed()
      .subscribe((res) => {
        console.log(res)
        if(res) {
          element.startTime = res.startTime
          element.endTime = res.endTime
        }
      });
    
  }




  EditProductPlanPopup(element) {
    const dialogRef = this.dialog.open(ProductPlanPopupComponent, {
      width: "1000px",
      height: "600px",
      data: element,
    });
  }

  onDeleteProductPlanPop(element) {
    this.planTableGrid = this.planTableGrid.filter((u) => u.id !== element.id);   
    this.dashboardService.deletePlanShiftMaterialConsumptions(element.id).subscribe()
  }


}

