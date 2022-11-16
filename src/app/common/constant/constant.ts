import {ValueLabel} from '../model/base.model';

export class Constant {
  public static readonly PAGE_NUMBER = 1;
  public static readonly PAGE_SIZE = 10;
  public static readonly sppid_VKSNDTC = '01';
  public static readonly sppid_label = 'sppid';
  public static readonly username_label = 'username';
  public static readonly sppname_label = 'sspname';
  public static readonly PAGE_SIZE_OPTION = [5, 10, 50, 100, 500];
  public static readonly ACCESS_TOKEN = 'access_token';
  public static readonly USERNAME = 'username';
  public static readonly USER_FULL_NAME = 'user_full_name';
  public static readonly RESPONSE_CODE_SUCCESS = '0000';
  public static readonly OBJECT_STATUS = [
    {key: -1, value: 'Tất cả'},
    {key: 1, value: 'Hoạt động'},
    {key: 0, value: 'Không hoạt động'},
  ];
  public static readonly STATUS_ACTIVE = 1;
  public static readonly STATUS_INACTIVE = 0;

  public static readonly TIMER_SHOW_NOTIFICATION = 5000;
  public static readonly TOAST_TIMER_OUT = 5000; // Thời gian hiển thị thông báo
  public static readonly PATTERN_ONLY_NUMBER = '^[0-9]*$';
  public static readonly PATTERN_WITHOUT_SPECIAL_CHARACTERS = '^[^%;:\x27\x22,<>{}[\\]\\/!@#$%^&*()-=+?.]*$';
  public static readonly LST_REPORT_CODE = [
    {key: '01', value: 'Biểu 01'},
    {key: '02', value: 'Biểu 02'},
    {key: '03', value: 'Biểu 03'},
    {key: '04', value: 'Biểu 04'},
    {key: '05', value: 'Biểu 05'},
    {key: '06', value: 'Biểu 06'},
    {key: '07', value: 'Biểu 07'},
    {key: '08', value: 'Biểu 08'},
    {key: '09', value: 'Biểu 09'},
    {key: '10', value: 'Biểu 10'},
    {key: '11', value: 'Biểu 11'},
    {key: '12', value: 'Biểu 12'},
    {key: '33', value: 'Biểu 33'},
  ];
  public static readonly LST_REPORT_CODE_PERIOD = [
    // {key: '01', value: 'Biểu 01'},
    {key: '02', value: 'Biểu 02'},
    // {key: '03', value: 'Biểu 03'},
    // {key: '04', value: 'Biểu 04'},
    // {key: '05', value: 'Biểu 05'},
    // {key: '06', value: 'Biểu 06'},
    // {key: '07', value: 'Biểu 07'},
    // {key: '08', value: 'Biểu 08'},
    // {key: '09', value: 'Biểu 09'},
    // {key: '10', value: 'Biểu 10'},
    // {key: '11', value: 'Biểu 11'},
    // {key: '12', value: 'Biểu 12'},
    // {key: '33', value: 'Biểu 33'},
  ];
  public static readonly LST_REPORT_PERIOD = [
    {key: '1', value: '1 tháng'},
    {key: '2', value: '6 tháng'},
    {key: '3', value: '12 tháng'}
  ];
  public static readonly LST_REPORT_STATUS: ValueLabel[] = [
    {value: 0, label: 'Đã xóa'},
    {value: 1, label: 'Đang chờ xử lý'},
    {value: 2, label: 'Đang xử lý'},
    {value: 3, label: 'Thành công'},
    {value: 4, label: 'Không Thành công'}
  ];
  public static readonly LST_TYPE = new Map<string, string>([
    ['00', 'Tất cả'],
    ['01', 'Nghiệp vụ Sổ thụ lý'],
    ['02', 'Quản lý sổ'],
    ['03', 'Báo cáo thống kê'],
    ['04', 'Quản lý tài khoản'],
    ['05', 'Quản trị danh mục'],
    ['06', 'Quản lý án Hình sự'],
  ]);
  public static readonly LST_SUB_TYPE = new Map<string, Map<string, string>>([
    ['00', new Map<string, string>([
      [null, null]
    ])],
    ['01', new Map<string, string>([
      ['01-01', 'Tiếp nhận và xử lý tin báo tố giác'],
      ['01-02', 'Quản lý bắt, tạm giam, tạm giữ'],
      ['01-03', 'Quản lý yêu cầu bồi thường'],
      ['01-04', 'Quản lý thông tin vi phạm pháp luật trong HĐTP'],
      ['01-05', 'Xem xét lại'],
      ['01-06', 'Cấp số lệnh, quyết định vụ án'],
      ['01-07', 'Cấp số lệnh, quyết định bị can'],
      ['01-08', 'Cấp số lệnh, quyết định tin báo'],
    ])],
    ['02', new Map<string, string>([
      ['02-01', 'Sổ 01'], ['02-02', 'Sổ 02'],
      ['02-03', 'Sổ 03'], ['02-04', 'Sổ 04'],
      ['02-05', 'Sổ 05'], ['02-06', 'Sổ 06'],
      ['02-07', 'Sổ 07'], ['02-08', 'Sổ 08'],
      ['02-09', 'Sổ 09'], ['02-10', 'Sổ 10'],
      ['02-11', 'Sổ 11'], ['02-12', 'Sổ 12'],
      ['02-13', 'Sổ 13'], ['02-14', 'Sổ 14'],
      ['02-15', 'Sổ 15'], ['02-16', 'Sổ 16'],
      ['02-17', 'Sổ 17'], ['02-18', 'Sổ 18'],
      ['02-19', 'Sổ 19'], ['02-20', 'Sổ 20'],
      ['02-21', 'Sổ 21'], ['02-22', 'Sổ 22'],
      ['02-23', 'Sổ 23'], ['02-24', 'Sổ 24'],
      ['02-25', 'Sổ 25'], ['02-26', 'Sổ 26'],
      ['02-27', 'Sổ 27'], ['02-28', 'Sổ 28'],
      ['02-29', 'Sổ 29'], ['02-30', 'Sổ 30'],
      ['02-31', 'Sổ 31'], ['02-32', 'Sổ 32'],
      ['02-33', 'Sổ 33'], ['02-34', 'Sổ 66'],
    ])],
    ['03', new Map<string, string>([
      ['03-01', 'Yêu cầu báo cáo'],
    ])],
    ['04', new Map<string, string>([
      ['04-01', 'Danh sách tài khoản'],
      ['04-02', 'Nhóm người dùng báo cáo'],
      ['04-03', 'Nhóm người dùng nghiệp vụ'],
      ['04-04', 'Người xử lý'],
    ])],
    ['05', new Map<string, string>([
      ['05-01', 'Biên phòng'],
      ['05-02', 'Hải quan'],
      ['05-03', 'Địa chính'],
      ['05-04', 'Toàn án'],
      ['05-05', 'Viện kiểm sát'],
      ['05-06', 'Đơn vị quân đội'],
      ['05-07', 'Đơn vị kiểm lâm'],
      ['05-08', 'Cơ quan công an'],
      ['05-09', 'Cơ quan điều tra'],
      ['05-10', 'Trại giam'],
      ['05-11', 'Bộ luật'],
      ['05-12', 'Phòng ban'],
      ['05-13', 'Chương luật'],
      ['05-14', 'Nhóm tội theo chương luật'],
      ['05-15', 'Điều luật'],
      ['05-16', 'Hình phạt'],
      ['05-17', 'Khung hình phạt'],
      ['05-18', 'Quyết định'],
      ['05-19', 'Loại quyết định'],
      ['05-20', 'Lý do quyết định'],
      ['05-21', 'Quốc gia'],
      ['05-22', 'Dân tộc'],
      ['05-23', 'Tôn giáo'],
      ['05-24', 'Chức vụ đảng'],
      ['05-25', 'Chức vụ chính quyền'],
      ['05-26', 'Nghề nghiệp'],
      ['05-27', 'Trình độ học vấn'],
      ['05-28', 'Lý do bàn giao'],
      ['05-29', 'Thời hạn thụ lý'],
      ['05-30', 'Trường hợp giải quyết'],
      ['05-31', 'kết luận bản án'],
      ['05-32', 'Loại kháng cáo'],
      ['05-33', 'Loại kháng nghị'],
      ['05-34', 'Kết quả kháng nghị'],
      ['05-35', 'Chỉ tiêu thống kê vụ án'],
      ['05-36', 'Chỉ tiêu thống kê bị can'],
    ])],
    ['06', new Map<string, string>([
      ['06-01', 'Kiểm sát Điều tra - Truy tố'],
      ['06-02', 'Kiểm sát xét xử sơ thẩm'],
      ['06-03', 'Kiểm sát xét xử phúc thẩm'],
      ['06-04', 'Kiểm sát thi hành án'],
      ['06-05', 'Chuyển án'],
      ['06-06', 'Nhận án'],
      ['06-07', 'Tách vụ án'],
      ['06-08', 'Chuyển vụ án theo yêu cầu'],
      ['06-09', 'Nhập vụ án'],
      ['06-10', 'Người xử lý'],
    ])],
  ]);
  public static readonly LST_APPROVE = new Map<string, string>([
    ['W', 'Chờ phê duyệt'],
    ['Y', 'Đã phê duyệt'],
    ['N', 'Từ chối phê duyệt']

  ]);
}

export enum DateFormat {
  DATE = 'dd/MM/yyyy',
  DATE_TIME = 'HH:mm:ss dd/MM/yyyy',
  DATE_TIME_STAMP = 'HH:mm:ss.SSS dd/MM/yyyy',
  TIME = 'HH:mm:ss'
}

export enum ModuleUri {
  SSO = 'api/sso/',
  CATEGORY = 'api/category/'
}

export enum ObjectStatus {
  INACTIVE,
  ACTIVE
}

export enum NotificationType {
  info = 'info',
  success = 'success',
  warning = 'warning',
  danger = 'danger'
}
