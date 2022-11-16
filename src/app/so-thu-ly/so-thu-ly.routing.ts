import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {TamGiamComponent} from './component/tam-giam-mau-so-hai-hai/tam-giam.component';
import {TiepNhanTinBaoMauSoBaComponent} from './component/tiep-nhan-tin-bao-mau-so-ba/tiep-nhan-tin-bao-mau-so-ba.component';
import {GiaiQuyetTinBaoMauSoBonComponent} from './component/giai-quyet-tin-bao-mau-so-bon/giai-quyet-tin-bao-mau-so-bon.component';
import {MauSoHaiComponent} from './component/mau-so-hai/mau-so-hai.component';
import {MauSoMotComponent} from './component/mau-so-mot/mau-so-mot.component';
import {MauSoSauComponent} from './component/mau-so-sau/mau-so-sau.component';
import {MauSoMuoiHaiComponent} from './component/mau-so-muoi-hai/mau-so-muoi-hai.component';
import {MauSoHaiMotComponent} from './component/mau-so-hai-mot/mau-so-hai-mot.component';
import {MauSoMuoiBayComponent} from './component/mau-so-muoi-bay/mau-so-muoi-bay.component';
import {MauSoHaiBaComponent} from './component/mau-so-hai-ba/mau-so-hai-ba.component';
import {MauSoHaiTuComponent} from './component/mau-so-hai-tu/mau-so-hai-tu.component';
import {MauSoHaiNamComponent} from './component/mau-so-hai-nam/mau-so-hai-nam.component';
import {MauSoHaiSauComponent} from './component/mau-so-hai-sau/mau-so-hai-sau.component';
import {MauSoHaiBayComponent} from './component/mau-so-hai-bay/mau-so-hai-bay.component';
import {MauSoHaiTamComponent} from './component/mau-so-hai-tam/mau-so-hai-tam.component';
import {MauSoHaiChinComponent} from './component/mau-so-hai-chin/mau-so-hai-chin.component';
import {MauSoBaMuoiComponent} from './component/mau-so-ba-muoi/mau-so-ba-muoi.component';
import {MauSoNamComponent} from './component/mau-so-nam/mau-so-nam.component';
import {MauSoBayComponent} from './component/mau-so-bay/mau-so-bay.component';
import {MauSoMuoiMotComponent} from './component/mau-so-muoi-mot/mau-so-muoi-mot.component';
import {MauSoMuoiBonComponent} from './component/mau-so-muoi-bon/mau-so-muoi-bon.component';
import {MauSoBaHaiComponent} from './component/mau-so-ba-hai/mau-so-ba-hai.component';
import {MauSoBaMotComponent} from './component/mau-so-ba-mot/mau-so-ba-mot.component';
import {MauSoTamComponent} from './component/mau-so-tam/mau-so-tam.component';
import {MauSoChinComponent} from './component/mau-so-chin/mau-so-chin.component';
import {MauSoMuoiComponent} from './component/mau-so-muoi/mau-so-muoi.component';
import {MauSoMuoiNamComponent} from './component/mau-so-muoi-nam/mau-so-muoi-nam.component';
import {MauSoMuoiSauComponent} from './component/mau-so-muoi-sau/mau-so-muoi-sau.component';
import {MauSoMuoiTamComponent} from './component/mau-so-muoi-tam/mau-so-muoi-tam.component';
import {MauSoMuoiBaComponent} from './component/mau-so-muoi-ba/mau-so-muoi-ba.component';
import {MauSoBaBaComponent} from './component/mau-so-ba-ba/mau-so-ba-ba.component';
import {MauSoBaTuComponent} from './component/mau-so-ba-tu/mau-so-ba-tu.component';
import {MauSoBaNamComponent} from './component/mau-so-ba-nam/mau-so-ba-nam.component';
import {MauSoBaSauComponent} from './component/mau-so-ba-sau/mau-so-ba-sau.component';
import {MauSoSauSauComponent} from './component/mau-so-sau-sau/mau-so-sau-sau.component';
import {MauSoMuoiChinComponent} from './component/mau-so-muoi-chin/mau-so-muoi-chin.component';
import {MauSoHaiMuoiComponent} from './component/mau-so-hai-muoi/mau-so-hai-muoi.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'category',
        pathMatch: 'full',
      },
      {
        path: 'so-dang-ky-quyet-dinh-va-van-ban-ve-nguoi-tien-hanh-to-tung-nguoi-tham-giam-to-tung-giai-doan-giai-quyet-to-giac-tin-bao-ve-toi-pham-dieu-tra-truy-to',
        component: MauSoMotComponent,
        data: {
          title: 'Sổ 01 - Sổ đăng ký quyết định và văn bản về người tiến hành tố tụng, người tham gia tố tụng giai đoạn giải quyết tố giác, tin báo về tội phạm... điều tra và truy tố',
          breadcrumb: 'Sổ 01 - Sổ đăng ký quyết định và văn bản về người tiến hành tố tụng, người tham gia tố tụng giai đoạn giải quyết tố giác, tin báo về tội phạm... điều tra và truy tố'
        }
      },
      {
        path: 'so-dang-ky-cac-lenh-quyet-dinh-yeu-cau-trong-giai-doan-dieu-tra',
        component: MauSoHaiComponent,
        data: {
          title: 'Sổ 02 - Sổ đăng ký các lệnh, quyết định, yêu cầu trong giai đoạn điều tra',
          breadcrumb: 'Sổ 02 - Sổ đăng ký các lệnh, quyết định, yêu cầu trong giai đoạn điều tra'
        }
      },
      {
        path: 'so-tiep-nhan-tin-bao',
        component: TiepNhanTinBaoMauSoBaComponent,
        data: {
          title: 'Sổ 03 - Sổ tiếp nhận tin báo về tội phạm và kiến nghị khởi tố',
          breadcrumb: 'Sổ 03 - Sổ tiếp nhận tin báo về tội phạm và kiến nghị khởi tố'
        }
      },
      {
        path: 'so-giai-quyet-tin-bao',
        component: GiaiQuyetTinBaoMauSoBonComponent,
        data: {
          title: 'Sổ 04 - Sổ thực hành quyền công tố, kiểm sát việc tiếp nhận, giải quyết tin báo, tố giác tội phạm, kiến nghị khởi tố',
          breadcrumb: 'Sổ 04 - Sổ thực hành quyền công tố, kiểm sát việc tiếp nhận, giải quyết tin báo, tố giác tội phạm, kiến nghị khởi tố'
        }
      },
      {
        path: 'so-kiem-sat-viec-kham-nghiem-hien-truong-kham-nghiem-tu-thi-va-cac-hoat-dong-vks-tham-giam-bat-buoc',
        component: MauSoNamComponent,
        data: {
          title: 'Sổ 05 - Sổ kiểm sát việc khám nghiệm hiện trường, khám nghiệm tử thi và các hoạt động vks tham gia bắt buộc',
          breadcrumb: 'Sổ 05 - Sổ kiểm sát việc khám nghiệm hiện trường, khám nghiệm tử thi và các hoạt động vks tham gia bắt buộc'
        }
      },
      {
        path: 'so-dang-ky-lenh-quyet-dinh-van-ban-ve-ap-dung-bien-phap-ngan-chan-bien-phap-cuong-che',
        component: MauSoSauComponent,
        data: {
          title: 'Sổ 06 - Sổ đăng ký lệnh, quyết định, văn bản về áp dụng biện pháp ngăn chặn, biện pháp cưỡng chế',
          breadcrumb: 'Sổ 06 - Sổ đăng ký lệnh, quyết định, văn bản về áp dụng biện pháp ngăn chặn, biện pháp cưỡng chế'
        }
      },
      {
        path: 'so-thuc-hanh-quyen-cong-to-va-kiem-sat-dieu-tra-vu-an-hinh-su',
        component: MauSoBayComponent,
        data: {
          title: 'Sổ 07 - Sổ thực hành quyền công tố và kiểm sát điều tra vụ án hình sự',
          breadcrumb: 'Sổ 07 - Sổ thực hành quyền công tố và kiểm sát điều tra vụ án hình sự'
        }
      },
      {
        path: 'so-quan-ly-an-hinh-su-tam-dinh-chi',
        component: MauSoTamComponent,
        data: {
          title: 'Sổ 8 - Số quản lý án hình sự tạm đình chỉ',
          breadcrumb: 'Sổ 08 - Số quản lý án hình sự tạm đình chỉ'
        }
      },
      {
        path: 'so-quan-ly-an-hinh-su-dinh-chi',
        component: MauSoChinComponent,
        data: {
          title: 'Sổ 9 - Sổ quản lý án hình sự đình chỉ',
          breadcrumb: 'Sổ 09 - Sổ quản lý án hình sự đình chỉ'
        }
      },
      {
        path: 'so-quan-ly-an-hinh-su-tra-ho-so-dieu-tra-bo-sung',
        component: MauSoMuoiComponent,
        data: {
          title: 'Sổ 10 - Số quản lý án hình sự trả hồ sơ điều tra bổ sung',
          breadcrumb: 'Sổ 10 - Số quản lý án hình sự trả hồ sơ điều tra bổ sung'
        }
      },
      {
        path: 'so-quan-ly-viec-ap-dung-bien-phap-dieu-tra-to-tung-dac-biet-va-thu-tuc-dac-biet',
        component: MauSoMuoiMotComponent,
        data: {
          title: 'Sổ 11 - Sổ quản lý việc áp dụng biện pháp điều tra tố tụng đặc biệt và thủ tục đặc biệt',
          breadcrumb: 'Sổ 11 - Sổ quản lý việc áp dụng biện pháp điều tra tố tụng đặc biệt và thủ tục đặc biệt'
        }
      },
      {
        path: 'so-dang-ky-lenh-quyet-dinh-van-ban-trong-giai-doan-truy-to',
        component: MauSoMuoiHaiComponent,
        data: {
          title: 'Sổ 12 - Sổ đăng ký lệnh, quyết định, văn bản trong giai đoạn truy tố',
          breadcrumb: 'Sổ 12 - Sổ đăng ký lệnh, quyết định, văn bản trong giai đoạn truy tố'
        }
      },
      {
        path: 'so-giao-nhan-ho-so-vu-an-hinh-su',
        component: MauSoMuoiBaComponent,
        data: {
          title: 'Sổ 13 - Sổ giao nhận hồ sơ vụ án hình sự',
          breadcrumb: 'Sổ 13 - Sổ giao nhận hồ sơ vụ án hình sự'
        }
      },
      {
        path: 'so-thqct-va-ksxx-so-tham-cac-vu-an-hinh-su',
        component: MauSoMuoiBonComponent,
        data: {
          title: 'Sổ 14 - Sổ THQCT và KSXX sơ thẩm các vụ án hình sự',
          breadcrumb: 'Sổ 14 - Sổ THQCT và KSXX sơ thẩm các vụ án hình sự'
        }
      },
      {
        path: 'so-thqct-ksxx-phuc-tham-cac-vu-an-hinh-su',
        component: MauSoMuoiNamComponent,
        data: {
          title: 'Sổ 15 - Sổ THQCT, KSXX phúc thẩm các vụ án hình sự',
          breadcrumb: 'Sổ 15 - Sổ THQCT, KSXX phúc thẩm các vụ án hình sự'
        }
      },
      {
        path: 'so-thqct-ksxx-giam-phuc-tham-tai-tham-cac-vu-an-hinh-su',
        component: MauSoMuoiSauComponent,
        data: {
          title: 'Sổ 16 - Sổ THQCT và KSXX giám đốc thẩm, tái thẩm các vụ án hình sự',
          breadcrumb: 'Sổ 16 - Sổ THQCT và KSXX giám đốc thẩm, tái thẩm các vụ án hình sự'
        }
      },
      {
        path: 'so-quan-ly-thu-tuc-xem-xet-lai-quyet-dinh-cua-hdtp-toa-an-nhan-dan-toi-cao',
        component: MauSoMuoiBayComponent,
        data: {
          title: 'Sổ 17 - Sổ quản lý thủ tục xem xét lại quyết định của HĐTP tòa án nhân dân tối cao',
          breadcrumb: 'Sổ 17 - Sổ quản lý thủ tục xem xét lại quyết định của HĐTP tòa án nhân dân tối cao'
        }
      },
      {
        path: 'so-quan-ly-nguoi-bi-toa-an-tuyen-phat-tu-hinh',
        component: MauSoMuoiTamComponent,
        data: {
          title: 'Sổ 18 - Sổ quản lý người bị tòa án tuyên phạt tử hình',
          breadcrumb: 'Sổ 18 - Sổ quản lý người bị tòa án tuyên phạt tử hình'
        }
      },
      {
        path: 'so-tiep-nhan-don-yeu-cau-boi-thuong-trong-to-tung-hinh-su',
        component: MauSoMuoiChinComponent,
        data: {
          title: 'Sổ 19 - Sổ tiếp nhận đơn yêu cầu bồi thường trong tố tụng hình sự',
          breadcrumb: 'Sổ 19 - Sổ tiếp nhận đơn yêu cầu bồi thường trong tố tụng hình sự'
        }
      },
      {
        path: 'so-quan-ly-viec-boi-thuong-trong-to-tung-hinh-su-thuoc-trach-nhiem-cua-nganh-ksnd',
        component: MauSoHaiMuoiComponent,
        data: {
          title: 'Sổ 20 - Sổ quản lý việc bồi thường trong tố tụng hình sự thuộc trách nhiệm của ngành KSND',
          breadcrumb: 'Sổ 20 - Sổ quản lý việc bồi thường trong tố tụng hình sự thuộc trách nhiệm của ngành KSND'
        }
      },
      {
        path: 'so-kiem-sat-thi-hanh-tam-giu',
        component: MauSoHaiMotComponent,
        data: {
          title: 'Sổ 21 - Sổ kiểm sát thi hành tạm giữ',
          breadcrumb: 'Sổ 21 - Sổ kiểm sát thi hành tạm giữ'
        }
      },
      {
        path: 'tam-giam',
        component: TamGiamComponent,
        data: {
          title: 'Sổ 22 - Sổ kiểm sát việc thi hành tạm giam',
          breadcrumb: 'Sổ 22 - Sổ kiểm sát việc thi hành tạm giam'
        }
      },
      {
        path: 'so-theo-doi-viec-ra-quyet-dinh-thi-hanh-cua-toa-an',
        component: MauSoHaiBaComponent,
        data: {
          title: 'Sổ 23 - Sổ theo dõi việc ra quyết định thi hành án của tòa án',
          breadcrumb: 'Sổ 23 - Sổ theo dõi việc ra quyết định thi hành án của tòa án'
        }
      },
      {
        path: 'so-kiem-sat-viec-giam-giu-nguoi-bi-ket-an-tu-hinh',
        component: MauSoHaiTuComponent,
        data: {
          title: 'Sổ 24 - Sổ kiểm sát việc giam giữ người bị kết án tử hình',
          breadcrumb: 'Sổ 24 - Sổ kiểm sát việc giam giữ người bị kết án tử hình'
        }
      },
      {
        path: 'so-kiem-sat-thi-hanh-an-phat-tu',
        component: MauSoHaiNamComponent,
        data: {
          title: 'Sổ 25 - Sổ kiểm sát thi hành án phạt tù',
          breadcrumb: 'Sổ 25 - Sổ kiểm sát thi hành án phạt tù'
        }
      },
      {
        path: 'so-kiem-sat-thi-hanh-an-treo-an-phat-cai-tao-khong-giam-giu-truc-xuat-va-canh-bao',
        component: MauSoHaiSauComponent,
        data: {
          title: 'Sổ 26 - Sổ kiểm sát thi hành án treo, án phạt cải tạo không giam giữ, trục xuất và cảnh cáo',
          breadcrumb: 'Sổ 26 - Sổ kiểm sát thi hành án treo, án phạt cải tạo không giam giữ, trục xuất và cảnh cáo'
        }
      },
      {
        path: 'so-kiem-sat-thi-hanh-an-doi-voi-phap-nhan-thuong-mai',
        component: MauSoHaiBayComponent,
        data: {
          title: 'Sổ 27 - Sổ kiểm sát việc thi hành án đối với pháp nhân thương mại',
          breadcrumb: 'Sổ 27 - Sổ kiểm sát việc thi hành án đối với pháp nhân thương mại'
        }
      },
      {
        path: 'so-kiem-sat-thi-hanh-hinh-phat-bo-sung',
        component: MauSoHaiTamComponent,
        data: {
          title: 'Sổ 28 - Sổ kiểm sát thi hành hình phạt bổ sung',
          breadcrumb: 'Sổ 28 - Sổ kiểm sát thi hành hình phạt bổ sung'
        }
      },
      {
        path: 'so-kiem-sat-hoan-tam-dinh-chi-chap-hanh-an-phat-tu',
        component: MauSoHaiChinComponent,
        data: {
          title: 'Sổ 29 - Sổ kiểm sát hoãn, tạm đình chỉ chấp hành án phạt tù',
          breadcrumb: 'Sổ 29 - Sổ kiểm sát hoãn, tạm đình chỉ chấp hành án phạt tù'
        }
      },
      {
        path: 'so-kiem-sat-viec-thi-hanh-quyet-dinh-tha-tu-truoc-thoi-han-co-dieu-kien',
        component: MauSoBaMuoiComponent,
        data: {
          title: 'Sổ 30 - Sổ kiểm sát việc thi hành quyết định tha tù trước thời hạn có điều kiện',
          breadcrumb: 'Sổ 30 - Sổ kiểm sát việc thi hành quyết định tha tù trước thời hạn có điều kiện'
        }
      },
      {
        path: 'so-quan-ly-bi-can-bi-hai-la-nguoi-chua-thanh-nien',
        component: MauSoBaHaiComponent,
        data: {
          title: 'Sổ 32 - Sổ quản lý bị can, bị hại là người chưa thành niên',
          breadcrumb: 'Sổ 32 - Sổ quản lý bị can, bị hại là người chưa thành niên'
        }
      },
      {
        path: 'so-kiem-sat-thi-hanh-cac-bien-phap-tu-phap',
        component: MauSoBaMotComponent,
        data: {
          title: 'Sổ 31 - Sổ kiểm sát thi hành các biện pháp tư pháp',
          breadcrumb: 'Sổ 31 - Sổ kiểm sát thi hành các biện pháp tư pháp'
        }
      },
      {
        path: 'so-thu-ly-ho-so-tuong-tro-tu-phap-ve-hinh-su-cua-viet-nam',
        component: MauSoBaBaComponent,
        data: {
          title: 'Sổ 33 - Sổ thụ lý hồ sơ tương trợ tư pháp về hình sự của việt nam',
          breadcrumb: 'Sổ 33 - Sổ thụ lý hồ sơ tương trợ tư pháp về hình sự của việt nam'
        }
      },
      {
        path: 'so-thu-ly-ho-so-tuong-tro-tu-phap-ve-hinh-su-cua-nuoc-ngoai',
        component: MauSoBaTuComponent,
        data: {
          title: 'Sổ 34 - Sổ thụ lý hồ sơ tương trợ tư pháp về hình sự của nước ngoài',
          breadcrumb: 'Sổ 34 - Sổ thụ lý hồ sơ tương trợ tư pháp về hình sự của nước ngoài'
        }
      },
      {
        path: 'so-giai-quyet-tuong-tro-tu-phap-ve-hinh-su-cua-viet-nam',
        component: MauSoBaNamComponent,
        data: {
          title: 'Sổ 35 - Sổ giải quyết tương trợ tư pháp về hình sự của việt nam',
          breadcrumb: 'Sổ 35 - Sổ giải quyết tương trợ tư pháp về hình sự của việt nam'
        }
      },
      {
        path: 'so-giai-quyet-tuong-tro-tu-phap-ve-hinh-su-cua-nuoc-ngoai',
        component: MauSoBaSauComponent,
        data: {
          title: 'Sổ 36 - Sổ giải quyết tương trợ tư pháp về hình sự của nước ngoài',
          breadcrumb: 'Sổ 36 - Sổ giải quyết tương trợ tư pháp về hình sự của nước ngoài'
        }
      },
      {
        path: 'so-theo-doi-vi-pham-phap-luat-trong-hoat-dong-tu-phap',
        component: MauSoSauSauComponent,
        data: {
          title: 'Sổ 66 - Sổ theo dõi vi phạm pháp luật trong hoạt động tư pháp và việc thực hiện yêu cầu, thông báo rút kinh nghiệm, kiến nghị, kháng nghị của viện kiểm sát',
          breadcrumb: 'Sổ 66 - Sổ theo dõi vi phạm pháp luật trong hoạt động tư pháp và việc thực hiện yêu cầu, thông báo rút kinh nghiệm, kiến nghị, kháng nghị của viện kiểm sát'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SoThuLyRouting {
}
