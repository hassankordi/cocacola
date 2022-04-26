import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardFilter } from 'src/app/Shared/models/DashboardFilter';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-product-plan-popup',
  templateUrl: './product-plan-popup.component.html',
  styleUrls: ['./product-plan-popup.component.scss']
})
export class ProductPlanPopupComponent implements OnInit {
  selected:any ;
  location : any = [];
  allLines : any = [];
  allMachines  :any = [];
  lineNumber:any;
  skuArr : any = [];
  allShifts  :any = []
  calenderPlanDate  :any ;
  hideOpt  = true ;
  hideOpt2 = true ;
  hideOpt3 = true;
  hideOpt6 = true
  hideOpt5 = true
  locationName
  factoryName
  lineName
  lineNum
  technicalSKUVar
  shiftNumber
  shiftTime
  skuId
  dashboardFilter : DashboardFilter = new DashboardFilter()
  openLines_Shift = true
  openAddBtnInFactory = true
  openMachine = true
  machineNameVar
  machine
  targetInp: any;

  constructor( private dashboardService : DashboardService, @Inject(MAT_DIALOG_DATA) public readonly data: any ,  public dialogRef: MatDialogRef<any> , private snackBar: MatSnackBar) { }

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
         
    console.log(this.data)
   
  }

   // event of calender
   calenderPlan(event) {
    if (event) {
      let myDate = new Date(event);
      myDate.setDate(myDate.getDate() + 1);
      this.calenderPlanDate = myDate.toISOString().replace("T22:00:00.000Z", "");
      console.log(this.calenderPlanDate)
   
    }
  }
       // location and Lines of the factory
       selectLocation(elem, id, locationName) {

        this.data.lineName = null
        this.lineName = null


        this.locationName = locationName;
        this.factoryName = elem;
        console.log(this.factoryName , "iiiiiiiiiiiiiiiii")
         this.factoryName
    
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

       // get SKU
  techSKU(technicalSKU , skuid) {
    this.technicalSKUVar = technicalSKU;
    console.log(this.technicalSKUVar);
    
  }

  // shift click
  selectShift(shiftNum, startShiftTime) {
    console.log(shiftNum, "ok");
    this.shiftNumber = shiftNum;
    this.shiftTime = startShiftTime;
    console.log(this.shiftTime)
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
  hideOption6Product() {
    this.hideOpt6 = false
  }
  hideOption5Shift() {
    this.hideOpt5 = false
  }

  submitForm(formValue , content, action, duration) {

 
  console.log(formValue)

  let dateShift;
    if(this.calenderPlanDate && this.shiftTime) {
      dateShift = this.calenderPlanDate + '' +  this.shiftTime.slice(10);
    }else if(this.calenderPlanDate) {
      dateShift = this.calenderPlanDate + '' + this.data.shiftStartTime.slice(10);
    }else if(this.shiftTime) {
      dateShift = this.data.shiftStartTime.slice(0,10) + '' + this.shiftTime.slice(10);
    }else {
      dateShift = this.data.shiftStartTime
    }


     let modifiedObj = {
       factory : this.factoryName ? this.factoryName : this.data.factory,
       line : this.lineNum ? this.lineNum : this.data.line,
       id : this.data.id,
       machine : this.machineNameVar  ? this.machineNameVar : this.data.machine,
       sku : this.technicalSKUVar ? this.technicalSKUVar : this.data.technicalSKU,
       shiftStartTime : dateShift,
       target : formValue.controls.target.value ? formValue.controls.target.value : this.data.target
      }
      console.log(modifiedObj)
      this.dashboardService.editPlanShiftMaterialConsumptions(modifiedObj.id , modifiedObj).subscribe()
      this.snackBar.open(content, action, {
        duration: 6000,
        verticalPosition: "top", // Allowed values are  'top' | 'bottom'
        horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
      });
      this.dialogRef.close()
    
 }
}


