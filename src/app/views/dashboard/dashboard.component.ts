import {Component, OnInit} from '@angular/core';

import {Spp} from '../../category/model/category.model';
import {ConstantService} from '../../common/constant/constant.service';
import {DatePipe} from '@angular/common';
import {DateService} from '../../common/util/date.service';
import {CookieService} from 'ngx-cookie-service';
import {ChartDataSets, ChartOptions} from 'chart.js';
import * as pluginLabels from 'chartjs-plugin-labels';
import {ParsePipe} from 'ngx-moment';
import {Router} from '@angular/router';
import {ResponseCode} from '../../common/constant/response-code';
import {ToastrService} from 'ngx-toastr';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    DatePipe
  ]
})
export class DashboardComponent implements OnInit {
  listSpp: Spp[] = [];
  sppIdOfUser?: string;
  sppIdChart01?: string;
  sppIdChart02?: string;
  sppIdChart03?: string;
  sppIdChart04?: string;
  tongSoVuAnTinBaoToGiac = 0;
  tongSoTamGiamTamGiu = 0;
  tongSoCapLenh = 0;
  inProgressChar01: boolean = false;
  inProgressChar02: boolean = false;
  inProgressChar03: boolean = false;
  inProgressChar04: boolean = false;
  listVienKiemSat: Spp[];

  /*
   * Stacked Bar Chart - 03
   */
  // barChartOptions03: ChartOptions;
  barChartOptions03: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      position: 'top',
    }
  };
  barChartLabels03: string[];
  barChartType03 = 'bar';
  barChartLegend03 = true;
  barChartPlugins03: [pluginLabels];
  barChartData03: ChartDataSets[] = [];


  date = new Date();
  today = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
  firstDayOfMonth = this.datePipe.transform(new Date(this.date.getFullYear(), this.date.getMonth(), 1), 'dd/MM/yyyy');
  firstDayOfYear = this.datePipe.transform(new Date(this.date.getFullYear(), 0, 1), 'dd/MM/yyyy');


  /*
   * Stacked Bar Chart - 04
   */
  barChartOptions04: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      position: 'top',
    }
  };
  barChartLabels04: string[];
  barChartType04 = 'bar';
  barChartLegend04 = true;
  barChartPlugins04: [pluginLabels];
  tongSoVuAn: number = 0;
  barChartData04: ChartDataSets[] = [];

  public lineChartData01: ChartDataSets[];
  public lineChartLabels01 = [];
  public lineChartOptions01: ChartOptions;
  public lineChartType01;
  backgroundColorChart01: Array<String> = [];
  public pieChartLabelsChart01 = [];
  public pieChartDataChart01: Array<Number> = [];
  public pieChartTypeChart01;
  pieChartLegendChart01: boolean;
  pieChartPluginsChart01 = [];
  Chart01BackgroundColor: any = [
    {
      backgroundColor: this.backgroundColorChart01
    }
  ];
  pieChartOptionsChart01: ChartOptions;

  public pieChartLabelsChart02 = [];
  public pieChartDataChart02 = [];
  public pieChartTypeChart02;
  backgroundColorChart02: Array<String> = [];
  pieChartLegendChart02: boolean;
  pieChartPluginsChart02 = [];
  Chart02BackgroundColor: any = [
    {
      backgroundColor: this.backgroundColorChart02
    }
  ];
  pieChartOptionsChart02: ChartOptions;

  constructor(
    private constantService: ConstantService,
    private datePipe: DatePipe,
    private dateService: DateService,
    private cookieService: CookieService,
    private parsePipe: ParsePipe,
    private router: Router,
    private toastrService: ToastrService
  ) {
  }

  async ngOnInit() {
    const token = this.cookieService.get(this.constantService.ACCESS_TOKEN);
    if (!token) {
      this.toastrService.warning('Vui lòng đăng nhập để tiếp tục phiên làm việc');
      this.router.navigate(['login']);
      return;
    } else {
      this.constantService.postRequest(this.constantService.AUTH_URI + 'token/check/'
        , {
          'accessToken': token
        }).toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson.responseCode === ResponseCode.SUCCESS) {
            } else if (resJson.responseCode === ResponseCode.TOKEN_NOT_FOUND) {
              this.toastrService.warning('Vui lòng đăng nhập để tiếp tục phiên làm việc');
              this.cookieService.deleteAll();
              this.router.navigate(['login']);
              return;
            } else {
              this.toastrService.warning('Có vấn đề khi thực hiện kiểm tra phiên làm việc. Vui lòng đăng nhập để làm mới phiên làm việc');
              this.cookieService.deleteAll();
              this.router.navigate(['login']);
              return;
            }
          }
        )
        .catch(err => {
          this.toastrService.error(this.constantService.SYSTEM_ERROR);
        });
    }
    this.constantService.postRequest(this.constantService.MANAGE_URI + 'spp/findByUsername/'
      , {
        'username': this.cookieService.get(this.constantService.USERNAME)
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          this.listSpp = resJson.responseData;
        } else {
          this.toastrService.warning(resJson.responseMessage);
        }
      })
      .catch(() => this.toastrService.error(this.constantService.SYSTEM_ERROR));
    this.sppIdOfUser = this.cookieService.get(this.constantService.ID_SPP);
    this.sppIdChart01 = this.sppIdOfUser;
    this.sppIdChart02 = this.sppIdOfUser;
    this.sppIdChart03 = this.sppIdOfUser;
    this.sppIdChart04 = this.sppIdOfUser;
    this.lineChartData01 = [
      {
        data: [85, 72, 78, 75, 77, 75, 85, 72, 78, 75, 77, 75, 85, 72, 78, 75, 77, 75, 85, 72, 78, 75, 77, 75, 85, 72, 78, 75, 77, 75],
        label: 'Tạm giam'
      }, {
        data: [82, 32, 48, 55, 47, 85, 82, 32, 48, 55, 47, 85, 82, 32, 48, 55, 47, 85, 82, 32, 48, 55, 47, 85, 82, 32, 48, 55, 47, 85],
        label: 'Tạm giữ'
      }
    ];
    this.lineChartLabels01 = ['01/06', '02/06', '03/06', '04/06', '05/06', '06/06', '07/06', '08/06', '09/06', '10/06', '11/06', '12/06',
      '13/06', '14/06', '15/06', '16/06', '17/06', '18/06', '19/06', '20/06', '21/06', '22/06', '23/06', '24/06', '25/06', '26/06', '27/06', '28/06', '29/06', '30/06'];
    this.lineChartOptions01 = this.createOptionsLine01();
    this.lineChartType01 = 'line';

    this.pieChartOptionsChart01 = this.createOptionsChart01();
    this.loadChart01();
    this.pieChartTypeChart01 = 'pie';
    this.pieChartLegendChart01 = false;
    this.pieChartPluginsChart01 = [pluginLabels];

    this.loadChart02();
    this.pieChartOptionsChart02 = this.createOptionsChart02();
    this.pieChartTypeChart02 = 'pie';
    this.pieChartLegendChart02 = false;
    this.pieChartPluginsChart02 = [pluginLabels];


    /*
     * Char03
     */
    this.barChartType03 = 'bar';
    this.barChartLegend03 = true;
    this.barChartPlugins03 = [pluginLabels];

    const maxChart03 = <number>(await this.loadChart03());
    let tmp3 = 0;
    if (maxChart03 <= 100) {
      tmp3 = 10 * Math.ceil(maxChart03 / 10);
    } else {
      tmp3 = 100 * Math.ceil(maxChart03 / 100);
    }
    const dateServ: DateService = this.dateService;
    this.barChartOptions03 = {
      plugins: {
        labels: {
          render: function (args) {
            return args.value > 0 ? args.value : '';
          },
          fontSize: 12,
          position: 'inside'
        },
      },
      tooltips: {
        mode: 'label',
        callbacks: {
          title(item: Chart.ChartTooltipItem[], data: Chart.ChartData): string | string[] {
            return dateServ.convertDateToStringByPattern(new Date(item[0].label), 'dd/MM/yyyy');
          }
        }
      },
      responsive: true,
      legend: {
        position: 'top',
      },
      // scales: {
      //     xAxes: [{
      //         // stacked: true,
      //         type: 'time',
      //         time: {
      //             unit: 'day',
      //             unitStepSize: 1,
      //             displayFormats: {
      //                 day: 'DD/MM'
      //             }
      //         },
      //         ticks: {
      //             beginAtZero: true,
      //         },
      //     }],
      //     yAxes: [{
      //         stacked: true,
      //         ticks: {
      //             beginAtZero: true,
      //             stepSize: tmp3 / 5,
      //             max: tmp3
      //         },
      //     }]
      // }
      scales: {
        yAxes: [{
          stacked: false,
          ticks: {
            beginAtZero: true,
            stepSize: tmp3 / 5,
            max: tmp3
          },
        }]
      }
    };
    // this.loadChart03();
    this.barChartType04 = 'bar';
    this.barChartLegend04 = true;
    this.barChartPlugins04 = [pluginLabels];

    const maxChart04 = <number>(await this.loadChart04());
    let tmp = 0;
    if (maxChart04 <= 100) {
      tmp = 10 * Math.ceil(maxChart04 / 10);
    } else {
      tmp = 100 * Math.ceil(maxChart04 / 100);
    }
    this.barChartOptions04 = {
      plugins: {
        labels: {
          render: function (args) {
            return args.value;
          },
          fontSize: 12,
          position: 'outside'
        },
      },
      responsive: true,
      legend: {
        position: 'top',
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            stepSize: tmp / 5,
            max: tmp
          },
        }]
      }
    };
  }

  createOptionsLine01(): ChartOptions {
    return {
      responsive: false,
      maintainAspectRatio: false,
      legend: {
        display: true,
        position: 'right',
      },
    };
  }

  createOptionsChart01(): ChartOptions {
    return {
      responsive: false,
      maintainAspectRatio: false,
      legend: {
        display: true,
        position: 'bottom',
      },
      plugins: {
        labels: {
          render: 'percentage',
          fontColor: ['white', 'white', 'white', 'white', 'white'],
          precision: 2
        }
      },
    };
  }

  createOptionsChart02(): ChartOptions {
    return {
      responsive: false,
      maintainAspectRatio: false,
      legend: {
        display: true,
        position: 'bottom',
      },
      plugins: {
        labels: {
          render: 'percentage',
          fontColor: ['white', 'white', 'white'],
          precision: 2
        }
      },
    };
  }

  loadChart01() {
    if (!this.sppIdChart01) {
      this.toastrService.warning('Yêu cầu chọn đơn vị');
      return;
    }
    this.inProgressChar01 = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'dashboard01/requestDashboard/'
      , {
        'fromDate': this.firstDayOfMonth,
        'toDate': this.today,
        'sppId': this.sppIdChart01,
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
          if (resJson.responseCode === '0000') {
            if (resJson.responseData[0].soTbtgChuaThucHien !== 0) {
              this.pieChartDataChart01.push(resJson.responseData[0].soTbtgChuaThucHien);
              this.pieChartLabelsChart01.push('Chưa thực hiện');
              this.backgroundColorChart01.push('#0000FF');
              this.tongSoVuAnTinBaoToGiac = this.tongSoVuAnTinBaoToGiac + Number(resJson.responseData[0].soTbtgChuaThucHien);
            }
            if (resJson.responseData[0].soTbtgDangGiaiQuyet !== 0) {
              this.pieChartDataChart01.push(resJson.responseData[0].soTbtgDangGiaiQuyet);
              this.pieChartLabelsChart01.push('Đang giải quyết');
              this.backgroundColorChart01.push('#FFA500');
              this.tongSoVuAnTinBaoToGiac = this.tongSoVuAnTinBaoToGiac + Number(resJson.responseData[0].soTbtgDangGiaiQuyet);
            }
            if (resJson.responseData[0].soTbtgDaGiaiQuyet !== 0) {
              this.pieChartDataChart01.push(resJson.responseData[0].soTbtgDaGiaiQuyet);
              this.pieChartLabelsChart01.push('Đã giải quyết');
              this.backgroundColorChart01.push('#008000');
              this.tongSoVuAnTinBaoToGiac = this.tongSoVuAnTinBaoToGiac + Number(resJson.responseData[0].soTbtgDaGiaiQuyet);
            }
            if (resJson.responseData[0].soTbtgTamDinhChi !== 0) {
              this.pieChartDataChart01.push(resJson.responseData[0].soTbtgTamDinhChi);
              this.pieChartLabelsChart01.push('Tạm đình chỉ');
              this.backgroundColorChart01.push('#9400D3');
              this.tongSoVuAnTinBaoToGiac = this.tongSoVuAnTinBaoToGiac + Number(resJson.responseData[0].soTbtgTamDinhChi);
            }
            if (resJson.responseData[0].soTbtgDaQuaHan !== 0) {
              this.pieChartDataChart01.push(resJson.responseData[0].soTbtgDaQuaHan);
              this.pieChartLabelsChart01.push('Đã quá hạn');
              this.backgroundColorChart01.push('#FF0000');
              this.tongSoVuAnTinBaoToGiac = this.tongSoVuAnTinBaoToGiac + Number(resJson.responseData[0].soTbtgDaQuaHan);
            }
          } else {
            this.toastrService.warning(resJson.responseMessage);
          }
          this.inProgressChar01 = false;
        }
      )
      .catch(err => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
      });
  }

  loadChart02() {
    if (!this.sppIdChart02) {
      this.toastrService.warning('Yêu cầu chọn đơn vị');
      return;
    }
    this.inProgressChar02 = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'dashboard02/requestDashboard/'
      , {
        'fromDate': this.firstDayOfMonth,
        'toDate': this.today,
        'sppId': this.sppIdChart02,
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
          if (resJson.responseCode === '0000') {
            if (resJson.responseData[0].soCapLenhBiCan !== 0) {
              this.pieChartDataChart02.push(resJson.responseData[0].soCapLenhBiCan);
              this.pieChartLabelsChart02.push('Bị can');
              this.backgroundColorChart02.push('#CD5C5C');
              this.tongSoCapLenh = this.tongSoCapLenh + Number(resJson.responseData[0].soCapLenhBiCan);
            }
            if (resJson.responseData[0].soCapLenhTinBao !== 0) {
              this.pieChartDataChart02.push(resJson.responseData[0].soCapLenhTinBao);
              this.pieChartLabelsChart02.push('Tin báo');
              this.backgroundColorChart02.push('#6B8E23');
              this.tongSoCapLenh = this.tongSoCapLenh + Number(resJson.responseData[0].soCapLenhTinBao);
            }
            if (resJson.responseData[0].soCapLenhVuAn !== 0) {
              this.pieChartDataChart02.push(resJson.responseData[0].soCapLenhVuAn);
              this.pieChartLabelsChart02.push('Vụ án');
              this.backgroundColorChart02.push('#1E90FF');
              this.tongSoCapLenh = this.tongSoCapLenh + Number(resJson.responseData[0].soCapLenhVuAn);
            }
          } else {
            this.toastrService.warning(resJson.responseMessage);
          }
          this.inProgressChar02 = false;
        }
      )
      .catch(err => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
      });
    this.inProgressChar02 = false;
  }

  stringToDate(date: string | Date): Date {
    return this.parsePipe.transform(date, 'DD/MM/YYYY').toDate();
  }

  loadChart03() {
    const labels = [];
    const tamgiam = [];
    const tamgiu = [];
    return new Promise((resolve, reject) => {
      let max = 0;
      if (!this.sppIdChart03) {
        this.toastrService.warning('Yêu cầu chọn đơn vị');
        return;
      }
      this.inProgressChar03 = true;
      this.constantService.postRequest(this.constantService.REPORT_URI + 'dashboard03/requestDashboard/'
        , {
          'fromDate': this.firstDayOfMonth,
          'toDate': this.today,
          'sppId': this.sppIdChart03,
        }).toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson.responseCode === '0000') {
              if (resJson.responseData.length > 0) {
                resJson.responseData.forEach(value => {
                  labels.push(value.ngay.substr(0, 5));
                  tamgiam.push(value.soTamGiam);
                  tamgiu.push(value.soTamGiu);
                  this.tongSoTamGiamTamGiu += (value.soTamGiam + value.soTamGiu);
                  max = max < value.soTamGiam ? value.soTamGiam : max;
                  max = max < value.soTamGiu ? value.soTamGiu : max;
                });
                this.barChartLabels03 = [...labels];
                this.barChartData03 = [
                  {
                    data: tamgiu,
                    label: 'Tạm giữ',
                    backgroundColor: 'rgba(153, 208, 245, 0.8)',
                    borderColor: 'rgb(54, 162, 235)',
                    hoverBackgroundColor: 'rgba(153, 208, 245, 1)',
                    hoverBorderColor: 'rgb(54, 162, 235)',
                    borderWidth: 1,
                    barThickness: 15
                  },
                  {
                    data: tamgiam,
                    label: 'Tạm giam',
                    backgroundColor: 'rgba(254, 230, 171, 0.8)',
                    borderColor: 'rgb(255, 159, 64)',
                    hoverBackgroundColor: 'rgba(254, 230, 171, 1)',
                    hoverBorderColor: 'rgb(255, 159, 64)',
                    borderWidth: 1,
                    barThickness: 15
                  }
                ];
              } else {
                labels.push(this.dateService.convertDateToStringByPattern(this.dateService.getFirstDayOfMonth(), 'dd/MM'));
                labels.push(this.dateService.convertDateToStringByPattern(this.dateService.getCurrentDate(), 'dd/MM'));
                this.barChartLabels03 = [...labels];
              }
            } else if (resJson.responseCode === '0007') {
              labels.push(this.dateService.convertDateToStringByPattern(this.dateService.getFirstDayOfMonth(), 'dd/MM'));
              labels.push(this.dateService.convertDateToStringByPattern(this.dateService.getCurrentDate(), 'dd/MM'));
              this.barChartLabels03 = [...labels];
              this.barChartData03 = [];
            } else {
              labels.push(this.dateService.convertDateToStringByPattern(this.dateService.getFirstDayOfMonth(), 'dd/MM'));
              labels.push(this.dateService.convertDateToStringByPattern(this.dateService.getCurrentDate(), 'dd/MM'));
              this.barChartLabels03 = [...labels];
              this.barChartData03 = [];
              this.toastrService.warning(resJson.responseMessage);
            }
            this.inProgressChar03 = false;
            resolve(max);
          }
        )
        .catch(err => {
          this.toastrService.error(this.constantService.SYSTEM_ERROR);
        });
      this.inProgressChar03 = false;
    });
  }

  onUnitIdChart01Change() {
    this.backgroundColorChart01 = [];
    this.pieChartDataChart01 = [];
    this.pieChartLabelsChart01 = [];
    this.tongSoVuAnTinBaoToGiac = 0;
    this.loadChart01();
  }

  onUnitIdChart02Change() {
    this.backgroundColorChart02 = [];
    this.pieChartDataChart02 = [];
    this.pieChartLabelsChart02 = [];
    this.tongSoCapLenh = 0;
    this.loadChart02();
  }

  reloadSppList() {
    if (this.listSpp == null) {
      this.listSpp = JSON.parse(localStorage.getItem('vien_kiem_sat'));
    } else {
    }
  }

  onUnitIdChart03Change() {
    this.barChartData03 = [];
    this.barChartLabels03 = [];
    this.tongSoTamGiamTamGiu = 0;
    this.loadChart03();
  }

  onUnitIdChart04Change() {
    this.barChartData04 = [];
    this.barChartLabels04 = [];
    this.tongSoVuAn = 0;
    this.loadChart04();
  }

  exportDashboard01(): void {
    this.inProgressChar01 = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'dashboard01/requestDetail/'
      , {
        'fromDate': this.firstDayOfMonth,
        'toDate': this.today,
        'sppId': this.sppIdChart01,
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/excel;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'Thống_kê_tiếp_nhận_tin_báo_tố_giác_' + this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.xlsx';
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        } else {
          this.toastrService.warning(resJson.responseMessage);
        }
        this.inProgressChar01 = false;
      })
      .catch(err => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
      });
    this.inProgressChar01 = false;
  }

  exportDashboard02(): void {
    this.inProgressChar02 = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'dashboard02/requestDetail/'
      , {
        'fromDate': this.firstDayOfMonth,
        'toDate': this.today,
        'sppId': this.sppIdChart02,
        'type': 1
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/excel;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'Thống_kê_cấp_lệnh_quyết_định_vụ_án_bị_can_tin_báo' + this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.xlsx';
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        } else {
          this.toastrService.warning(resJson.responseMessage);
        }
        this.inProgressChar02 = false;
      })
      .catch(err => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
      });
    this.inProgressChar02 = false;
  }

  exportDashboard03(): void {
    if (!this.sppIdChart03) {
      this.toastrService.warning('Yêu cầu chọn đơn vị');
      return;
    }
    this.inProgressChar03 = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'dashboard03/requestDetail/'
      , {
        'fromDate': this.firstDayOfMonth,
        'toDate': this.today,
        'sppId': this.sppIdChart03
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/excel;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'Thống_kê_thông_tin_Bắt_tạm_giam_tạm_giữ' +
            this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.xlsx';
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        } else {
          this.toastrService.warning(resJson.responseMessage);
        }
        this.inProgressChar03 = false;
      })
      .catch(err => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
      });
    this.inProgressChar03 = false;
  }

  loadChart04() {
    const labels = [];
    const soVuAn = [];
    const soBiCan = [];
    return new Promise((resolve, reject) => {
      let max = 0;
      if (!this.sppIdChart04) {
        this.toastrService.warning('Yêu cầu chọn đơn vị');
        return;
      }
      this.inProgressChar04 = true;
      this.constantService.postRequest(this.constantService.REPORT_URI + 'dashboard04/requestDashboard/'
        , {
          'fromDate': this.firstDayOfMonth,
          'toDate': this.today,
          'sppId': this.sppIdChart04,
        }).toPromise()
        .then(res => res.json())
        .then(resJson => {
            if (resJson.responseCode === '0000') {
              if (resJson.responseData.length > 0) {
                resJson.responseData.forEach(value => {
                  labels.push(value.giaiDoan);
                  soVuAn.push(value.soVuAn);
                  soBiCan.push(value.soBiCan);
                  this.tongSoVuAn += value.soVuAn;
                  max = max < value.soVuAn ? value.soVuAn : max;
                  max = max < value.soBiCan ? value.soBiCan : max;
                });
                this.barChartLabels04 = [...labels];
                this.barChartData04 = [
                  {
                    data: soVuAn,
                    label: 'Vụ án',
                    barThickness: 30,
                    borderWidth: 1,
                  },
                  {
                    data: soBiCan,
                    label: 'Bị can',
                    barThickness: 30,
                    borderWidth: 1,
                  }
                ];
              }
            } else if (resJson.responseCode === '0007') {
              labels.push('Điều tra', 'Truy tố', 'Sơ thẩm', 'Phúc thẩm', 'GĐT/TT');
              this.barChartLabels04 = [...labels];
              this.barChartData04 = [];
            } else {
              labels.push('Điều tra', 'Truy tố', 'Sơ thẩm', 'Phúc thẩm', 'GĐT/TT');
              this.barChartLabels04 = [...labels];
              this.barChartData04 = [];
              this.toastrService.warning(resJson.responseMessage);
            }
            this.inProgressChar04 = false;
            resolve(max);
          }
        )
        .catch(err => {
          this.toastrService.error(this.constantService.SYSTEM_ERROR);
        });
      this.inProgressChar04 = false;
    });
  }

  exportDashboard04(): void {
    if (!this.sppIdChart04) {
      this.toastrService.warning('Yêu cầu chọn đơn vị');
      return;
    }
    this.inProgressChar04 = true;
    this.constantService.postRequest(this.constantService.REPORT_URI + 'dashboard04/requestDetail/'
      , {
        'fromDate': this.firstDayOfMonth,
        'toDate': this.today,
        'sppId': this.sppIdChart04
      }).toPromise()
      .then(res => res.json())
      .then(resJson => {
        if (resJson.responseCode === '0000') {
          const linkSource = 'data:application/excel;base64,' + resJson.responseData;
          const downloadLink = document.createElement('a');
          const fileName = 'Thống_kê_thông_tin_số_vụ_án' +
            this.dateService.convertDateToStringByPattern(Date.now(), 'yyyyMMdd_HHmmss') + '.xlsx';
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        } else {
          this.toastrService.warning(resJson.responseMessage);
        }
        this.inProgressChar04 = false;
      })
      .catch(err => {
        this.toastrService.error(this.constantService.SYSTEM_ERROR);
      });
    this.inProgressChar04 = false;
  }
}
