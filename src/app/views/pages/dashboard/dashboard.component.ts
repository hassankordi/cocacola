import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { NgbDateStruct, NgbCalendar } from "@ng-bootstrap/ng-bootstrap";
import { CurrentActivityService } from "src/app/Services/current-activity.service";
import { ApiService } from "src/app/APIsServices/api.service";
import { DashboardService } from "./dashboard.service";
import { DashboardFilter } from "src/app/Shared/models/DashboardFilter";
import { FormControl, FormGroup } from "@angular/forms";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexFill,
  ApexGrid,
  ApexAnnotations,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStates,
  ApexTheme,
  ApexLegend,
} from "ng-apexcharts";
import { formatDate } from "@angular/common";
import { Tooltip } from "chart.js";
import { TooltipPosition } from "@angular/material/tooltip";
import { Subscription } from "rxjs";
import { share, shareReplay } from "rxjs/operators";
import { SignalRService } from "src/app/signal-r.service";

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
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  preserveWhitespaces: true,
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {






  positionOptions: TooltipPosition[] = ["above"];
  position = new FormControl(this.positionOptions[0]);
  public line1Timeline: Partial<ChartOptions>;
  public line2Timeline: Partial<ChartOptions>;
  public line3Timeline: Partial<ChartOptions>;
  public line4Timeline: Partial<ChartOptions>;
  public line5Timeline: Partial<ChartOptions>;
  line1Data = {
    name: "Line 1",
    data: [],
  };

  line2Data = {
    name: "Line 2",
    data: [],
  };
  line3Data = {
    name: "Line 3",
    data: [],
  };
  line4Data = {
    name: "Line 4",
    data: [],
  };
  line5Data = {
    name: "Line 5",
    data: [],
  };
  line1Null = null;
  line2Null = null;
  line3Null = null;
  line4Null = null;
  line5Null = null;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public barChartOptions: Partial<ChartOptions>;
  // date picker Form
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  currentDate: NgbDateStruct;
  // Decleration From Api
  location: any;
  allLines: any;
  functionList: any;
  dashboardFilter: DashboardFilter = new DashboardFilter();
  totalDashboardInfo: any;
  totalDashboardInfoObj;
  any;
  date1: any;
  date2: any;
  factoryName: any;
  factoryLine: any;
  factoryShiftType: any;
  factoryShiftTime: any;
  openShifts = true;
  ss = [];
  data = [];
  selectedValue;
  timeLineChart;
  selectedLocation = "Alex";
  selectedLines;
  selectedTimeShift;
  selectedShift;
  selectedDate1;
  selectedDate2;
  selectedDate;
  picker;
  showPickerMultiple = false;
  showPickerDay = false;
  selectedTimePlan;
  dateByDay;
  openDate = true;
  calenderByDay;
  showBottleDiv: boolean = false;
  showPhysicalDiv: boolean = false
  showPalletDiv: boolean = false
  showDivData: boolean = false
  showCo2Data: boolean = false
  showSyrubData: boolean = false
  totalProduction: any = [];
  totalMaterial: any = []
  formVal;
  sub1$: Subscription;
  sub2$: Subscription;
  dataaaa = [
    "mohamed",
    "ahmed"
  ];
  shiftTimeType: any = [
    { text: "", value: null },
    { text: "All Shifts", value: 0 },
    { text: "Shift 1", value: 1 },
    { text: "Shift 2", value: 2 },
  ];
  selectTimeArr: any = [
    { text: "", value: null },
    { text: "Yesterday", value: 0 },
    { text: "Last Week", value: 1 },
    { text: "Last Month", value: 2 },
    { text: "Duration", value: 3 },
    { text: "Day", value: 4 },
  ];
  selectedCar: string;
  // end
  //constructor
  constructor(
    private calendar: NgbCalendar,
    public _CurrentActivityService: CurrentActivityService,
    private apiSer: ApiService,
    private dashboardService: DashboardService,
    public signalRService: SignalRService
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
    this.line2Timeline = {
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
    this.line3Timeline = {
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
    this.line4Timeline = {
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
    this.line5Timeline = {
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

    //Water Fall chart options

    this.barChartOptions = {
      series: [],

      chart: {
        type: "rangeBar",
        height: 400,
      },

      colors: ["#e61d2b"],

      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      dataLabels: {
        textAnchor: "middle",

        enabled: true,
        style: {
          colors: ["#000"],
        },
      },
      legend: {
        fontWeight: 900,
      },

      xaxis: {
        labels: {
          show: true,
          rotate: -45,
          rotateAlways: false,
          hideOverlappingLabels: true,
          showDuplicates: false,
          trim: false,
          minHeight: undefined,
          maxHeight: 120,

          style: {
            colors: [],
            fontSize: "12px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 900,
            cssClass: "apexcharts-xaxis-label",
          },
        },
      },
      yaxis: {
        labels: {
          show: true,
          align: "right",
          minWidth: 0,
          maxWidth: 160,
          style: {
            colors: [],
            fontSize: "13px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 600,
            cssClass: "apexcharts-yaxis-label",
          },
        },
      },
      //  over on chart
    };
  }
  ngOnDestroy(): void {
    this.sub1$.unsubscribe();
    this.sub2$.unsubscribe();
  }
  ngAfterViewInit(): void { }
  ngOnInit(): void {

    this.dashboardService.pageName.next('DashBoard')
    this.showPickerMultiple = true;
    console.log(this.barChartOptions);

    //Factories
    this.sub1$ = this.dashboardService.getFactories().subscribe((res) => {
      this.location = res;
      console.log("kk", res);
      this.dashboardService
        .getLinesFactories(this.location[0].id)
        .subscribe((res) => {
          console.log("j", res);
          this.allLines = res;
        });
    });

    this.dashboardFilter.Factory = "Alex";
    this.dashboardFilter.TimeType = 0;

    this.sub2$ = this.dashboardService
      .getDashboard(this.dashboardFilter)
      .subscribe((res) => {
        console.log(res, "yyyyy");
        if (res) {

          console.log("///////", res);
          this.totalDashboardInfo = res;
          console.log("haha", this.totalDashboardInfo);
          this.totalDashboardInfo.forEach((element) => {
            element.forEach((elem) => {
              this.totalDashboardInfoObj = elem;
              this.totalProduction = this.totalDashboardInfoObj.total_Production
              this.totalMaterial = this.totalDashboardInfoObj.total_Materials
              console.log(this.totalDashboardInfoObj, "o");
              console.log(typeof this.totalDashboardInfoObj.opl);

              this.barChartOptions.series = [
                {
                  data: [
                    {
                      x: "Installed_Capacity",
                      fillColor: "#5081bc",
                      y: [0, this.totalDashboardInfoObj.installed_Capacity],
                    },
                    {
                      x: "NonScheduled",
                      fillColor: "#d72424",
                      y: [
                        this.totalDashboardInfoObj.installed_Capacity,
                        Math.ceil(
                          this.totalDashboardInfoObj.installed_Capacity -
                          this.totalDashboardInfoObj.nonScheduled * 100
                        ),
                      ],
                    },
                    {
                      x: "Asset Utilization",
                      fillColor: "#91c157",
                      y: [
                        0,
                        Math.ceil(
                          this.totalDashboardInfoObj.installed_Capacity -
                          this.totalDashboardInfoObj.nonScheduled * 100
                        ),
                      ],
                    },
                    {
                      x: "Scheduled Maintenance",
                      fillColor: "#5081bc",
                      y: [
                        Math.ceil(
                          this.totalDashboardInfoObj.installed_Capacity -
                          this.totalDashboardInfoObj.nonScheduled * 100
                        ),
                        Math.ceil(
                          this.totalDashboardInfoObj.installed_Capacity -
                          this.totalDashboardInfoObj.nonScheduled * 100
                        ) -
                        Math.ceil(this.totalDashboardInfoObj.scheduledMaintenance * 100)
                      ],
                    },
                    {
                      x: "Output",
                      fillColor: "#91c157",
                      y: [
                        0,
                        Math.ceil(
                          this.totalDashboardInfoObj.installed_Capacity -
                          this.totalDashboardInfoObj.nonScheduled * 100
                        ) -
                        Math.ceil(
                          this.totalDashboardInfoObj.scheduledMaintenance *
                          100
                        ),
                      ],
                    },
                    {
                      x: "Paid_Time",
                      fillColor: "#91c157",
                      y: [0, this.totalDashboardInfoObj.paid_Time],
                    },
                    {
                      x: "Maintenance_Setup",
                      fillColor: "#91c157",
                      y: [
                        this.totalDashboardInfoObj.paid_Time,
                        Math.ceil(
                          this.totalDashboardInfoObj.paid_Time -
                          this.totalDashboardInfoObj.maintenance_Setup * 100
                        ),
                      ],
                    },
                    {
                      x: "ChangeOverTime_CIP",
                      fillColor: "#d72424",
                      y: [
                        Math.ceil(
                          this.totalDashboardInfoObj.paid_Time -
                          this.totalDashboardInfoObj.maintenance_Setup * 100
                        ),
                        Math.ceil(
                          this.totalDashboardInfoObj.paid_Time -
                          this.totalDashboardInfoObj.maintenance_Setup * 100 -
                          this.totalDashboardInfoObj.changeOverTime_CIP * 100
                        ),
                      ],
                    },
                    {
                      x: "epl",
                      fillColor: "#d72424",
                      y: [
                        Math.ceil(
                          this.totalDashboardInfoObj.paid_Time -
                          this.totalDashboardInfoObj.maintenance_Setup * 100 -
                          this.totalDashboardInfoObj.changeOverTime_CIP * 100
                        ),
                        Math.ceil(
                          this.totalDashboardInfoObj.paid_Time -
                          this.totalDashboardInfoObj.maintenance_Setup * 100 -
                          this.totalDashboardInfoObj.changeOverTime_CIP *
                          100 -
                          this.totalDashboardInfoObj.epl * 100
                        ),
                      ],
                    },
                    {
                      x: "MinorStoppage",
                      fillColor: "#d72424",
                      y: [
                        Math.ceil(
                          this.totalDashboardInfoObj.paid_Time -
                          this.totalDashboardInfoObj.maintenance_Setup * 100 -
                          this.totalDashboardInfoObj.changeOverTime_CIP *
                          100 -
                          this.totalDashboardInfoObj.epl * 100
                        ),
                        Math.ceil(
                          this.totalDashboardInfoObj.paid_Time -
                          this.totalDashboardInfoObj.maintenance_Setup * 100 -
                          this.totalDashboardInfoObj.changeOverTime_CIP *
                          100 -
                          this.totalDashboardInfoObj.epl * 100 -
                          this.totalDashboardInfoObj.minorStoppage
                        ),
                      ],
                    },
                    {
                      x: "setup_Time",
                      fillColor: "#d72424",
                      y: [
                        Math.ceil(
                          this.totalDashboardInfoObj.paid_Time -
                          this.totalDashboardInfoObj.maintenance_Setup * 100 -
                          this.totalDashboardInfoObj.changeOverTime_CIP *
                          100 -
                          this.totalDashboardInfoObj.epl * 100 -
                          this.totalDashboardInfoObj.minorStoppage
                        ),
                        Math.ceil(
                          this.totalDashboardInfoObj.paid_Time -
                          this.totalDashboardInfoObj.maintenance_Setup * 100 -
                          this.totalDashboardInfoObj.changeOverTime_CIP *
                          100 -
                          this.totalDashboardInfoObj.epl * 100 -
                          this.totalDashboardInfoObj.minorStoppage -
                          this.totalDashboardInfoObj.setup_Time * 100
                        ),
                      ],
                    },
                    {
                      x: "lossTime",
                      fillColor: "#d72424",
                      y: [
                        Math.ceil(
                          this.totalDashboardInfoObj.paid_Time -
                          this.totalDashboardInfoObj.maintenance_Setup * 100 -
                          this.totalDashboardInfoObj.changeOverTime_CIP *
                          100 -
                          this.totalDashboardInfoObj.epl * 100 -
                          this.totalDashboardInfoObj.minorStoppage -
                          this.totalDashboardInfoObj.setup_Time * 100
                        ),
                        Math.ceil(
                          this.totalDashboardInfoObj.paid_Time -
                          this.totalDashboardInfoObj.maintenance_Setup * 100 -
                          this.totalDashboardInfoObj.changeOverTime_CIP *
                          100 -
                          this.totalDashboardInfoObj.epl * 100 -
                          this.totalDashboardInfoObj.minorStoppage -
                          this.totalDashboardInfoObj.setup_Time * 100 -
                          this.totalDashboardInfoObj.lossTime * 100
                        ),
                      ],
                    },
                    {
                      x: "OPL",
                      fillColor: "#d72424",
                      y: [
                        Math.ceil(
                          this.totalDashboardInfoObj.paid_Time -
                          this.totalDashboardInfoObj.maintenance_Setup * 100 -
                          this.totalDashboardInfoObj.changeOverTime_CIP *
                          100 -
                          this.totalDashboardInfoObj.epl * 100 -
                          this.totalDashboardInfoObj.minorStoppage -
                          this.totalDashboardInfoObj.setup_Time * 100 -
                          this.totalDashboardInfoObj.lossTime * 100
                        ),
                        Math.ceil(
                          this.totalDashboardInfoObj.paid_Time -
                          this.totalDashboardInfoObj.maintenance_Setup * 100 -
                          this.totalDashboardInfoObj.changeOverTime_CIP *
                          100 -
                          this.totalDashboardInfoObj.epl * 100 -
                          this.totalDashboardInfoObj.minorStoppage -
                          this.totalDashboardInfoObj.setup_Time * 100 -
                          this.totalDashboardInfoObj.lossTime * 100 -
                          this.totalDashboardInfoObj.opl * 100
                        ),
                      ],
                    },
                    {
                      x: "Sle",
                      fillColor: "#91c157",
                      y: [0, Math.ceil(this.totalDashboardInfoObj.sle * 100)],
                    },
                  ],
                },
              ];
            });
          });
        }
      });

    //time
    this.currentDate = this.calendar.getToday();
    this.dashboardService.getTimeLine(this.dashboardFilter).subscribe((res) => {
      console.log("Time" , res)
      this.DrawTimeLine(res);

      this.data = res;
    });

    // start HOVER TOGGLE

    // end HOVER TOGGLE
  }

  // draw Time line
  DrawTimeLine(Data: any) {
    setTimeout(() => {
      // console.log(this._CurrentActivityService.timeLine.lines_Timeline[0]);
      this.line1Data.data = [];
      this.line2Data.data = [];
      this.line3Data.data = [];
      this.line4Data.data = [];
      this.line5Data.data = [];

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
          }else if(element.state == 'Cleaning in Process') {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#576FE6",
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
            this.line2Data.data.push(obj);
          } else if (element.state == "Waiting") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#dadada",
            };
            this.line2Data.data.push(obj);
          } else if (element.state == "Online") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#29a32c",
            };
            this.line2Data.data.push(obj);
          }else if(element.state == 'Cleaning in Process') {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#576FE6",
            };
            this.line2Data.data.push(obj);
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
            this.line3Data.data.push(obj);
          } else if (element.state == "Waiting") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#dadada",
            };
            this.line3Data.data.push(obj);
          } else if (element.state == "Online") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#29a32c",
            };
            this.line3Data.data.push(obj);
          }else if(element.state == 'Cleaning in Process') {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#576FE6",
            };
            this.line3Data.data.push(obj);
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
            this.line4Data.data.push(obj);
          } else if (element.state == "Waiting") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#dadada",
            };
            this.line4Data.data.push(obj);
          } else if (element.state == "Online") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#29a32c",
            };
            this.line4Data.data.push(obj);
          }else if(element.state == 'Cleaning in Process') {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#576FE6",
            };
            this.line4Data.data.push(obj);
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
            this.line5Data.data.push(obj);
          } else if (element.state == "Waiting") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#dadada",
            };
            this.line5Data.data.push(obj);
          } else if (element.state == "Online") {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#29a32c",
            };
            this.line5Data.data.push(obj);
          }else if(element.state == 'Cleaning in Process') {
            let obj = {
              x: "Time",
              y: [
                new Date(element.from).getTime(),
                new Date(element.to).getTime(),
              ],
              fillColor: "#576FE6",
            };
            this.line5Data.data.push(obj);
          }
        }
      });

      this.line1Timeline.series = [this.line1Data];
      this.line2Timeline.series = [this.line2Data];
      this.line3Timeline.series = [this.line3Data];
      this.line4Timeline.series = [this.line4Data];
      this.line5Timeline.series = [this.line5Data];

      console.log(this.line1Data);
      if (this.line1Data.data == []) {
        this.line1Null = null;
      } else {
        this.line1Null = this.line1Data;
      }
      if (this.line2Data.data == []) {
        this.line2Null = null;
      } else {
        this.line2Null = this.line2Data;
      }
      if (this.line3Data.data == []) {
        this.line3Null = null;
      } else {
        this.line3Null = this.line3Data;
      }
      if (this.line4Data.data == []) {
        this.line4Null = null;
      } else {
        this.line4Null = this.line4Data;
      }
      if (this.line5Data.data == []) {
        this.line5Null = null;
      } else {
        this.line5Null = this.line5Data;
      }

      console.log(this.line4Timeline);
    });
  }

  // drwa loss tree
  drawLossTree(data: any) {
    if (data[0] !== null) {
      console.log("lololo",this.totalDashboardInfoObj.scheduledMaintenance * 100)
      console.log("lololo22",this.totalDashboardInfoObj.installed_Capacity -
      this.totalDashboardInfoObj.nonScheduled * 100)
      console.log("i'm Data", data);
      data.forEach((element) => {
        console.log("okkkkk", element);
        element.forEach((elem) => {
          this.totalDashboardInfoObj = elem;
          this.barChartOptions.series = [
            {
              data: [
                {
                  x: "Installed_Capacity",
                  fillColor: "#5081bc",
                  y: [0, this.totalDashboardInfoObj.installed_Capacity],
                },
                {
                  x: "NonScheduled",
                  fillColor: "#d72424",
                  y: [
                    this.totalDashboardInfoObj.installed_Capacity,
                    Math.ceil(
                      this.totalDashboardInfoObj.installed_Capacity -
                      this.totalDashboardInfoObj.nonScheduled * 100
                    ),
                  ],
                },
                {
                  x: "Asset Utilization",
                  fillColor: "#91c157",
                  y: [
                    0,
                    Math.ceil(
                      this.totalDashboardInfoObj.installed_Capacity -
                      this.totalDashboardInfoObj.nonScheduled * 100
                    ),
                  ],
                },
                {
                  x: "Scheduled Maintenance",
                  fillColor: "#d72424",
                  y: [
                    Math.ceil(
                      this.totalDashboardInfoObj.installed_Capacity -
                      this.totalDashboardInfoObj.nonScheduled * 100
                    ),
                    Math.ceil(
                      this.totalDashboardInfoObj.installed_Capacity -
                      this.totalDashboardInfoObj.nonScheduled * 100
                    ) -
                    Math.ceil(this.totalDashboardInfoObj.scheduledMaintenance * 100)
                  ],
                },
                {
                  x: "Output",
                  fillColor: "#91c157",
                  y: [
                    0,
                    Math.ceil(
                      this.totalDashboardInfoObj.installed_Capacity -
                      this.totalDashboardInfoObj.nonScheduled * 100
                    ) -
                    Math.ceil(
                      this.totalDashboardInfoObj.scheduledMaintenance * 100
                    ),
                  ],
                },
                {
                  x: "Paid_Time",
                  fillColor: "#91c157",
                  y: [0, this.totalDashboardInfoObj.paid_Time],
                },
                {
                  x: "Maintenance_Setup",
                  fillColor: "#91c157",
                  y: [
                    this.totalDashboardInfoObj.paid_Time,
                    Math.ceil(
                      this.totalDashboardInfoObj.paid_Time -
                      this.totalDashboardInfoObj.maintenance_Setup * 100
                    ),
                  ],
                },
                {
                  x: "ChangeOverTime_CIP",
                  fillColor: "#d72424",
                  y: [
                    Math.ceil(
                      this.totalDashboardInfoObj.paid_Time -
                      this.totalDashboardInfoObj.maintenance_Setup * 100
                    ),
                    Math.ceil(
                      this.totalDashboardInfoObj.paid_Time -
                      this.totalDashboardInfoObj.maintenance_Setup * 100 -
                      this.totalDashboardInfoObj.changeOverTime_CIP * 100
                    ),
                  ],
                },
                {
                  x: "epl",
                  fillColor: "#d72424",
                  y: [
                    Math.ceil(
                      this.totalDashboardInfoObj.paid_Time -
                      this.totalDashboardInfoObj.maintenance_Setup * 100 -
                      this.totalDashboardInfoObj.changeOverTime_CIP * 100
                    ),
                    Math.ceil(
                      this.totalDashboardInfoObj.paid_Time -
                      this.totalDashboardInfoObj.maintenance_Setup * 100 -
                      this.totalDashboardInfoObj.changeOverTime_CIP * 100 -
                      this.totalDashboardInfoObj.epl * 100
                    ),
                  ],
                },
                {
                  x: "MinorStoppage",
                  fillColor: "#d72424",
                  y: [
                    Math.ceil(
                      this.totalDashboardInfoObj.paid_Time -
                      this.totalDashboardInfoObj.maintenance_Setup * 100 -
                      this.totalDashboardInfoObj.changeOverTime_CIP * 100 -
                      this.totalDashboardInfoObj.epl * 100
                    ),
                    Math.ceil(
                      this.totalDashboardInfoObj.paid_Time -
                      this.totalDashboardInfoObj.maintenance_Setup * 100 -
                      this.totalDashboardInfoObj.changeOverTime_CIP * 100 -
                      this.totalDashboardInfoObj.epl * 100 -
                      this.totalDashboardInfoObj.minorStoppage
                    ),
                  ],
                },
                {
                  x: "setup_Time",
                  fillColor: "#d72424",
                  y: [
                    Math.ceil(
                      this.totalDashboardInfoObj.paid_Time -
                      this.totalDashboardInfoObj.maintenance_Setup * 100 -
                      this.totalDashboardInfoObj.changeOverTime_CIP * 100 -
                      this.totalDashboardInfoObj.epl * 100 -
                      this.totalDashboardInfoObj.minorStoppage
                    ),
                    Math.ceil(
                      this.totalDashboardInfoObj.paid_Time -
                      this.totalDashboardInfoObj.maintenance_Setup * 100 -
                      this.totalDashboardInfoObj.changeOverTime_CIP * 100 -
                      this.totalDashboardInfoObj.epl * 100 -
                      this.totalDashboardInfoObj.minorStoppage -
                      this.totalDashboardInfoObj.setup_Time * 100
                    ),
                  ],
                },
                {
                  x: "lossTime",
                  fillColor: "#d72424",
                  y: [
                    Math.ceil(
                      this.totalDashboardInfoObj.paid_Time -
                      this.totalDashboardInfoObj.maintenance_Setup * 100 -
                      this.totalDashboardInfoObj.changeOverTime_CIP * 100 -
                      this.totalDashboardInfoObj.epl * 100 -
                      this.totalDashboardInfoObj.minorStoppage -
                      this.totalDashboardInfoObj.setup_Time * 100
                    ),
                    Math.ceil(
                      this.totalDashboardInfoObj.paid_Time -
                      this.totalDashboardInfoObj.maintenance_Setup * 100 -
                      this.totalDashboardInfoObj.changeOverTime_CIP * 100 -
                      this.totalDashboardInfoObj.epl * 100 -
                      this.totalDashboardInfoObj.minorStoppage -
                      this.totalDashboardInfoObj.setup_Time * 100 -
                      this.totalDashboardInfoObj.lossTime * 100
                    ),
                  ],
                },
                {
                  x: "OPL",
                  fillColor: "#d72424",
                  y: [
                    Math.ceil(
                      this.totalDashboardInfoObj.paid_Time -
                      this.totalDashboardInfoObj.maintenance_Setup * 100 -
                      this.totalDashboardInfoObj.changeOverTime_CIP * 100 -
                      this.totalDashboardInfoObj.epl * 100 -
                      this.totalDashboardInfoObj.minorStoppage -
                      this.totalDashboardInfoObj.setup_Time * 100 -
                      this.totalDashboardInfoObj.lossTime * 100
                    ),
                    Math.ceil(
                      this.totalDashboardInfoObj.paid_Time -
                      this.totalDashboardInfoObj.maintenance_Setup * 100 -
                      this.totalDashboardInfoObj.changeOverTime_CIP * 100 -
                      this.totalDashboardInfoObj.epl * 100 -
                      this.totalDashboardInfoObj.minorStoppage -
                      this.totalDashboardInfoObj.setup_Time * 100 -
                      this.totalDashboardInfoObj.lossTime * 100 -
                      this.totalDashboardInfoObj.opl * 100
                    ),
                  ],
                },
                {
                  x: "Sle",
                  fillColor: "#91c157",
                  y: [0, Math.ceil(this.totalDashboardInfoObj.sle * 100)],
                },
              ],
            },
          ];
        });
      });
    }
  }
  // Get Data From Api

  selectLocation(elem, id) {
    this.selectedLines = "";

    this.dashboardFilter.Factory = elem;

    this.dashboardService.getLinesFactories(id).subscribe((res) => {
      this.allLines = res;
    });
  }
  selectLine(elem) {
    this.dashboardFilter.LineID = elem ? elem : null;
  }
  shiftType(elem) {
    this.dashboardFilter.TimeType = elem ;
  }

  selectTime(element, formVal) {
    if (element == 0) {
      this.openShifts = false;
    }

    if (element == 3) {
      this.openDate = false;
    }

    if (element == 1 || element == 2 || element == 3) {
      this.showPickerMultiple = true;
      this.showPickerDay = false;
      this.selectedTimeShift = "";
      this.openShifts = true;
    } else if (element == 4) {
      this.showPickerMultiple = false;
      this.showPickerDay = true;
      this.calenderByDay = "";
      this.openShifts = false;
    }

    console.log(element);
    this.dashboardFilter.duration = element;
    if (element !== 3) {
      this.dashboardFilter.TimeType = 0;
      this.dashboardFilter.startDate = null;
      this.dashboardFilter.endDate = null;
    }
  }

  fromDate(event) {
    let date = new Date(event.value);
    let modifiedTime = date.toISOString()
    this.date1 = modifiedTime.replace('22:00:00.000Z', "").concat("00:00:00.000Z");
    this.dashboardFilter.startDate = this.date1
    console.log(this.dashboardFilter)

  }
  fromDate2(event) {
    let date = new Date(event.value);
    let modifiedTime = date.toISOString()
    this.date2 = modifiedTime.replace('22:00:00.000Z', "").concat("00:00:00.000Z");
    this.dashboardFilter.endDate = this.date2

  }

  fromDateByDay(event) {
    let myDate = new Date(event.target.value);
    myDate.setDate(myDate.getDate() + 1);
    this.dateByDay =
      myDate.toISOString().replace("22:00:00.000Z", "") + "00:00:00.000Z";
    console.log(this.dateByDay);
  }

  filter(event) {
    if (this.dashboardFilter.endDate && this.dashboardFilter.endDate.includes('T00:00:00.000Z00:00:00.000Z')) {
      this.dashboardFilter.endDate = this.date1
    }
    console.log("llll", this.dashboardFilter);
    if (this.dateByDay) {
      this.dashboardFilter.startDate = this.dateByDay;
      this.dashboardFilter.endDate = this.dateByDay;
    }
    this.dashboardService.getDashboard(this.dashboardFilter)
      .subscribe((res) => {
        if (res) {
          this.totalDashboardInfo = res;
          this.totalDashboardInfo.forEach((element) => {
            element.forEach((elem) => {
              this.totalDashboardInfoObj = elem;
              this.totalProduction = this.totalDashboardInfoObj.total_Production
              this.totalMaterial = this.totalDashboardInfoObj.total_Materials
            })
          })
          this.drawLossTree(res);
        }
      });

    this.dashboardService.getTimeLine(this.dashboardFilter).subscribe((res) => {
      if (res) {
        this.DrawTimeLine(res);
        ((res) => {
          if (res) {
            this.totalDashboardInfo = res;
            this.totalDashboardInfo.forEach((element) => {
              element.forEach((elem) => {
                this.totalDashboardInfoObj = elem;
                this.totalProduction = this.totalDashboardInfoObj.total_Production
                this.totalMaterial = this.totalDashboardInfoObj.total_Materials
              })
            })
            this.drawLossTree(res);
          }
        });

        this.dashboardService.getTimeLine(this.dashboardFilter).subscribe((res) => {
          if (res) {
          
            this.DrawTimeLine(res);
            this.data = res;
          }
        });
      }
    
     
    
    }) 
  }

  plantemptyValue() {
    this.dashboardFilter.LineID = null
  }
 

}
// done
