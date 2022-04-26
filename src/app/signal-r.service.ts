import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";  // or from "@microsoft/signalr" if you are using a new library
import { LogLevel } from '@aspnet/signalr';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  constructor() { }
  public hubConnection: signalR.HubConnection
  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl('http://cocafda.tccbce.com/plc/notifi' , {
                              skipNegotiation : true,
                              transport : signalR.HttpTransportType.WebSockets
                            
                            })
                        
                            .configureLogging(signalR.LogLevel.Information)
                            .build();
                            this.hubConnection.serverTimeoutInMilliseconds = 100000;
                            
    this.hubConnection
      .start() 
      
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }
  // public addTransferChartDataListener = () => {
  //   this.hubConnection.on('sendNotification', (data) => {
  //   console.log(data)
  //   });
  // }
}
