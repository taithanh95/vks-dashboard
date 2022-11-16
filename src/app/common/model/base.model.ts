import {OnDestroy, OnInit} from '@angular/core';

export class BaseModel implements OnInit, OnDestroy {
  ngOnInit() {
  }

  ngOnDestroy() {
  }
}

export interface Base {
  id?: number;
  stt?: number;
  sttDetail?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BaseSearch {
  code?: string;
  name?: string;
  type?: number;
  status?: number;
  fromDate?: string;
  toDate?: string;
}

export interface Response {
  responseCode?: string;
  responseMessage?: string;
  responseData?: any;
}

export interface PageResponse {
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
  totalElements?: number;
}

export interface RequestReport {
  id?: number;
  reportCode?: string;
  status?: number;
  description?: string;
  beginAt?: string;
  endAt?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  fromDate?: string;
  toDate?: string;
  reportType?:string;
  reportInput?: ReportInput;
}
export interface FeedBack{
  id?: number;
  status?: number;
  type?: string;
  subType?: string;
  menu?: string;
  content?: string;
  approve?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  fromDate?: Date;
  toDate?: Date;
  phoneNumber?: string;
  email?: string;
  contentApprove?: string;
  approveLocal?: string;
  approveBy?: string;
  approveAt?: string;
}
export interface Comments{
  id?: number;
  status?: number;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  feedBack?: object;
}

export interface ReportInput {
  id?: number;
  requestReportId?: number;
  fromDate?: string | Date;
  toDate?: string | Date;
  paperType?: string;
  position?: string;
  signature?: string;
  sppId?: string;
  updatedAt?: string;
  createdAt?: string | Date;
  createdBy?: string;
  updatedBy?: string;
  sppname?: string;
  reportType?:string;

}

export interface ValueLabel {
  value: number;
  label: string;
}

export interface ResponseBody {
  responseCode?: string;
  responseMessage?: string;
  responseData?: any;
}
