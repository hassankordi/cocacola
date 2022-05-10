import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit , AfterViewInit {
  // showGifImg: any = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  tableGridData  :any
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    "Machine",
    "Off Line Duration",
    "Time",
   
  ];
  
  constructor(private dashboardService : DashboardService) { }
  

  ngOnInit(): void {
    
    this.dashboardService.getOffMachine().subscribe(res=>{
      this.dataSource.data = res
      // this.showGifImg = false

    })
  
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

 

}
