import {OnDestroy, OnInit} from '@angular/core';
import {Base, BaseSearch} from '../../common/model/base.model';
import {Law} from '../../category/model/category.model';

export class SoThuLyModel implements OnInit, OnDestroy {
  ngOnInit() {
  }

  ngOnDestroy() {
  }
}

export interface ApParam extends Base {
  paramCode?: string;
  paramName?: string;
  paramValue?: string;
  createUser?: string;
  createDate?: string;
  updateUser?: string;
  updateDate?: string;
  status?: string;
}

export interface BookBaseSearch extends BaseSearch {
  caseCode?: string;
  caseName?: string;
  accuCode?: string;
  accuName?: string;
  lawId?: string;
  decisionIdList?: string[];
  unitId?: string | null;
  groupLawCode?: string;
  item?: string;
  point?: string;
  fromDate?: string | null;
  toDate?: string | null;
  nguoiToCao?: string;
  nguoiBiToCao?: string;
}

export interface Book15Search {
  caseCode?: string;
  caseName?: string;
  accuCode?: string;
  accuName?: string;
  soVCC?: string;
  lawId: Law;
  decisionIdList: string[];
  unitId: string | null;
  groupLawCode: string;
  lawItem: Law;
  lawPoint: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book15 {
  ngayThangThuLy?: string;
  vuAnBiCan: string;
  banAnSoTham: string;
  kiemSatVien: string;
  thamPhan: string;
  khangCaoPhucTham: string;
  khangNghiPhucTham: string;
  dinhChiXetXuPhucTham: string;
  duaVuAnRaXetXu: string;
  ngayXetXuPhucTham: string;
  tamHoanPhienToa: string;
  quanDiemCuaVKS: string;
  banAn: string;
  deNghiVKSCapTrenKhangNghiGDT: string;
  ghiChu: string;
}

export interface Book16Search {
  caseCode?: string;
  caseName?: string;
  accuCode?: string;
  accuName?: string;
  soVCC?: string;
  lawId: Law;
  decisionIdList: string[];
  unitId: string | null;
  groupLawCode: string;
  lawItem: Law;
  lawPoint: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book16 extends Base {
  s_column_001: string;
  s_column_002: string;
  s_column_003: string;
  s_column_004: string;
  s_column_005: string;
  s_column_006: string;
  s_column_007: string;
  s_column_008: string;
  s_column_009: string;
  s_column_010: string;
  s_column_011: string;
  s_casecode?: string;
  s_accucode?: string;
}

export interface Book17Search {
  caseCode?: string;
  caseName?: string;
  accuCode?: string;
  accuName?: string;
  unitId: string | null;
  judgmentNum?: string;
  fromDate: Date | null;
  toDate: Date | null;
  judgmentFromDate: Date | null;
  judgmentToDate: Date | null;
}

export interface Book17 extends Base {
  s_column_2?: string;
  s_column_3?: string;
  s_column_4?: string;
  s_column_5?: string;
  s_column_6?: string;
  s_casecode?: string;
  s_regicode?: string;
}


export interface Book18Search {
  accuCode?: string;
  accuName?: string;
  lawId: Law;
  decisionIdList: string[];
  unitId: string | null;
  groupLawCode: string;
  lawItem: Law;
  lawPoint: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book18 extends Base {
  s_column_001?: string;
  s_column_002?: string;
  s_column_003?: string;
  s_column_004?: string;
  s_column_005?: string;
  s_column_006?: string;
  s_column_007?: string;
  s_accucode?: string;
}

export interface Book22Search {
  accuCode?: string;
  accuName?: string;
  lawId?: Law;
  decisionIdList?: string[];
  unitId?: string;
  groupLawCode?: string;
  lawItem?: Law;
  lawPoint?: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book22 extends Base {
  hoTen?: string;
  toiDanh?: string;
  lenhTamGiam?: string;
  lenhBatTamGiam?: string;
  quyetDinhGiaHanTamGiam?: string;
  tamGiamDieuTraBoSung?: string;
  truyToLenhTamGiam?: string;
  truyToLenhBatTamGiam?: string;
  truyToGiaHanTamGiam?: string;
  toaSoThamLenhTamGiam?: string;
  toaSoThamLenhBatTamGiam?: string;
  toaSoThamGiaHanTamGiam?: string;
  toaPhucThamLenhTamGiam?: string;
  toaPhucThamLenhBatTamGiam?: string;
  quyetDinhThiHanhAn?: string;
  chuyenNoiKhac?: string;
  chuyenNoiKhacDen?: string;
  nguoiBiKetAnTaiNgoai?: string;
  quyetDinhThayThe?: string;
  quyetDinhHuyBo?: string;
  traTuDoQuyetDinhTamDinhChi?: string;
  traTuDoKhangCao?: string;
  hetThoiHanTu?: string;
  quyetDinhTamDinhChiChapHanhAn?: string;
  soThamTraTuDo?: string;
  phucThamTraTuDo?: string;
  vienKiemSatTraTuDo?: string;
  daThiHanhAnTuHinh?: string;
  quyetDinhBatBuocChuaBenh?: string;
  chuyenThiHanhAn?: string;
  ngayTron?: string;
  quyetDinhTruyNa?: string;
  ngayBatLai?: string;
  quyetDinhXuLyKhiBatLai?: string;
  viPhamKyLuat?: string;
  quyetDinhXuLyViPham?: string;
  chet?: string;
  ghiChu?: string;
  s_accucode?: string;
}

export interface Book04Search {
  nguoiToCao?: string;
  nguoiBiToCao?: string;
  decisionIdList?: string[];
  maDonVi: string;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book04 extends Base {
  ngayVksThuLy?: string;
  nguoiToCao?: string;
  noiDung?: string;
  nguoiBiToCao?: string;
  kiemSatVienThuLy?: string;
  yeuCauCuaVienKiemSat?: string;
  quyetDinhGiaHanThoiGianGiaiQuyet?: string;
  quyetDinhTamDinhChi?: string;
  quyetDinhHuyBoTamDinhChi?: string;
  quyetDinhPhucHoiGiaiQuyet?: string;
  quyetDinhGiaiQuyetTranhChapVeThamQuyen?: string;
  thongBaoGiaiQuyetToGiacTinBao?: string;
  yeuCauVuAnHinhSu?: string;
  ketQuaThucHienYcVks?: string;
  ketQuaGiaiQuyet?: string;
  ghiChu?: string;
  denouncementId?: number;
}

export interface Book03Search {
  nguoiToCao?: string;
  nguoiBiToCao?: string;
  danhSachMaQuyetDinh?: string[];
  maDonVi?: string;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface ColsTable {
  title?: string;
  width?: string;
  rowspan?: number;
  colspan?: number;
}

export interface Book03 extends Base {
  ngayVksTiepNhan?: string;
  noiDungToGiac?: string;
  canBoTiepNhan?: string;
  donViTiepNhan?: string;
  maDonVi?: string;
  phieuChuyenTin?: string;
  maLoaiTin?: string;
  ghiChu?: string;
  nguoiToCao?: string;
  nguoiBiToCao?: string;
  ketQuaVks?: string;
  maQuyetDinh?: string;
  denouncementId?: number;
}

export interface Book01Search {
  caseCode?: string;
  caseName?: string;
  accuCode?: string;
  accuName?: string;
  lawId: Law;
  decisionIdList: string[];
  unitId: string | null;
  groupLawCode: string;
  lawItem: Law;
  lawPoint: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book01 extends Base {
  vuAnBiCan?: string;
  toiDanh?: string;
  quyetDinhPhanCongPVT?: string;
  quyetDinhPhanCongKSV?: string;
  yeuCauThayDoiThuTruongPhoThuTruong?: string;
  yeuCauThayDoiDieuTraVien?: string;
  yeuCauQuyetDinhThayDoiNguoiPhienDich?: string;
  thongBaoNguoiBaoChua?: string;
  yeuCauThayDoiNguoiBaoChua?: string;
  thongBaoTuChoiDangKyNguoiBaoChua?: string;
  quyetDinhThayDoiNguoiGiamDinh?: string;
  quyetDinhThamGiaToTung?: string;
  vanBanKhac?: string;
  ghiChu?: string;
  s_casecode?: string;
  s_accucode?: string;
}

export interface Book02 extends Base {
  vuAnBiCan?: string;
  toiDanh?: string;
  quyetDinhChuyenVuAn?: string;
  pheChuanQDKhoiToBiCan?: string;
  pheChuanQDBoSungKhoiToBiCan?: string;
  quyetDinhHuyBoKhoiToBiCan?: string;
  yeuCauRaQuyetDinh?: string;
  quyetDinhHuyBoQDKhongKhoiToVuAn?: string;
  quyetDinhKhoiToVuAn?: string;
  quyetDinhKhoiToBiCan?: string;
  quyetDinhNhapTachVuAn?: string;
  quyetDinhKhongGiaHanTGDieuTraVuAn?: string;
  deNghiGiaHanTGDieuTraVuAn?: string;
  yeuCauTruyNaBiCan?: string;
  quyetDinhHuyBoQDTamDinhChiDieuTra?: string;
  yeuCauPhucHoiDieuTraVuAn?: string;
  quyetDinhPhucHoiDieuTraVuAn?: string;
  quyetDinhPheChuanLenhKhamXet?: string;
  quyetDinhPheChuanLenhThuGiuThuTin?: string;
  quyetDinhKhamXet?: string;
  quyetDinhThucNghiemDieuTra?: string;
  quyetDinhDoiChat?: string;
  thongBaoKhongChapNhanDeNghiTrungCauGiamDinh?: string;
  quyetDinhTrungCauGiamDinh?: string;
  yeuCauThongBaoKetluanGiamDinh?: string;
  yeuCauCungCapTaiLieuLienQuan?: string;
  vanBanKhac?: string;
  ghiChu?: string;
  s_casecode?: string;
  s_accucode?: string;
}

export interface Book02Search {
  caseCode?: string;
  caseName?: string;
  accuCode?: string;
  accuName?: string;
  lawId: Law;
  decisionIdList?: string[];
  unitId: string | null;
  groupLawCode?: string;
  lawItem: Law;
  lawPoint: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book05Search {
  caseCode?: string;
  caseName?: string;
  accuCode?: string;
  accuName?: string;
  groupLawCode?: string;
  lawId?: Law;
  lawItem?: Law;
  lawPoint?: Law;
  fromDate: Date | null;
  toDate: Date | null;
  unitId: string | null;
}

export interface Book05 extends Base {
  ngayThangThucHien?: string;
  vuAnBiCan?: string;
  khamNghiemHienTruong?: string;
  khamNghiemTuThi?: string;
  khamXet?: string;
  thucNghiemDieuTra?: string;
  nhanDang?: string;
  doiChat?: string;
  nhanBietGiongNoi?: string;
  ghiChu?: string;
  denouncementId?: number;
  s_casecode?: string;

}

export interface Book06Search {
  caseCode?: string;
  caseName?: string;
  accuCode?: string;
  accuName?: string;
  lawId: Law;
  decisionIdList?: string[];
  unitId: string | null;
  groupLawCode?: string;
  lawItem: Law;
  lawPoint: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book06 extends Base {
  vuAnBiCan?: string;
  quyetDinhLenhBatGiuTHKhanCap?: string;
  lenhBatGiuTHKhanCap?: string;
  quyetDinhKhongPheChuanGiaHanTamGiu?: string;
  quyetDinhPheChuanGiaHanTamGiuL1L2?: string;
  quyetDinhHuyBoLenhTamGiu?: string;
  quyetDinhTraTuDo?: string;
  quyetDinhPheChuanLenhBatBiCan?: string;
  quyetDinhKhongPheChuanLenhBatBiCan?: string;
  quyetDinhPheChuanLenhTamGiam?: string;
  quyetDinhKhongPheChuanLenhTamGiam?: string;
  yeuCauApDungBienPhapTamGiamBiCan?: string;
  lenhBatBiCanDeTamGiam?: string;
  quyetDinhGiaHanThoiHanTamGiamL1L2L3?: string;
  quyetDinhGiaHanThoiHanTamGiamDacBiet?: string;
  quyetDinhHuyBoBienPhapTamGiam?: string;
  quyetDinhThayTheBienPhapNganChan?: string;
  quyetDinhBienPhapBaoLinh?: string;
  quyetDinhBaoLinh?: string;
  quyetDinhPCKPCDatTienDeBaoDam?: string;
  quyetDinhDatTienDeBaoDam?: string;
  lenhCamDiKhoiNoiCuTru?: string;
  thongBaoApDungBienPhapCamDiKhoiNoiCuTru?: string;
  quyetDinhHuyBoBienPhapCamDiKhoiNoiCuTru?: string;
  quyetDinhTamHoanXuatCanh?: string;
  quyetDinhHuyBoTamHoanXuatCanh?: string;
  lenhTamGiamDeTruyTo?: string;
  lenhBatTamGiamBiCanDeTruyTo?: string;
  quyetDinhGiaHanThoiHanTamGiamDeTruyTo?: string;
  quyetDinhApGiaiBiCan?: string;
  quyetDinhDanGiai?: string;
  lenhKeBienTaiSan?: string;
  lenhKhamXet?: string;
  quyetDinhHuyBoKeBienTaiSan?: string;
  lenhPhongToaTaiKhoan?: string;
  quyetDinhHuyBoPhongToaTaiKhoan?: string;
  ghiChu?: string;
  s_casecode?: string;
  s_accucode?: string;
}

export interface Book07Search {
  caseCode?: string;
  caseName?: string;
  accuCode?: string;
  accuName?: string;
  lawId: Law;
  decisionIdList: string[];
  unitId: string | null;
  groupLawCode: string;
  lawItem: Law;
  lawPoint: Law;
  fromDate: Date | null;
  toDate: Date | null;
  year: Date | null;
  underlevel?: null;
}

export interface Book07 extends Base {
  vuAnBiCan?: string;
  toiDanh?: string;
  quyetDinhKhoiToVuAnBiCan?: string;
  tomTatSuKienPhamToi?: string;
  hoTenDTVThuLy?: string;
  hoTenKSVThuLy?: string;
  hoTenNguoiThamGiaBaoChua?: string;
  yeuCauDieuTra?: string;
  bienPhapNganChanApDung?: string;
  quyetDinhTachNhapVuAn?: string;
  quyetDinhChuyenVuAn?: string;
  quyetDinhGiaHanThoiHanDieuTra?: string;
  quyetDinhTamDinhChiDieuTra?: string;
  ketLuanDieuTra?: string;
  ghiChu?: string;
  s_casecode?: string;
  s_accucode?: string;
}

export interface Book08Search {
  caseCode?: string;
  caseName?: string;
  accuCode?: string;
  accuName?: string;
  lawId: Law;
  decisionIdList: string[];
  unitId: string | null;
  groupLawCode: string;
  lawItem: Law;
  lawPoint: Law;
  fromDate: Date | null;
  toDate: Date | null;
  year: Date | null;
}

export interface Book08 extends Base {
  sttDetail?: string;
  vuAnBiCan?: string;
  toiDanh?: string;
  quyetDinhKhoiToVuAn?: string;
  quyetDinhKhoiToBiCan?: string;
  kiemSatVienDTVThamPhanThuLy?: string;
  quyetDinhTamDinhChi?: string;
  lyDoTamDinhChi?: string;
  quyetDinhTruyNa?: string;
  tacDongCuaVKS?: string;
  quyetDinhHuyBoQDTamDinhChi?: string;
  quyetDinhPhucHoi?: string;
  ghiChu?: string;
  s_casecode?: string;
  s_accucode?: string;
}

export interface Book09Search {
  caseCode?: string;
  caseName?: string;
  accuCode?: string;
  accuName?: string;
  lawId: Law;
  decisionIdList: string[];
  unitId: string | null;
  groupLawCode: string;
  lawItem: Law;
  lawPoint: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book09 extends Base {
  sttDetail?: string;
  vuAnBiCan?: string;
  quyetDinhKhoiToVuAn?: string;
  quyetDinhKhoiToBiCan?: string;
  toiDanh?: string;
  kiemSatVienDTVThamPhanThuLy?: string;
  quyetDinhDinhChi?: string;
  lyDoDinhChi?: string;
  quyetDinhXuLyVatChung?: string;
  tacDongCuaVKS?: string;
  ketLuanCuaVKS?: string;
  quyetDinhHuyBoQDDinhChi?: string;
  quyetDinhPhucHoi?: string;
  ghiChu?: string;
  s_casecode?: string;
  s_accucode?: string;
}

export interface Book10Search {
  caseCode?: string;
  caseName?: string;
  accuCode?: string;
  accuName?: string;
  lawId: Law;
  decisionIdList: string[];
  unitId: string | null;
  groupLawCode: string;
  lawItem: Law;
  lawPoint: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book10 extends Base {
  vuAnBiCan?: string;
  toiDanh?: string;
  kiemSatVienThuLy?: string;
  dieuTraVienThuLy?: string;
  thamPhanThuLy?: string;
  quyetDinhTraHoSo?: string;
  lyDoTraHoSo?: string;
  ngayGiaoNhanHoSo?: string;
  dinhChiDieuTraVuAnBiCan?: string;
  tamDinhChiDieuTraVuAnBiCan?: string;
  giuNguyenQDDeNghiTruyTo?: string;
  thayDoiQuanDiemDeNghiTruyTo?: string;
  vksGiuNguyenCaoTrangTruyTo?: string;
  vksTraHoSoChoCQDT?: string;
  tamDinhChiVuAnBiCan?: string;
  dinhChiVuAnBiCan?: string;
  thayDoiCaoTrang?: string;
  giuNguyenCaoTrang?: string;
  xuLyKhac?: string;
  ghiChu?: string;
  s_casecode?: string;
  s_accucode?: string;
}

export interface Book11Search {
  accuCode?: string;
  accuName?: string;
  decisionIdList: string[];
  unitId: string | null;
  groupLawCode: string;
  lawId: Law;
  lawItem: Law;
  lawPoint: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book11 extends Base {
  s_column_2?: string;
  s_column_3?: string;
  s_column_4?: string;
  s_column_5?: string;
  s_column_6?: string;
  s_column_7?: string;
  s_column_8?: string;
  s_column_9?: string;
  s_column_10?: string;
  s_column_11?: string;
  s_column_12?: string;
  s_column_13?: string;
  s_column_14?: string;
  s_column_15?: string;
  s_column_16?: string;
  s_column_17?: string;
  s_column_18?: string;
  s_column_19?: string;
  s_column_20?: string;
  s_column_21?: string;
  s_column_22?: string;
  s_accucode?: string;
}

export interface Book12Search {
  caseCode?: string;
  caseName?: string;
  accuCode?: string;
  accuName?: string;
  lawId?: Law;
  decisionIdList?: string[];
  unitId: string | null;
  groupLawCode?: string;
  lawItem?: Law;
  lawPoint?: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book12 extends Base {
  sttDetail?: string;
  vuAnBiCan?: string;
  toiDanh?: string;
  quyetDinhPhanCongKSV?: string;
  quyetDinhTachNhapVuAn?: string;
  quyetDinhChuyenThuLyVuAn?: string;
  quyetDinhGiaHanThoiGianTruyTo?: string;
  quyetDinhTraHoSoVuAn?: string;
  quyetDinhTamDinhChiDieuTraVuAn?: string;
  quyetDinhDinhChiDieuTraVuAn?: string;
  quyetDinhHuyBoDinhChiDieuTraVuAn?: string;
  quyetDinhPhucHoiDieuTraVuAn?: string;
  quyetDinhXuLyVatChungTaiSanTKBiPhongToa?: string;
  quyetDinhChuyenVatChung?: string;
  caoTrangQDTruyTo?: string;
  quyetDinhRutQDTruyTo?: string;
  quyetDinhHuyQDRutQDTruyTo?: string;
  vanBanDeNghiTraHoSo?: string;
  quyetDinhPhanCongKSVTaiPhienToaSoTham?: string;
  quyetDinhPhanCongVKSCapDuoiTHQCT?: string;
  quyetDinhBietPhaiKSVTHQCT?: string;
  vanBanTBVuAnCoBiCanBiTamGiam?: string;
  vanBanTBTruyToBiCanTruocToa?: string;
  ghiChu?: string;
  s_casecode?: string;
  s_accucode?: string;
}

export interface Book13Search {
  caseCode?: string;
  caseName?: string;
  accuCode?: string;
  accuName?: string;
  unitId?: string;
  organIdDelivery?: string;
  unitIdDelivery?: string;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book13 extends Base {
  ngayThangNamGiaoNhan?: string;
  vuAnBiCan?: string;
  vatChung?: string;
  lyDoChuyen?: string;
  benGiao?: string;
  benNhan?: string;
  ghiChu?: string;
  s_casecode?: string;
  s_regicode?: string;
}

export interface Book14Search {
  caseCode?: string;
  caseName?: string;
  accuCode?: string;
  accuName?: string;
  decisionIdList: string[];
  unitId: string | null;
  groupLawCode: string;
  lawId: Law;
  lawItem: Law;
  lawPoint: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book14 extends Base {
  s_column_2?: string;
  s_column_3?: string;
  s_column_4?: string;
  s_column_5?: string;
  s_column_6?: string;
  s_column_7?: string;
  s_column_8?: string;
  s_column_9?: string;
  s_column_10?: string;
  s_column_11?: string;
  s_column_12?: string;
  s_column_13?: string;
  s_column_14?: string;
  s_column_15?: string;
  s_column_16?: string;
  s_column_17?: string;
}

export interface Book19Search {
  fromDate?: Date;
  toDate?: Date;
  sppId?: string;
  resultCode?: number;
  claimantName?: string;
  resultHandler?: string;
  damagesName?: string;
  claimantAddress?: string[];
  damagesAddress?: string;
  resultNumber?: string;
  fromResultDate?: Date;
  toResultDate?: Date;
  fromDocumentDate?: Date;
  toDocumentDate?: Date;
  status?: number;
}

export interface Book19 extends Base {
  s_column_2?: string;
  s_column_3?: string;
  s_column_4?: string;
  s_column_5?: string;
  s_column_6?: string;
  s_column_7?: string;
  s_column_8?: string;
  s_column_9?: string;
  s_column_10?: string;
  s_ghi_chu?: string;
  n_compensation_id?: number;
}

export interface Book20Search {
  fromDate?: Date;
  toDate?: Date;
  sppId?: string;
  claimantName?: string;
  damagesName?: string;
  decisionCompensationNumber?: number;
  fromDecisionCompensationDate?: Date;
  toDecisionCompensationDate?: Date;
  decisionEnforcementNumber?: number;
  fromDecisionEnforcementDate?: Date;
  toDecisionEnforcementDate?: Date;
  judgmentCompensationNumber?: number;
  status?: number;
}

export interface Book20 extends Base {
  s_column_2?: string;
  s_column_3?: string;
  s_column_4?: string;
  s_column_5?: string;
  s_column_6?: string;
  s_column_7?: string;
  s_column_8?: string;
  s_column_9?: string;
  s_column_10?: string;
  s_column_11?: string;
  s_column_12?: string;
  s_column_13?: string;
  s_column_14?: string;
  s_column_15?: string;
  s_column_16?: string;
  s_ghi_chu?: string;
  n_compensation_id?: number;
}

export interface Book21Search {
  arrestName?: string;
  arrestType?: string;
  fromDateDecision?: string;
  toDateDecision?: string;
  decisionIdList?: string[];
  unitId?: string;
  code?: string;
  name?: string;
  type?: number;
  status?: number;
  fromDate?: Date | null;
  toDate?: Date | null;
}

export interface Book21 extends Base {
  hoTen?: string;
  ngayBatTamGiu?: string;
  cacTruongHopBat?: string;
  batKhongCoCanCu?: string;
  quyetDinhTamGiu?: string;
  lyDoTamGiu?: string;
  quyetDinhGiaHanTamGiuLan1?: string;
  quyetDinhGiaHanTamGiuLan2?: string;
  quyetDinhPheChuanQDGiaHanTamGiu?: string;
  quyetDinhHuyBoBienPhapTamGiu?: string;
  chuyenDiNoiKhac?: string;
  noiKhacChuyenDen?: string;
  quyetDinhADBPNCKhac?: string;
  lenhTamGiam?: string;
  quyetDinhTraTuDo?: string;
  quyetDinhTraTuDoCuaVKS?: string;
  tron?: string;
  quyetDinhTraTruyNa?: string;
  ngayBatLai?: string;
  quyetDinhXuLyKhiBatLai?: string;
  ngayViPham?: string;
  quyetDinhXuLyViPham?: string;
  chet?: string;
  ghiChu?: string;
  n_arrestee_id?: number;
}

export interface Book23Search {
  accuCode?: string;
  accuName?: string;
  lawId?: Law;
  decisionIdList?: string[];
  unitId?: string;
  groupLawCode?: string;
  lawItem?: Law;
  lawPoint?: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book23 extends Base {
  hoTen?: string;
  banAnCoHieuLucPhapLuat?: string;
  toiDanh?: string;
  hinhPhat?: string;
  quyetDinhUyThacDiNoiKhacRaQDThiHanhAn?: string;
  nhanUyThacTuNoiKhacDeRaQDThiHanhAn?: string;
  quyetDinhThiHanhAn?: string;
  banAnGDTTTTuyenHuyAn?: string;
  quyetDinhHoanChapHanhAn?: string;
  quyetDinhTamDinhChiChapHanhAn?: string;
  quyetDinhDinhChiChapHanhAn?: string;
  quyetDinhMienChapHanhHinhPhat?: string;
  quyetDinhHuongThoiHieu?: string;
  quyetDinhApDungBienPhapBatBuocChuaBenh?: string;
  chet?: string;
  phamToiMoi?: string;
  quyetDinhTruyNa?: string;
  daThiHanhAn?: string;
  ghiChu?: string;
  s_accucode?: string;
}

export interface Book24Search {
  accuCode?: string;
  accuName?: string;
  lawId?: Law;
  decisionIdList?: string[];
  unitId?: string;
  groupLawCode?: string;
  lawItem?: Law;
  lawPoint?: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book24 extends Base {
  hoTen?: string;
  toiDanh?: string;
  banAnTuyenPhatTuHinh?: string;
  banAnTuyenBangHinhPhatKhac?: string;
  quyetDinhAnGiam?: string;
  quyetDinhThiHanhAn?: string;
  daThiHanh?: string;
  tron?: string;
  chet?: string;
  ghiChu?: string;
  s_accucode?: string;
}

export interface Book25Search {
  accuCode?: string;
  accuName?: string;
  lawId?: Law;
  decisionIdList?: string[];
  unitId?: string;
  groupLawCode?: string;
  lawItem?: Law;
  lawPoint?: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book25 extends Base {
  hoTen?: string;
  banAnToiDanh?: string;
  mucAn?: string;
  tamGiam?: string;
  quyetDinhThiHanhAn?: string;
  quyetDinhDuaNguoiChapHanhAnDenTraiGiam?: string;
  chuyenDiNoiKhac?: string;
  noiKhacChuyenDen?: string;
  quyetDinhGiamThoiHanChapHanhAn?: string;
  quyetDinhTamDinhChiChapHanhAn?: string;
  quyetDinhApDungBienPhapBatBuocChuaBenh?: string;
  quyetDinhDinhChiChapHanhAn?: string;
  banAnGDTTuyenHuyHinhPhatTu?: string;
  quyetDinhTraTuDo?: string;
  quyetDinhMienChapHanhAn?: string;
  quyetDinhDacXa?: string;
  quyetDinhThaTuTruocThoiHan?: string;
  daChapHanhXong?: string;
  chet?: string;
  ngayTron?: string;
  quyetDinhTruyNa?: string;
  batLai?: string;
  quyetDinhXuLyKhiBatLai?: string;
  viPhamBiKyLuat?: string;
  quyetDinhXuLyViPham?: string;
  ghiChu?: string;
  s_accucode?: string;
}

export interface Book26Search {
  accuCode?: string;
  accuName?: string;
  lawId?: Law;
  decisionIdList?: string[];
  unitId?: string;
  groupLawCode?: string;
  lawItem?: Law;
  lawPoint?: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book26 extends Base {
  hoTen?: string;
  banAnToiDanh?: string;
  hinhPhatMucAn?: string;
  noiKhacChuyenDen?: string;
  chuyenDiNoiKhac?: string;
  quyetDinhThiHanhAn?: string;
  daThiHanhAn?: string;
  coQuanDuocGiaoGiamSatGiaoDuc?: string;
  phamToiMoi?: string;
  viPhamNghiaVu?: string;
  quyetDinhXuLyViPham?: string;
  banAnGDTTuyenHuyHinhPhat?: string;
  quyetDinhMienChapHanhAn?: string;
  quyetDinhGiamThoiHanChapHanhAn?: string;
  daChapHanhXong?: string;
  chet?: string;
  ghiChu?: string;
  s_accucode?: string;
}

export interface Book27Search {
  legalCode?: string;
  legalName?: string;
  lawId?: Law;
  item?: string;
  point?: string;
  decisionIdList?: string[];
  unitId?: string;
  groupLawCode?: string;
  lawItem?: Law;
  lawPoint?: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book27 extends Base {
  tenDiaChi?: string;
  banAnCoHieuLucPhapLuat?: string;
  hinhPhat?: string;
  quyetDinhThiHanhAn?: string;
  quyetDinhCuongCheThiHanhAn?: string;
  giayChungNhanDaChapHanhXongHinhPhat?: string;
  quyetDinhThiHanh?: string;
  quyetDinhCuongCheThiHanh?: string;
  giayChungNhanDaChapHanhXongBienPhapTuPhap?: string;
  ghiChu?: string;
  s_accucode?: string;
}

export interface Book28Search {
  accuCode?: string;
  accuName?: string;
  lawId?: Law;
  item?: string;
  point?: string;
  decisionIdList?: string[];
  unitId?: string;
  groupLawCode?: string;
  lawItem?: Law;
  lawPoint?: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book28 extends Base {
  hoTen?: string;
  banAn?: string;
  hinhPhat?: string;
  ngayThiHanhAn?: string;
  coQuanGiamSatGiaoDuc?: string;
  viPhamNghiaVu?: string;
  quyetDinhXuLyViPham?: string;
  chet?: string;
  giayChungNhanChapHanhXongHinhPhat?: string;
  ghiChu?: string;
  s_accucode?: string;
}

export interface Book29Search {
  accuCode?: string;
  accuName?: string;
  lawId?: Law;
  item?: string;
  point?: string;
  decisionIdList?: string[];
  unitId?: string;
  groupLawCode?: string;
  lawItem?: Law;
  lawPoint?: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book29 extends Base {
  hoTen?: string;
  toiDanh?: string;
  mucAn?: string;
  quyetDinhThiHanhAn?: string;
  quyetDinhHoanThiHanhAn?: string;
  quyetDinhTamDinhChiThiHanhAn?: string;
  quyetDinhHuyQDTamDinhChi?: string;
  quyetDinhDinhChiThiHanhAn?: string;
  quyetDinhCuaToaAn?: string;
  chet?: string;
  tron?: string;
  ngayDiThiHanhAn?: string;
  ghiChu?: string;
  s_accucode?: string;
}

export interface Book30Search {
  accuCode?: string;
  accuName?: string;
  lawId?: Law;
  item?: string;
  point?: string;
  decisionIdList?: string[];
  unitId?: string;
  groupLawCode?: string;
  lawItem?: Law;
  lawPoint?: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book30 extends Base {
  hoTen?: string;
  toiDanhHinhPhat?: string;
  thoiGianDaChapHanhAnPhat?: string;
  quyetDinhThaTuTruocThoiHan?: string;
  chuyenDiNoiKhac?: string;
  noiKhacChuyenDen?: string;
  coQuanDuocGiaoNhiemVuQuanLy?: string;
  quyetDinhRutNganTGThuThach?: string;
  quyetDinhHuyQDThaTuTruocThoiHan?: string;
  chet?: string;
  quyetDinhDinhChiThiHanhAn?: string;
  giayChungNhanChapHanhXongHinhPhat?: string;
  ghiChu?: string;
  s_accucode?: string;
}

export interface Book31Search {
  accuCode?: string;
  accuName?: string;
  decisionIdList: string[];
  unitId: string | null;
  groupLawCode: string;
  lawId: Law;
  lawItem: Law;
  lawPoint: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book31 extends Base {
  s_column_2?: string;
  s_column_3?: string;
  s_column_4?: string;
  s_column_5?: string;
  s_column_6?: string;
  s_column_7?: string;
  s_column_8?: string;
  s_column_9?: string;
  s_column_10?: string;
  s_column_11?: string;
  s_column_12?: string;
  s_accucode?: string;
}

export interface Book32Search {
  damageName?: any;
  damageId?: any;
  accuCode?: string;
  accuName?: string;
  decisionIdList: string[];
  unitId: string | null;
  groupLawCode: string;
  lawId: Law;
  lawItem: Law;
  lawPoint: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book32 extends Base {
  s_column_1?: string;
  s_column_2?: string;
  s_column_3?: string;
  s_column_4?: string;
  s_column_5?: string;
  s_column_6?: string;
  s_column_7?: string;
  s_column_8?: string;
  s_column_9?: string;
  s_column_10?: string;
  s_column_11?: string;
  s_column_12?: string;
  s_column_13?: string;
  s_column_14?: string;
}

export interface Book33Search {
  damageName?: any;
  damageId?: any;
  accuCode?: string;
  accuName?: string;
  decisionIdList: string[];
  unitId: string | null;
  groupLawCode: string;
  lawId: Law;
  lawItem: Law;
  lawPoint: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book33 extends Base {
  s_column_1?: string;
  s_column_2?: string;
  s_column_3?: string;
  s_column_4?: string;
  s_column_5?: string;
  s_column_6?: string;
  s_column_7?: string;
  s_column_8?: string;
  s_column_9?: string;
  s_column_10?: string;
  s_column_11?: string;
  s_column_12?: string;
  s_column_13?: string;
  s_column_14?: string;
}

export interface Book34Search {
  damageName?: any;
  damageId?: any;
  accuCode?: string;
  accuName?: string;
  decisionIdList: string[];
  unitId: string | null;
  groupLawCode: string;
  lawId: Law;
  lawItem: Law;
  lawPoint: Law;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book34 extends Base {
  s_column_1?: string;
  s_column_2?: string;
  s_column_3?: string;
  s_column_4?: string;
  s_column_5?: string;
  s_column_6?: string;
  s_column_7?: string;
  s_column_8?: string;
  s_column_9?: string;
  s_column_10?: string;
  s_column_11?: string;
  s_column_12?: string;
  s_column_13?: string;
  s_column_14?: string;
}

export interface Book35Search {
  damageName?: any;
  damageId?: any;
  accuCode?: string;
  accuName?: string;
  unitId?: string | null;
  fromDate: Date | null;
  toDate: Date | null;
  fromDateVBXL: Date | null;
  toDateVBXL: Date | null;
}

export interface Book35 extends Base {
  s_column_1?: string;
  s_column_2?: string;
  s_column_3?: string;
  s_column_4?: string;
  s_column_5?: string;
  s_column_6?: string;
  s_column_7?: string;
  s_column_8?: string;
  s_column_9?: string;
  s_column_10?: string;
  s_column_11?: string;
  s_column_12?: string;
  s_column_13?: string;
  s_column_14?: string;
}

export interface Book36Search {
  damageName?: any;
  damageId?: any;
  accuCode?: string;
  accuName?: string;
  unitId?: string | null;
  fromDateVB: Date | null;
  toDateVB: Date | null;
  fromDateVBXL: Date | null;
  toDateVBXL: Date | null;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface Book36 extends Base {
  s_column_1?: string;
  s_column_2?: string;
  s_column_3?: string;
  s_column_4?: string;
  s_column_5?: string;
  s_column_6?: string;
  s_column_7?: string;
  s_column_8?: string;
  s_column_9?: string;
  s_column_10?: string;
  s_column_11?: string;
  s_column_12?: string;
  s_column_13?: string;
  s_column_14?: string;
}

export interface Book66Search {
  fromDate: Date | null;
  toDate: Date | null;
  documentFromDate: Date | null;
  documentToDate: Date | null;
  resultFromDate: Date | null;
  resultToDate: Date | null;
  documentCode?: number;
  resultCode?: number;
  unitId?: string;
  violatedAgency?: string;
  violatedUnitsId?: string;
  violatedUnitsName?: string;
  documentNumber?: string;
  resultNumber?: string;
}

export interface Book66 extends Base {
  s_column_2?: string;
  s_column_3?: string;
  s_column_4?: string;
  s_column_5?: string;
  s_column_6?: string;
  s_column_7?: string;
  s_column_8?: string;
  s_column_9?: string;
  s_column_10?: string;
  s_column_11?: string;
  s_column_12?: string;
  n_violation_id?: number;
}

export interface LstPolice extends Base {
  rowCount?: number;
  rNum?: number;
  policeId?: string;
  name?: string;
  addr?: string;
  tel?: string;
  fax?: string;
  director?: string;
  status?: string;
  spcId?: string;
  spcName?: string;
  sppId?: string;
  sppName?: string;
  locaId?: string;
  crtDate?: Date;
  crtUser?: string;
  mdfDate?: Date;
  mdfUser?: string;
  position?: string;
  shortName?: string;
  locaName?: string;
  policeCode?: string;
  policeLevel?: string;
  policeParent?: string;
  orderCode?: string;
}

export interface LstArmy extends Base {
  rowcount?: number;
  rnum?: number;
  ctrdate?: string;
  ctruser?: string;
  mdfdate?: string;
  mdfuser?: string;
  armyid?: string;
  name?: string;
  addr?: string;
  tel?: string;
  fax?: string;
  director?: string;
  position?: string;
  armylevel?: number;
  armyparent?: string;
  armycode?: string;
  ordercode?: string;
  newarmyid?: string;
  spcid?: string;
  spcname?: string;
  sppid?: string;
  sppname?: string;
  locaid?: string;
}

export interface LstCustoms extends Base {
  rowcount?: number;
  rnum?: number;
  customid?: string;
  name?: string;
  addr?: string;
  tel?: string;
  fax?: string;
  director?: string;
  status?: string;
  spcid?: string;
  spcname?: string;
  sppid?: string;
  sppname?: string;
  locaid?: string;
  crtdate?: string;
  crtuser?: string;
  mdfdate?: string;
  mdfuser?: string;
  position?: string;
  shortname?: string;
  locaname?: string;
  customcode?: string;
  customlevel?: string;
  customparent?: string;
  ordercode?: string;
}

export interface LstRanger extends Base {
  rowcount?: number;
  rnum?: number;
  ctrdate?: string;
  ctruser?: string;
  mdfdate?: string;
  mdfuser?: string;
  rangid?: string;
  name?: string;
  addr?: string;
  tel?: string;
  fax?: string;
  director?: string;
  position?: string;
  ranglevel?: number;
  rangparent?: string;
  rangcode?: string;
  ordercode?: string;
  newrangid?: string;
  spcid?: string;
  spcname?: string;
  atxtspc?: string;
  sppid?: string;
  sppname?: string;
  atxspp?: string;
  locaid?: string;
}

export interface LstBorderGuards extends Base {
  rowcount?: number;
  rnum?: number;
  borguaid?: string;
  name?: string;
  addr?: string;
  tel?: string;
  fax?: string;
  director?: string;
  status?: string;
  spcid?: string;
  spcname?: string;
  sppid?: string;
  sppname?: string;
  locaid?: string;
  crtdate?: string;
  crtuser?: string;
  mdfdate?: string;
  mdfuser?: string;
  position?: string;
  shortname?: string;
  locaname?: string;
  borguacode?: string;
  borgualevel?: string;
  borguaparent?: string;
  ordercode?: string;
}

export interface LstSPC extends Base {
  spcid?: string;
  name?: string;
  addr?: string;
  tel?: string;
  fax?: string;
  director?: string;
  spclevel?: string;
  spcparent?: string;
  spccode?: string;
  ordercode?: string;
  newspcid?: string;
  locaid?: string;
  rowcount?: number;
  rnum?: number;
  ctrdate?: string;
  ctruser?: string;
  mdfdate?: string;
  mdfuser?: string;
}
