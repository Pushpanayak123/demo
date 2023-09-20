import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient : HttpClient) { }

  chartValues:any =[];
  getGlobalCapacity() {
  return this.httpClient.get(`${environment.apiUrl}/model-data`);
  }

  getCountryCapacity(region:any,city:any,year:any) {
    return this.httpClient.request('POST',`${environment.apiUrl}/feed-data`,{params:{'city':city,'region':region,'year':year}})
  }

  getFeedsData(){
    return this.httpClient.get (`${environment.apiUrl}/fetch-data`)
  }

}
