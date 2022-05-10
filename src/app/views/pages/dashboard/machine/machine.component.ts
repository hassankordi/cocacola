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
  energy : any = []
  labelers : any = []
  signalBroker : any = []
  water : any = []
  lineId: any;
  factoryId: any;
  timeStamp1: any;
  timeStamp2: any;
  timeStamp3: any;
  timeStamp4: any;
  timeStamp5: any;
  timeStamp6: any;
  timeStamp7: any;
  timeStamp8: any;
  timeStamp9: any;
  timeStamp10: any;
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
  state7: any;
  state8: any;
  state9: any;
  state10: any;
  status5: any;
  state6: any;
  status6: any;
  status7: any;
  status8: any;
  status9: any;
  status10: any;

  blowMouldersKey = [];
  blowMouldersVal = [];
  DpalletizerKey = [];
  DpalletizerVal = [];
  mixersKey = [];
  mixersVal = [];
  fillerKey = [];
  fillerVal = [];
  energyKey : any = []
  energyVal : any = []
  labelersKey : any = []
  labelersVal : any = []
  signalBrokerKey : any = []
  signalBrokerVal : any = []
  waterKey : any = []
  waterVal : any = []
  functionlaityId  :any;
  cartonizerShrinkKey = [];
  cartonizerShrinkVal = [];
  machineFunctionlity : any = [];
  palletizerKey = [];
  palletizerVal = [];
  openLines = true;
  showGifImg = false
  disableSearch = false
  plantLineSelected : boolean = false
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
    this.plantLineSelected = true
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
      this.allMachines = []
      this.waterKey = []
      this.waterVal = []
      this.energyKey = []
      this.waterVal = []
      this.signalBrokerKey = []
      this.signalBrokerVal = []
      this.labelersKey = []
      this.labelersVal = []
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
        console.log("all",res)

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
           
            this.blowMouldersKey.push(Object.keys(element));
            this.blowMouldersVal.push(Object.values(element));
          });
          console.log(this.blowMouldersVal);

          this.dPalletizers = this.allMachines.dPalletizers;
          this.dPalletizers.forEach((element) => {
            this.timeStamp2 = element.timeStamp;
            
            this.DpalletizerKey.push(Object.keys(element));
            this.DpalletizerVal.push(Object.values(element));
          });
          this.mixers = this.allMachines.mixers;
          this.mixers.forEach((element) => {
            console.log(element)
            this.timeStamp3 = element.timeStamp;
            
            this.mixersKey.push(Object.keys(element));
            this.mixersVal.push(Object.values(element));
          });
          this.filler = this.allMachines.fillers;
          this.filler.forEach((element) => {
            this.timeStamp4 = element.timeStamp;
          
            this.fillerKey.push(Object.keys(element));
            this.fillerVal.push(Object.values(element));
          });
          this.cartonizerShrink = this.allMachines.cartonizers_Shrinks;
          this.cartonizerShrink.forEach((element) => {
            this.timeStamp5 = element.timeStamp;
            
            this.cartonizerShrinkKey.push(Object.keys(element));
            this.cartonizerShrinkVal.push(Object.values(element));
          });
          this.palletizer = this.allMachines.palletizers;
          this.palletizer.forEach((element) => {
            console.log(element);
            this.timeStamp6 = element.timeStamp;
          
            console.log(this.status6);

            this.palletizerKey.push(Object.keys(element));
            this.palletizerVal.push(Object.values(element));
          });
          this.energy = this.allMachines.energy
          this.energy.forEach(element => {
            this.timeStamp7 = element.timeStamp;
          
            this.energyKey.push(Object.keys(element))
            this.energyVal.push(Object.values(element))
          });
  
          this.labelers = this.allMachines.labelers
          this.labelers.forEach(element => {
            this.timeStamp8 = element.timeStamp;
           
            this.labelersKey.push(Object.keys(element))
            this.labelersVal.push(Object.values(element))
          });
          this.signalBroker = this.allMachines.signalBroker
          this.signalBroker.forEach(element => {
            this.timeStamp9 = element.timeStamp;
          
            this.signalBrokerKey.push(Object.keys(element))
            this.signalBrokerVal.push(Object.values(element))
          });
          this.water = this.allMachines.water
          this.water.forEach(element => {
            this.timeStamp10 = element.timeStamp;
           
            this.waterKey.push(Object.keys(element))
            this.waterVal.push(Object.values(element))
          });
        });

    }

    if(this.functionlaityId) {
      this.dashboardService.getAllMachinesForFunctionality(this.functionlaityId).subscribe(res=>{
        console.log("withline" , res)
        this.allMachines = []
       this.waterKey = []
      this.waterVal = []
      this.energyKey = []
      this.waterVal = []
      this.signalBrokerKey = []
      this.signalBrokerVal = []
      this.labelersKey = []
      this.labelersVal = []
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
         
          this.blowMouldersKey.push(Object.keys(element));
          this.blowMouldersVal.push(Object.values(element));
        });
        console.log(this.blowMouldersVal);

        this.dPalletizers = this.allMachines.dPalletizers;
        this.dPalletizers.forEach((element) => {
          this.timeStamp2 = element.timeStamp;
         
          this.DpalletizerKey.push(Object.keys(element));
          this.DpalletizerVal.push(Object.values(element));
        });
        this.mixers = this.allMachines.mixers;
        this.mixers.forEach((element) => {
          console.log(element)
          this.timeStamp3 = element.timeStamp;
     
          this.mixersKey.push(Object.keys(element));
          this.mixersVal.push(Object.values(element));
        });
        this.filler = this.allMachines.fillers;
        this.filler.forEach((element) => {
          this.timeStamp4 = element.timeStamp;
        
          this.fillerKey.push(Object.keys(element));
          this.fillerVal.push(Object.values(element));
        });
        this.cartonizerShrink = this.allMachines.cartonizers_Shrinks;
        this.cartonizerShrink.forEach((element) => {
          this.timeStamp5 = element.timeStamp;
       
          this.cartonizerShrinkKey.push(Object.keys(element));
          this.cartonizerShrinkVal.push(Object.values(element));
        });
        this.palletizer = this.allMachines.palletizers;
        this.palletizer.forEach((element) => {
          this.timeStamp6 = element.timeStamp;
        
          console.log(this.status6);

          this.palletizerKey.push(Object.keys(element));
          this.palletizerVal.push(Object.values(element));
        });
        this.energy = this.allMachines.energy
        this.energy.forEach(element => {
          this.timeStamp7 = element.timeStamp;
       
          this.energyKey.push(Object.keys(element))
          this.energyVal.push(Object.values(element))
        });

        this.labelers = this.allMachines.labelers
        this.labelers.forEach(element => {
          this.timeStamp8 = element.timeStamp;
        
          this.labelersKey.push(Object.keys(element))
          this.labelersVal.push(Object.values(element))
        });
        this.signalBroker = this.allMachines.signalBroker
        this.signalBroker.forEach(element => {
          this.timeStamp9 = element.timeStamp;
         
          this.signalBrokerKey.push(Object.keys(element))
          this.signalBrokerVal.push(Object.values(element))

        
        });
        this.water = this.allMachines.water
        this.water.forEach(element => {
          this.timeStamp10 = element.timeStamp;
   
          this.waterKey.push(Object.keys(element))
          this.waterVal.push(Object.values(element))
        });
      })
    }


   
  }
  plantLineNull() {
    this.plantLineSelected = true
    this.openLines = true
    this.line = ''
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


  // this machine array has a problem if ouda change machine index (add any new property)
  selectMachineName(machine) {
    this.machine = machine
    console.log(machine);
    const obj = {
      machineId: machine[2],
      fun: machine[6],
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
