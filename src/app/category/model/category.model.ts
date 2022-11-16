import {Base, BaseSearch} from '../../common/model/base.model';

export interface Param extends Base {
  group: string;
  code: string;
  value: string;
  name: string;
  status: number;
}

export interface GroupRole extends Base {
  url?: string;
  name?: string;
  description?: string;
  icon?: string;
  priority?: number;
  status?: number;
  children?: Role[];
  checked?: boolean;
}

export interface Role extends Base {
  url?: string;
  name?: string;
  description?: string;
  icon?: string;
  type?: number;
  status?: number;
  priority?: number;
  parentId?: number;
  children?: Role[];
  checked?: boolean;
  class?: string;
}

export interface RoleSearch extends BaseSearch {
  url?: string;
  description?: string;
  parentId?: number;
}

export interface SearchUser extends BaseSearch {
  username?: string;
  type?: number;
  sppid?: string;
  status?: number;
  inspcode?: string;
  groupUserId?: number;
  groupid?: number;
  departid?: number;
  groupUser?: GroupUser;
}

export interface User extends Base {
  groupidname?: string;
  inspectname?: string;
  departname?: string;
  sppname?: string;
  username?: string;
  password?: string;
  name?: string;
  email?: string;
  status?: number;
  type?: number;
  typeName?: string;
  phone?: string;
  groupUserId?: number;
  groupUser?: GroupUser;
  departid?: string;
  sppid?: string;
  inspcode?: string;
  expiredate?: string;
  groupid?: string
}

export interface SearchGroupUser extends BaseSearch {
  name?: string;
  description?: string;
  status?: number;
}

export interface GroupUser extends Base {
  name?: string;
  description?: string;
  status?: number;
  groupUserGroupRoleList?: GroupUserGroupRole[];
  groupUserRoleList?: GroupUserRole[];
}

export interface GroupUserGroupRole extends Base {
  groupUserId?: number;
  groupRoleId?: number;
  status?: number;
}

export interface GroupUserRole extends Base {
  groupUserId?: number;
  roleId?: number;
  status?: number;
}

export interface Position extends Base {
  supplierId?: number;
  userType?: number;
  userTypeName?: string;
  name?: string;
  status?: number;
  supplier?: Supplier;
}

export interface PositionSearch extends BaseSearch {
  supplierId?: number;
  userType?: number;
}

export interface PositionGroupRole extends Base {
  supplierId?: number;
  positionId?: number;
  groupRoleId?: number;
  status?: number;
  supplier?: Supplier;
  position?: Position;
  groupRole?: GroupRole;
}


export interface Province extends Base {
  code?: string;
  name?: string;
  status?: number;
}

export interface District extends Base {
  code?: string;
  name?: string;
  provinceCode?: string;
  status?: number;
  province?: Province;
}

export interface Commune extends Base {
  code?: string;
  name?: string;
  districtCode?: string;
  provinceCode?: string;
  status?: number;
  district?: District;
  province?: Province;
}

export interface Village extends Base {
  code?: string;
  name?: string;
  communeCode?: string;
  districtCode?: string;
  provinceCode?: string;
  status?: number;
  district?: District;
  province?: Province;
  commune?: Commune;
}

export interface Area {
  provinceCode?: string;
  provinceName?: string;
  districtCode?: string;
  districtName?: string;
  communeCode?: string;
  communeName?: string;
  responseCode?: string;
  responseMessage?: string;
}

export interface AreaSearch extends BaseSearch {
  provinceCode?: string;
  districtCode?: string;
  communeCode?: string;
}

export interface Bank extends Base {
  code?: string;
  name?: string;
  nameEn?: string;
  swiftCode?: string;
  alias?: string;
  status?: number;
}

export interface Email extends Base {
  fromAddress?: string;
  toAddress?: string;
  ccAddress?: string;
  subject?: string;
  content?: string;
  fileName?: string;
  responseMessage?: string;
  intendAt?: string;
  sentAt?: string;
  status?: number;
  type?: number;
}

export interface EmailSearch extends BaseSearch {
  fromAddress?: string;
  toAddress?: string;
  ccAddress?: string;
  subject?: string;
  content?: string;
  fileName?: string;
  responseMessage?: string;
  intendAt?: string;
  sentAt?: string;
  status?: number;
  type?: number;
}

export interface Supplier extends Base {
  code?: string;
  name?: string;
  nameNoSign?: string;
  address?: string;
  addressNoSign?: string;
  phone?: string;
  alias?: string;
  type?: number;
  status?: number;
  taxCode?: string;
  moduleName?: string;
}

export interface SupplierSearch extends BaseSearch {
  address?: string;
  phone?: string;
  alias?: string;
}

export interface EvnPc extends Base {
  parentCode?: string;
  pcCode?: string;
  pcName?: string;
  shortName?: string;
  address?: string;
  taxCode?: string;
  phone?: string;
  phoneMaintenance?: string;
  fax?: string;
  webCskh?: string;
  level?: number;
  status?: number;
}

export interface EvnPcSearch extends BaseSearch {
  parentCode?: string;
  pcCode?: string;
  pcName?: string;
  address?: string;
  phone?: string;
  level?: number;
}

export interface Spp extends Base {
  sppId?: string;
  name?: string;
  address?: string;
  tel?: string;
  fax?: string;
  director?: string;
  status?: string;
  spcId?: string;
  spcName?: string;
  polId?: string;
  polName?: string;
  locaId?: string;
  position?: string;
  shortName?: string;
  locaName?: string;
  sppCode?: string;
  sppLevel?: string;
  sppParent?: string;
  oderCode?: string;
  isDePart?: string;
  sppIdFOX?: string;
  nameSync?: string;
}

export interface Decision extends Base {
  deciId?: string;
  name?: string;
  applyFor?: string;
  setTime?: number;
  setUnit?: string;
  status?: string;
  applyFinish?: string;
  useFor?: string;
  deciTypeId?: string;
  decLevel?: string;
  timeLimit?: string;
  content?: string;
}

export interface Pol extends Base {
  polId?: string;
  name?: string;
  addr?: string;
  tel?: number;
  fax?: string;
  director?: string;
}

export interface Code extends Base {
  codeId?: string;
  codeName?: string;
  status?: string;
  codeYear?: number;
  codeType?: string;
}

export interface Law extends Base {
  lawId?: string;
  lawCode?: string;
  item?: string;
  point?: string;
  lawName?: string;
  lawDate?: string;
  priority?: string;
  setorder?: string;
  groupId?: string;
  status?: string;
  codeId?: string;
  lawType?: string;
  lawCodeParrent?: string;
  sync?: string;
  fullName?: string;
}

export interface Inspector {
  inspcode?: string;
  sppid?: string;
  depart?: string;
  name?: string;
  departname?: string;
  fullname?: string;
  address?: string;
  tel?: string;
  jobtitle?: string;
  status?: string;
  position?: string;
  stt?: string;
  changeid?: string;
  jobname?: string;
  regicode?: string;
  position_?: string;
  position_name?: string;
  position_type?: string;
  setnum_regi?: string;
  assignins?: string;
  setnum_regins?: string;
  assigndate_regins?: string | Date;
  ks?: boolean;
  dt?: boolean;
  ld?: boolean;
  kh?: boolean;
  finishdate?: string | Date;
}

export interface AdmDepartment {
  departid?: string;
  sppname?: string;
  atxtSPP?: Spp;
}

export interface AdmGroups {
  groupid?: string;
  groupname?: string;
  sppid?: string;
  sppname?: string;
}
