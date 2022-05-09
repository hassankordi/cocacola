import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { DashboardFilter } from "src/app/Shared/models/DashboardFilter";
import { environment } from "src/environments/environment.prod";
export interface tableData {
  changeOverType?: any;
  downTime?: any;
  nonSchedualedDownTimeType?: any;
  norms?: any;
  processSkipType?: any;
  reducedSpeed?: any;
  endTime?: any;
  MainReason?: any;
  SubReason?: any;
  schedualedMaintenanceDownTimeType?: any;
  factory?: any;
  id?: any;
  line?: any;
  machine?: any;
  shiftStartTime?: any;
  startTime?: any;
}

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(private http: HttpClient) {}

  sendDashboardNoti = new Subject();
  sendDashboardNotiAsync = this.sendDashboardNoti.asObservable()

  getNotifications() {
    return this.http.get(environment.sourceUrl + '/Machines/Notification')
  }

  getFactories() {
    return this.http.get(environment.sourceUrl + "/Factories/");
  }
  getLinesFactories(factId) {
   
    console.log(environment.sourceUrl + "/Navigation/LinesOfFactory/" + factId);
    
    return this.http.get(
      environment.sourceUrl + "/Navigation/LinesOfFactory/" + factId
    );
  }
  getMachineIndIndicator(data){
    // /api/Machines/MachineIndIndicator
   if((data.factory !== null) && (data.line !== 0) && (data.machineId !== null) && (data.start !== null) && (data.end !== null) ) {
      return this.http.get(
        environment.sourceUrl + `/Machines/MachineIndIndicator?factory=${data.factory}&line=${data.line}&machineid=${data.machineId}&From=${data.start}&To=${data.end}` 
      );
    }else if(data.factory !== null && data.start !== null && data.end !== null) {
      return this.http.get(
        environment.sourceUrl + `/Machines/MachineIndIndicator?factory=${data.factory}&From=${data.start}&To=${data.end}` 
      );
    }
   
  }
  getMachinesofLines(LineId) {
    return this.http.get(
      environment.sourceUrl + "/Navigation/MachinesOfLines/" + LineId
    );
  }
  getMachineHistoricalStatus(data) {

    return this.http.get(
      environment.sourceUrl + 
      `/Machines/MachinesHistoricalSate?Functionality=${data.fun}&machineid=${data.machineId}&From=${data.from}&To=${data.to}` 
    );
  }
  getMachinePlan(id) {
    return this.http.get(
      environment.sourceUrl + `/Machines/GetPlcMachinesByLineID?lineid=${id}`
    );
  }
  getShiftsPlan(id) {
    return this.http.get(
      environment.sourceUrl +
        `/PlanShifts/GetPlanShiftsByFactoryID?factoryid=${id}`
    );
  }

  getChangeOverPlanning() {
    return this.http.get(
      environment.sourceUrl + `/ChangeOver_Planning/GetChangeOver_Types`
    );
  }
  postChangeOverPlanning(obj) {
    return this.http.post(environment.sourceUrl + `/ChangeOver_Planning`, obj);
  }
  putChangeOverPlanning(id, obj) {
    return this.http.put(
      environment.sourceUrl + `/ChangeOver_Planning/${id}`,
      obj
    );
  }

  deleteChangeOverPlanning(id) {
    return this.http.delete(
      environment.sourceUrl + `/ChangeOver_Planning/${id}`
    );
  }

  getDownTimePlanning() {
    return this.http.get(
      environment.sourceUrl + `/DownTimePlanning/GetDownTimeTypes`
    );
  }
  postDownTimePlanning(obj) {
    return this.http.post(environment.sourceUrl + `/DownTimePlanning`, obj);
  }
  putDownTimePlanning(id, obj) {
    return this.http.put(
      environment.sourceUrl + `/DownTimePlanning/${id}`,
      obj
    );
  }
  deleteDownTimePlanning(id) {
    return this.http.delete(environment.sourceUrl + `/DownTimePlanning/${id}`);
  }

  getNonScheduledDownTimes() {
    return this.http.get(
      environment.sourceUrl +
        `/NonScheduledDownTimes/GetNonScheduledDownTimesTypes`
    );
  }
  postNonScheduledDownTimes(obj) {
    return this.http.post(
      environment.sourceUrl + `/NonScheduledDownTimes`,
      obj
    );
  }
  putNonScheduledDownTimes(id, obj) {
    return this.http.put(
      environment.sourceUrl + `/NonScheduledDownTimes/${id}`,
      obj
    );
  }
  deleteNonScheduledDownTimes(id) {
    return this.http.delete(
      environment.sourceUrl + `/NonScheduledDownTimes/${id}`
    );
  }

  getNormsPlanning() {
    return this.http.get(
      environment.sourceUrl + `/Norms_Planning/GetNormsTypes`
    );
  }
  postNormsPlanning(obj) {
    return this.http.post(environment.sourceUrl + `/Norms_Planning`, obj);
  }
  putNormsPlanning(id, obj) {
    return this.http.put(environment.sourceUrl + `/Norms_Planning/${id}`, obj);
  }
  deleteNormsPlanning(id) {
    return this.http.delete(environment.sourceUrl + `/Norms_Planning/${id}`);
  }

  getScheduledMaintenanceDownTimes() {
    return this.http.get(
      environment.sourceUrl +
        `/ScheduledMaintenanceDownTimes/GetScheduledMaintenanceDownTimesTtypes`
    );
  }
  postScheduledMaintenanceDownTimes(obj) {
    return this.http.post(
      environment.sourceUrl + `/ScheduledMaintenanceDownTimes`,
      obj
    );
  }
  putScheduledMaintenanceDownTimes(id, obj) {
    return this.http.put(
      environment.sourceUrl + `/ScheduledMaintenanceDownTimes/${id}`,
      obj
    );
  }
  deleteScheduledMaintenanceDownTimes(id) {
    return this.http.delete(
      environment.sourceUrl + `/ScheduledMaintenanceDownTimes/${id}`
    );
  }

  getProcess_Skip_Planning() {
    return this.http.get(
      environment.sourceUrl + `/Process_Skip_Planning/GetProcess_SkipTypes`
    );
  }
  postProcess_Skip_Planning(obj) {
    return this.http.post(
      environment.sourceUrl + `/Process_Skip_Planning`,
      obj
    );
  }
  putProcess_Skip_Planning(id, obj) {
    return this.http.put(
      environment.sourceUrl + `/Process_Skip_Planning/${id}`,
      obj
    );
  }
  deleteProcess_Skip_Planning(id) {
    return this.http.delete(
      environment.sourceUrl + `/Process_Skip_Planning/${id}`
    );
  }

  postReduced_Speed_Planning(obj) {
    return this.http.post(
      environment.sourceUrl + `/Reduced_Speed_Planning`,
      obj
    );
  }
  putReduced_Speed_Planning(id, obj) {
    return this.http.put(
      environment.sourceUrl + `/Reduced_Speed_Planning/${id}`,
      obj
    );
  }
  deleteReduced_Speed_Planning(id) {
    return this.http.delete(
      environment.sourceUrl + `/Reduced_Speed_Planning/${id}`
    );
  }

  getGridplanTableData(date) {
    return this.http.get<tableData[]>(
      environment.sourceUrl +
        `/DownTimePlanning/GetAllDownTypesInSpecficDay?date=${date}`
    );
  }

  getSku(factory, line) {
    return this.http.get<any>(
      environment.sourceUrl +
        `/SKUs/GetSKUsByFactoryLine?factory=${factory}&line=${line}`
    );
  }

  PlanShiftMaterialConsumptions(obj) {
    return this.http.post(
      environment.sourceUrl + `/PlanShiftMaterialConsumptions`,
      obj
    );
  }
  deletePlanShiftMaterialConsumptions(id) {
    return this.http.delete(
      environment.sourceUrl + `/PlanShiftMaterialConsumptions/${id}`
    );
  }
  editPlanShiftMaterialConsumptions(id, obj) {
    return this.http.put(
      environment.sourceUrl + `/PlanShiftMaterialConsumptions/${id}`,
      obj
    );
  }

  getPlanShiftMaterialConsumptions(date) {
    return this.http.get<any>(
      environment.sourceUrl +
        `/PlanShiftMaterialConsumptions/GetPlanShiftMaterialConsumptionsBySpecificDate?date=${date}`
    );
  }

  getTimeLine(filter: DashboardFilter) {
    // 
    if (filter.LineID == null &&filter.startDate == null &&filter.endDate == null) {
      if (filter.duration != null) {
        var url = `/LineKPIs/GetTimeline?Factory=${filter.Factory}&timetype=${filter.TimeType}&Duration=${filter.duration}`;
      } else if (filter.duration !== null && filter.LineID !== null) {
        var url = `/LineKPIs/GetTimeline?Factory=${filter.Factory}&LineNum=${filter.LineID}`;
      } else {
        var url = `/LineKPIs/GetTimeline?Factory=${filter.Factory}&timetype=${filter.TimeType}`;
      }
    } else if (
      filter.startDate != null &&
      filter.endDate != null &&
      filter.LineID != null
    ) {
      console.log("working");
      var url = `/LineKPIs/GetTimeline?Factory=${filter.Factory}&LineNum=${filter.LineID}&timetype=${filter.TimeType}&StartTime=${filter.startDate}&EndTime=${filter.endDate}`;
    } else if (
      filter.startDate != null &&
      filter.endDate != null &&
      filter.LineID == null
    ) {
      console.log("not working");
      var url = `/LineKPIs/GetTimeline?Factory=${filter.Factory}&timetype=${filter.TimeType}&StartTime=${filter.startDate}&EndTime=${filter.endDate}`;
    } else if (
      filter.startDate == null &&
      filter.endDate == null &&
      filter.LineID != null
    ) {
      if (filter.duration !== null && filter.TimeType !== null) {
        var url = `/LineKPIs/GetTimeline?Factory=${filter.Factory}&LineNum=${filter.LineID}&timetype=${filter.TimeType}&Duration=${filter.duration}`;
      } else {
        var url = `/LineKPIs/GetTimeline?Factory=${filter.Factory}&LineNum=${filter.LineID}&timetype=${filter.TimeType}`;
      }
    }
    console.log(filter);
    return this.http.get<any>(environment.sourceUrl + url, this.httpOptions);





    // 
    // if (filter.LineID != null) {
    //   var url = `/LineKPIs/GetTimeline?Factory=${filter.Factory}&LineID=${filter.LineID}`;
    // } else {
    //   var url = `/LineKPIs/GetTimeline?Factory=${filter.Factory}`;
    // }

    // return this.http.get<any>(environment.sourceUrl + url, this.httpOptions);
  }
  /*--------------------------HttpErrorHandler----------------------- */
  errorHandler(error: HttpErrorResponse) {
    console.log(error);
    return Observable.throw(error.status || "Server Error");
  }

  getDashboard(filter: DashboardFilter) {
    if (filter.LineID == null &&filter.startDate == null &&filter.endDate == null) {
      if (filter.duration != null) {
        var url = `/LineKPIs/GetData?Factory=${filter.Factory}&timetype=${filter.TimeType}&Duration=${filter.duration}`;
      } else if (filter.duration !== null && filter.LineID !== null) {
        var url = `/LineKPIs/GetData?Factory=${filter.Factory}&LineNum=${filter.LineID}`;
      } else {
        var url = `/LineKPIs/GetData?Factory=${filter.Factory}&timetype=${filter.TimeType}`;
      }
    } else if (
      filter.startDate != null &&
      filter.endDate != null &&
      filter.LineID != null
    ) {
      console.log("working");
      var url = `/LineKPIs/GetData?Factory=${filter.Factory}&LineNum=${filter.LineID}&timetype=${filter.TimeType}&StartTime=${filter.startDate}&EndTime=${filter.endDate}`;
    } else if (
      filter.startDate != null &&
      filter.endDate != null &&
      filter.LineID == null
    ) {
      console.log("not working");
      var url = `/LineKPIs/GetData?Factory=${filter.Factory}&timetype=${filter.TimeType}&StartTime=${filter.startDate}&EndTime=${filter.endDate}`;
    } else if (
      filter.startDate == null &&
      filter.endDate == null &&
      filter.LineID != null
    ) {
      if (filter.duration !== null && filter.TimeType !== null) {
        var url = `/LineKPIs/GetData?Factory=${filter.Factory}&LineNum=${filter.LineID}&timetype=${filter.TimeType}&Duration=${filter.duration}`;
      } else {
        var url = `/LineKPIs/GetData?Factory=${filter.Factory}&LineNum=${filter.LineID}&timetype=${filter.TimeType}`;
      }
    }
    console.log(filter);
    return this.http.get<any>(environment.sourceUrl + url, this.httpOptions);
  }

  getMachineList() {
    return this.http.get<any[]>(environment.sourceUrl + "/machines");
  }
  getFunctionsList() {
    return this.http.get<any[]>(environment.sourceUrl + "/functions");
  }

  getAllMachines(factoryId, lineId) {
    if (factoryId !== undefined && lineId !== undefined) {
      return this.http.get<any[]>(
        environment.sourceUrl +
          `/Machines/MachinesStatus?factoryID=${factoryId}&lineID=${lineId}`
      );
    } else if (lineId == undefined) {
      return this.http.get<any[]>(
        environment.sourceUrl +
          `/Machines/MachinesStatus?factoryID=${factoryId}`
      );
    }
  }

  getMachineTagProperties(machineId){
    return this.http.get(
      environment.sourceUrl + `/Machines/MachineTagProperties?MachineID=${machineId}` 
    );
  }
  getMachineTag(data){
    return this.http.get(
      environment.sourceUrl + `/Machines/MachineTag?MachineID=${data.machineId}&from=${data.start}&to=${data.end}` 
    );
  }
}
