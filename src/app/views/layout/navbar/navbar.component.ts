import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../../pages/dashboard/dashboard.service';
import { SignalRService } from 'src/app/signal-r.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  todayDate:any = new Date();
  notifiData  : any;
  modifyNotifiData  : any = []
  constructor(
 
    @Inject(DOCUMENT) private document: Document, 
    private renderer: Renderer2,
    private router: Router,
    private dashService : DashboardService,
    private signalRService : SignalRService
   
  ) { }

  ngOnInit(): void {
    
    this.dashService.getNotifications().subscribe(res=>{
      console.log(res)
      this.notifiData = res[0]
      this.modifyNotifiData = [...this.notifiData?.blow_Moulders , ...this.notifiData?.cartonizers_Shrinks , ...this.notifiData?.dPalletizers , ...this.notifiData?.energy , ...this.notifiData?.fillers , ...this.notifiData?.mixers , ...this.notifiData?. palletizers ,...this.notifiData?.signalBroker , ...this.notifiData?.water ] 

    }) 
    


    this.signalRService.startConnection()
    this.signalRService.hubConnection.on("sendNotification" , data=>{
    this.notifiData = data[0]
    this.modifyNotifiData = [...this.notifiData.blow_Moulders , ...this.notifiData.cartonizers_Shrinks , ...this.notifiData.  dPalletizers , ...this.notifiData.energy , ...this.notifiData.fillers , ...this.notifiData.mixers , ...this.notifiData. palletizers ,...this.notifiData.signalBroker , ...this.notifiData.water ]   
    console.log("noti", this.modifyNotifiData)
    })

  }

  
//   <div class="row">
//   <div class="col-12">
//    <div class="col-12 row" *ngFor="let elem of modifyNotifiData">
     
//      <div class="col-md-4">
//        {{elem.machine}}
//      </div>
//      <div class="col-md-4">
//        {{elem.timeStamp | date:'short'}}
//      </div>
//      <div class="col-md-4">
//        {{elem.status}}
//      </div>
  
//  </div>
  
//   </div>
// </div>

// <i class="link-icon feather icon-bell"></i>
// <div class="indicator">
//   <div class="circle"></div>
// </div>
   // Sidebar toggle on hamburger button click
   
  toggleSidebar(e) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  /**
   * Logout
   */
  onLogout(e) {
    e.preventDefault();
    localStorage.removeItem('isLoggedin');

    if (!localStorage.getItem('isLoggedin')) {
      this.router.navigate(['/auth/login']);
    }
  }
  toggleDiv() {

  }

}
