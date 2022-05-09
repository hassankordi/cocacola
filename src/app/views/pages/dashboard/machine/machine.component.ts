import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DashboardFilter } from "src/app/Shared/models/DashboardFilter";
import { DashboardService } from "../dashboard.service";

import { MachineStatusPopUp } from "./machine-status-pop-up/machine-status-pop-up.component"


@Component({
  selector: "app-machine",
  templateUrl: "./machine.component.html",
  styleUrls: ["./machine.component.scss"],
})
export class MachineComponent implements OnInit {
  dashboardFilter: DashboardFilter = new DashboardFilter();
  allLines: any = [];
  location: any = [];
  allMachines: any = [];
  blowMoulders: any = [];
  cartonizerShrink: any = [];
  dPalletizers: any = [];
  mixers: any = [];
  filler: any = [];
  palletizer: any = [];
  lineId: any;
  factoryId: any;
  timeStamp1: any;
  timeStamp2: any;
  timeStamp3: any;
  timeStamp4: any;
  timeStamp5: any;
  timeStamp6: any;
  state: any;
  status: any;
  state1: any;
  status1: any;
  state2: any;
  status2: any;
  state3: any;
  status3: any;
  state4: any;
  status4: any;
  state5: any;
  status5: any;
  state6: any;
  status6: any;
  blowMouldersKey = [];
  blowMouldersVal = [];
  DpalletizerKey = [];
  DpalletizerVal = [];
  mixersKey = [];
  mixersVal = [];
  fillerKey = [];
  fillerVal = [];
  functionlaityId  :any;
  cartonizerShrinkKey = [];
  cartonizerShrinkVal = [];
  machineFunctionlity : any = [];
  palletizerKey = [];
  palletizerVal = [];
  openLines = true;
  showGifImg = false
  disableSearch = false
  plantSelected : boolean = false
  lineSelected : boolean = false
  factory
  line;
  machine;
  startDate;
  FunctionlaityValue  :any
  endDate;
  openDialogBtn: boolean = false;
  machineDuration;
  lineName: any
  constructor(private dashboardService: DashboardService, public dialog: MatDialog, private datePipe: DatePipe) { }

  ngOnInit(): void {
    //Factories
    this.dashboardService.getFactories().subscribe((res) => {
      console.log(res);

      this.location = res;
      this.dashboardService
        .getLinesFactories(this.location[0].id)
        .subscribe((res) => {
          console.log("j", res);
          this.allLines = res;
        });
    });
    this.dashboardService.getMachineFunctionality().subscribe(res=>{
      this.machineFunctionlity = res
    })
  }
  
  selectLocation(elem, id) {
    this.line = ''
    this.lineId = undefined
    this.plantSelected = true
    this.FunctionlaityValue = ''
    this.dashboardFilter.LineID = undefined
    console.log("ok", elem);
    this.factoryId = id;
    console.log(this.factoryId);

    this.dashboardFilter.Factory = elem;

    this.dashboardService.getLinesFactories(id).subscribe((res) => {
      this.allLines = res;
      this.openLines = false
    });
  }
  selectLine(lineId) {
    this.lineSelected = true
    this.dashboardFilter.LineID = lineId;
    this.lineId = lineId;
    this.FunctionlaityValue = ''

    console.log(this.lineId);
    console.log(this.DpalletizerVal);

  }
  selectFunctionality(functionlityId) {
    this.functionlaityId = functionlityId
  }


  getAllMachines(event) {

    if(!this.functionlaityId) {
      alert("no")
      this.blowMouldersKey = []
      this.blowMouldersVal = []
      this.DpalletizerKey = []
      this.DpalletizerVal = []
      this.mixersKey = []
      this.mixersVal = []
      this.fillerKey = []
      this.fillerVal = []
      this.cartonizerShrinkKey = []
      this.cartonizerShrinkVal = []
      this.palletizerKey = []
      this.palletizerVal = []
      this.showGifImg = true
      this.disableSearch = true
      this.dashboardService.getAllMachines(this.factoryId, this.lineId).subscribe((res) => {


          if (res) {
            this.showGifImg = false
            this.disableSearch = false
          }
          this.allMachines = res[0];
          console.log("2", this.allMachines)
          console.log('heyyy', this.allMachines)
          this.blowMoulders = this.allMachines.blow_Moulders;

          this.blowMoulders.forEach((element) => {
            console.log("elment", element);
            this.timeStamp1 = element.timeStamp;
            this.state1 = element.state;
            this.status1 = element.status;
            this.blowMouldersKey.push(Object.keys(element));
            this.blowMouldersVal.push(Object.values(element));
          });
          console.log(this.blowMouldersVal);

          this.dPalletizers = this.allMachines.dPalletizers;
          this.dPalletizers.forEach((element) => {
            this.timeStamp2 = element.timeStamp;
            this.state2 = element.state;
            this.status2 = element.status;
            this.DpalletizerKey.push(Object.keys(element));
            this.DpalletizerVal.push(Object.values(element));
          });
          this.mixers = this.allMachines.mixers;
          this.mixers.forEach((element) => {
            console.log(element)
            this.timeStamp3 = element.timeStamp;
            this.state3 = element.state;
            this.status3 = element.status;
            this.mixersKey.push(Object.keys(element));
            this.mixersVal.push(Object.values(element));
          });
          this.filler = this.allMachines.fillers;
          this.filler.forEach((element) => {
            this.timeStamp4 = element.timeStamp;
            this.state4 = element.state;
            this.status4 = element.status;
            this.fillerKey.push(Object.keys(element));
            this.fillerVal.push(Object.values(element));
          });
          this.cartonizerShrink = this.allMachines.cartonizers_Shrinks;
          this.cartonizerShrink.forEach((element) => {
            this.timeStamp5 = element.timeStamp;
            this.state5 = element.state;
            this.status5 = element.status;
            this.cartonizerShrinkKey.push(Object.keys(element));
            this.cartonizerShrinkVal.push(Object.values(element));
          });
          this.palletizer = this.allMachines.palletizers;
          this.palletizer.forEach((element) => {
            console.log(element);
            this.timeStamp6 = element.timeStamp;
            this.state6 = element.state;
            console.log(this.state6);
            this.status6 = element.status;
            console.log(this.status6);

            this.palletizerKey.push(Object.keys(element));
            this.palletizerVal.push(Object.values(element));
          });
        });

    }

    if(this.functionlaityId) {
      alert("yes")
      this.dashboardService.getAllMachinesForFunctionality(this.functionlaityId).subscribe(res=>{
        this.blowMouldersKey = []
        this.blowMouldersVal = []
        this.DpalletizerKey = []
        this.DpalletizerVal = []
        this.mixersKey = []
        this.mixersVal = []
        this.fillerKey = []
        this.fillerVal = []
        this.cartonizerShrinkKey = []
        this.cartonizerShrinkVal = []
        this.palletizerKey = []
        this.palletizerVal = []
        this.showGifImg = true
        this.disableSearch = true
        if (res) {
          this.showGifImg = false
          this.disableSearch = false
        }
        this.allMachines = res[0];
        console.log("2", this.allMachines)
        console.log('heyyy', this.allMachines)
        this.blowMoulders = this.allMachines.blow_Moulders;

        this.blowMoulders.forEach((element) => {
          console.log("elment", element);
          this.timeStamp1 = element.timeStamp;
          this.state1 = element.state;
          this.status1 = element.status;
          this.blowMouldersKey.push(Object.keys(element));
          this.blowMouldersVal.push(Object.values(element));
        });
        console.log(this.blowMouldersVal);

        this.dPalletizers = this.allMachines.dPalletizers;
        this.dPalletizers.forEach((element) => {
          this.timeStamp2 = element.timeStamp;
          this.state2 = element.state;
          this.status2 = element.status;
          this.DpalletizerKey.push(Object.keys(element));
          this.DpalletizerVal.push(Object.values(element));
        });
        this.mixers = this.allMachines.mixers;
        this.mixers.forEach((element) => {
          console.log(element)
          this.timeStamp3 = element.timeStamp;
          this.state3 = element.state;
          this.status3 = element.status;
          this.mixersKey.push(Object.keys(element));
          this.mixersVal.push(Object.values(element));
        });
        this.filler = this.allMachines.fillers;
        this.filler.forEach((element) => {
          this.timeStamp4 = element.timeStamp;
          this.state4 = element.state;
          this.status4 = element.status;
          this.fillerKey.push(Object.keys(element));
          this.fillerVal.push(Object.values(element));
        });
        this.cartonizerShrink = this.allMachines.cartonizers_Shrinks;
        this.cartonizerShrink.forEach((element) => {
          this.timeStamp5 = element.timeStamp;
          this.state5 = element.state;
          this.status5 = element.status;
          this.cartonizerShrinkKey.push(Object.keys(element));
          this.cartonizerShrinkVal.push(Object.values(element));
        });
        this.palletizer = this.allMachines.palletizers;
        this.palletizer.forEach((element) => {
          console.log(element);
          this.timeStamp6 = element.timeStamp;
          this.state6 = element.state;
          console.log(this.state6);
          this.status6 = element.status;
          console.log(this.status6);

          this.palletizerKey.push(Object.keys(element));
          this.palletizerVal.push(Object.values(element));
        });
      })
    }

    event.stopPropagation()
  }
  plantLineNull() {
    this.plantSelected = false
    this.lineSelected = false
  }


  // hassan's code 

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
    }


  }
  // hassan will not use dashboard filter (interface) because (m4 mohem) in this componant
  // this fun takes elem on click and split his data in obj and send obj to get the graph
  selectMachineName(machine) {
    this.machine = machine
    console.log(machine);
    const obj = {
      machineId: machine[2],
      fun: machine[5],
      from: this.startDate,
      to: this.endDate
    }
    console.log(obj);

    this.dashboardService.getMachineHistoricalStatus(obj).subscribe((res) => {
      console.log(res);
      // send the graph data to the dialog 
      this.openDialog(res)

    }, (err) => {
      console.log(err);

    })

  }
 
  openDialog(data: any) {
    const dialogRef = this.dialog.open(MachineStatusPopUp, {
      data, height: '550px',
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


}
