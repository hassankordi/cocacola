import { Component, Inject, OnInit } from '@angular/core';
import {  } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardFilter } from 'src/app/Shared/models/DashboardFilter';
import { DashboardService } from '../../dashboard.service';



@Component({
  selector: 'app-edit-table-popup',
  templateUrl: './edit-table-popup.component.html',
  styleUrls: ['./edit-table-popup.component.scss']
})
export class EditTablePopupComponent implements OnInit {
  date2?: any = [];
  selected: Date | null;
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
  lineNum:any;
  reasonval  :any;
  hideOpt = true
  hideOpt2 = true
  hideOpt3 = true
  hideOpt4 = true
  hideOpt5 = true
  closeCalender = false;
  openSubReason = true
 
  // main reasons dropDown Array

  constructor(private dashboardService : DashboardService ,  @Inject(MAT_DIALOG_DATA) public readonly data: any ,  public dialogRef: MatDialogRef<any> , private snackBar: MatSnackBar ) { }
  MainReason = [
    { name: "Change Over", value: 1 },
    { name: "Down Time", value: 2 },
    { name: "Non Scheduled Time Line", value: 3 },
    { name: "Norms", value: 4 },
    { name: "Process Skip", value: 5 },
    { name: "Reduced Speed", value: 6 },
    { name: "Scheduled Maintenance Down Time", value: 7 },
  ];

  ngOnInit(): void {   
    console.log(this.data)
    this.dashboardService.getFactories().subscribe((res) => {
      this.location = res;
      this.dashboardService
        //  get factory lines in the first time
        .getLinesFactories(this.location[0].id)
        .subscribe((res) => {
          this.allLines = res;
        });
    });
         
    this.MainReason.forEach(elem=>{
      this.reasonval = elem.value

    })
  }

 

     // location and Lines of the factory
  selectLocation(elem, id, locationName) {
    this.locationName = locationName;
    this.factoryName = elem;
    this.data.lineName = null
    this.lineName = null
    

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
    this.machine = null
    this.data.machineName = null
    this.lineName = lineNam;
    this.lineNum = lineNum
    console.log(this.lineNum)
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
  }

  // event of calender
  CalenderDate(event) {
    if (event) {
      let myDate = new Date(event);
      myDate.setDate(myDate.getDate() + 1);
      this.calenderEventToTable = myDate.toISOString().replace("T22", "T00");
      this.datePicker = myDate.toISOString().replace("22:00:00.000Z", "");
      console.log(this.datePicker);

      this.openAddBtnInDate = false;
    }
  }

  // time picker 1
  timePicker1(event) {
   
    let date = new Date(event);
    let modifiedTime = date.toLocaleTimeString("en-GB");
    this.getTime1 = modifiedTime.concat(".000Z");
    console.log(this.getTime1);
    this.closeCalender = true
  }

  // time picker 2
  timePicker2(event) {
    let date = new Date(event);
    let modifiedTime2 = date.toLocaleTimeString("en-GB");
    this.getTime2 = modifiedTime2.concat(".000Z");
   console.log(this.getTime2)
  }

  // main reason
  sendMainReasonValue(value, mainReasonName) {
   this.subReasonName = null
   this.data.subReason = null
    this.openSubReason = false;
    this.mainReasonName = mainReasonName;
    console.log(this.mainReasonName)
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
  subReasonClick(reasonVal , subReasonName) {
    this.subReasonName = subReasonName
    this.reasonValue = reasonVal;
    console.log('this.reasonValue' , this.reasonValue)
    this.openAddBtnInSubReason = false;
  }
   
  hideOption1Location() {
    this.hideOpt = false
  }
  hideOption2Line() {
    this.hideOpt2 = false
  }
  hideOption3Machine() {
    this.hideOpt3 = false
  }
  hideOption4MainReason() {
    this.hideOpt4 = false
  }
  hideOption5SubReason() {
    this.hideOpt5 = false
  }
  
  submitForm(formvalue , content, action, duration) {
  
    let startTimeValue = formvalue.controls.startTime.value

    let date = new Date(startTimeValue);
    let modifiedTime = date.toLocaleTimeString("en-GB");
    let concatFormatTime = modifiedTime.concat(".000Z");
    console.log(concatFormatTime)
   
    let endTimeValue = formvalue.controls.endTime.value
    let date2 = new Date(endTimeValue);
    let modifiedTime2 = date2.toLocaleTimeString("en-GB");
    let concatFormatTime2 = modifiedTime2.concat(".000Z");
    console.log(concatFormatTime2)
   
   if(this.datePicker && concatFormatTime) {
     var startTimeWithDate = this.datePicker + concatFormatTime
   }
   
   if(this.datePicker && concatFormatTime2) {
     var endTimeWithDate = this.datePicker + concatFormatTime2
   }
   



   let modifiedObj = {
            endTime : endTimeWithDate ? endTimeWithDate : this.data.endTime,
            line : this.lineNum ? this.lineNum : this.data.line,
            factory : this.factoryName ? this.factoryName : this.data.factory,
            machine : this.machineNameVar  ? this.machineNameVar : this.data.machine,
            startTime : startTimeWithDate ? startTimeWithDate : this.data.startTime,
            reason : formvalue.controls.reason.value,
            shiftStartTime : startTimeWithDate ? startTimeWithDate : this.data.startTime,
            changeOverType : this.reasonValue ? this.reasonValue : this.data.subReasonNumber
           }

          console.log(modifiedObj)

      


 //  start post
 
 
      if (modifiedObj.reason == 'Change Over') {
        let modifiedObj = {
          endTime : endTimeWithDate ? endTimeWithDate : this.data.endTime,
          line : this.lineNum ? this.lineNum : this.data.line,
          factory : this.factoryName ? this.factoryName : this.data.factory,
          machine : this.machineNameVar  ? this.machineNameVar : this.data.machine,
          startTime : startTimeWithDate ? startTimeWithDate : this.data.startTime,
          reason : formvalue.controls.reason.value,
          shiftStartTime : startTimeWithDate ? startTimeWithDate : this.data.startTime,
          changeOverType : this.reasonValue ? this.reasonValue : this.data.subReasonNumber
        }
        console.log("ob", modifiedObj);
        this.dashboardService
          .postChangeOverPlanning( modifiedObj)
          .subscribe((res) => {
            console.log("1", res);
          });
      } 
      if(modifiedObj.reason == 'Change Over'){
          this.dashboardService.deleteChangeOverPlanning(this.data.id).subscribe(res=>{
            console.log(res)
          })
        }
      if (modifiedObj.reason == 'Down Time') {
       let modifiedObj = {
        endTime : endTimeWithDate ? endTimeWithDate : this.data.endTime,
            line : this.lineNum ? this.lineNum : this.data.line,
            factory : this.factoryName ? this.factoryName : this.data.factory,
            machine : this.machineNameVar  ? this.machineNameVar : this.data.machine,
            startTime : startTimeWithDate ? startTimeWithDate : this.data.startTime,
            reason : formvalue.controls.reason.value,
            shiftStartTime : startTimeWithDate ? startTimeWithDate : this.data.startTime,
        downTime : this.reasonValue ? this.reasonValue : this.data.subReasonNumber
       }
    console.log('2' , modifiedObj)
       this.dashboardService
         .postDownTimePlanning(modifiedObj)
         .subscribe((res) => {
           console.log("2", res);
         });
     } 
     if(modifiedObj.reason == 'Down Time') {
          this.dashboardService.deleteDownTimePlanning(this.data.id).subscribe()
      }

     if (modifiedObj.reason == 'Non_Schedualed Down Time') {
       let modifiedObj = {
        endTime : endTimeWithDate ? endTimeWithDate : this.data.endTime,
            line : this.lineNum ? this.lineNum : this.data.line,
            factory : this.factoryName ? this.factoryName : this.data.factory,
            machine : this.machineNameVar  ? this.machineNameVar : this.data.machine,
            startTime : startTimeWithDate ? startTimeWithDate : this.data.startTime,
            reason : formvalue.controls.reason.value,
            shiftStartTime : startTimeWithDate ? startTimeWithDate : this.data.startTime,
        nonSchedualedDownTimeType : this.reasonValue ? this.reasonValue : this.data.subReasonNumber
       }
  
       console.log("3", modifiedObj);
       this.dashboardService
         .postNonScheduledDownTimes(modifiedObj)
         .subscribe((res) => {
           console.log("3", res);
         });
     } 
     if(modifiedObj.reason == 'Non_Schedualed Down Time') {
          this.dashboardService.deleteNonScheduledDownTimes(this.data.id).subscribe()
        }
      if (modifiedObj.reason  ==  'Norms') {
       let modifiedObj = {
        endTime : endTimeWithDate ? endTimeWithDate : this.data.endTime,
        line : this.lineNum ? this.lineNum : this.data.line,
        factory : this.factoryName ? this.factoryName : this.data.factory,
        machine : this.machineNameVar  ? this.machineNameVar : this.data.machine,
        startTime : startTimeWithDate ? startTimeWithDate : this.data.startTime,
        reason : formvalue.controls.reason.value,
        shiftStartTime : startTimeWithDate ? startTimeWithDate : this.data.startTime,
        norms : this.reasonValue ? this.reasonValue : this.data.subReasonNumber
       }
       console.log('4' , modifiedObj)
  
       this.dashboardService
         .postNormsPlanning(modifiedObj)
         .subscribe((res) => {
           console.log("4", res);
         });
     }
     if(modifiedObj.reason  ==  'Norms') {
          this.dashboardService.deleteNormsPlanning(this.data.id).subscribe()
        }

     if (modifiedObj.reason ==  'Process Skip') {
        let modifiedObj = {
          endTime : endTimeWithDate ? endTimeWithDate : this.data.endTime,
            line : this.lineNum ? this.lineNum : this.data.line,
            factory : this.factoryName ? this.factoryName : this.data.factory,
            machine : this.machineNameVar  ? this.machineNameVar : this.data.machine,
            startTime : startTimeWithDate ? startTimeWithDate : this.data.startTime,
            reason : formvalue.controls.reason.value,
            shiftStartTime : startTimeWithDate ? startTimeWithDate : this.data.startTime,
         processSkipType : this.reasonValue ? this.reasonValue : this.data.subReasonNumber
        }
        console.log('5' , modifiedObj)
  
  
        this.dashboardService
          .postProcess_Skip_Planning(modifiedObj)
          .subscribe((res) => {
            console.log("5", res);
          });
      } 
      if(modifiedObj.reason ==  'Process Skip') {
            this.dashboardService.deleteProcess_Skip_Planning(this.data.id).subscribe()
         }
       if (modifiedObj.reason  == ' Reduced Speed') { 
  
       let modifiedObj = {
        endTime : endTimeWithDate ? endTimeWithDate : this.data.endTime,
        line : this.lineNum ? this.lineNum : this.data.line,
        factory : this.factoryName ? this.factoryName : this.data.factory,
        machine : this.machineNameVar  ? this.machineNameVar : this.data.machine,
        startTime : startTimeWithDate ? startTimeWithDate : this.data.startTime,
        reason : formvalue.controls.reason.value,
        shiftStartTime : startTimeWithDate ? startTimeWithDate : this.data.startTime,
        reducedSpeed : this.reasonValue ? this.reasonValue : this.data.subReasonNumber
       }
       console.log('5' , modifiedObj)
  
       this.dashboardService
         .postReduced_Speed_Planning(modifiedObj)
         .subscribe((res) => {
           console.log("6", res);
         });
     } 
     if(modifiedObj.reason  == 'Reduced Speed') {
          this.dashboardService.deleteReduced_Speed_Planning(this.data.id).subscribe()
      }
      if (modifiedObj.reason == 'Scheduled Maintenance Down Time') {
        let modifiedObj = {
         endTime : endTimeWithDate ? endTimeWithDate : this.data.endTime,
            line : this.lineNum ? this.lineNum : this.data.line,
            factory : this.factoryName ? this.factoryName : this.data.factory,
            machine : this.machineNameVar  ? this.machineNameVar : this.data.machine,
            startTime : startTimeWithDate ? startTimeWithDate : this.data.startTime,
            reason : formvalue.controls.reason.value,
            shiftStartTime : startTimeWithDate ? startTimeWithDate : this.data.startTime,
         schedualedMaintenanceDownTimeType : this.reasonValue ? this.reasonValue : this.data.subReasonNumber
        }
        console.log('7' , modifiedObj)
  
        this.dashboardService
          .postScheduledMaintenanceDownTimes(modifiedObj)
          .subscribe((res) => {
            console.log("7", res);
          });
      }       
  
      if(modifiedObj.reason == 'Schedualed Maintenance Down Time') {
            this.dashboardService.deleteScheduledMaintenanceDownTimes(this.data.id).subscribe()
          }
 
           this.snackBar.open(content, action, {
             duration: 3000,
             verticalPosition: "top", // Allowed values are  'top' | 'bottom'
             horizontalPosition: "right" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
           });
             
  this.dialogRef.close(modifiedObj)
  }
}
 




