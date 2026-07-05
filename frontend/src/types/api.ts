/** 统一API响应格式 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}
/** 分页请求参数 */
export interface PaginationParams {
  page?: number;
  page_size?: number;
}
/** 分页响应数据 */
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
/** 登录请求 */
export interface LoginRequest {
  username: string;
  password: string;
}
/** 登录响应 */
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserInfo;
}
/** 注册请求 */
export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
  real_name?: string;
  phone?: string;
}
/** 用户信息 */
export interface UserInfo {
  id: number;
  username: string;
  email?: string;
  real_name?: string;
  phone?: string;
  role: 'admin' | 'dorm_manager' | 'student';
  created_at: string;
  updated_at: string;
}
/** 楼栋信息 */
export interface Building {
  id: number;
  name: string;
  floors: number;
  dormitories_per_floor: number;
  description?: string;
  created_at: string;
  updated_at: string;
}
/** 楼栋列表响应 */
export type BuildingsResponse = Building[];
/** 宿舍状态 */
export type DormitoryStatus = 'available' | 'occupied' | 'maintenance';
/** 宿舍信息 */
export interface Dormitory {
  id: number;
  build_id: number;
  building_name?: string;
  room_number: string;
  floor: number;
  capacity: number;
  current_occupancy: number;
  status: DormitoryStatus;
  created_at: string;
  updated_at: string;
}
/** 宿舍列表请求参数 */
export interface DormitoriesRequest extends PaginationParams {
  build_id?: number;
  status?: DormitoryStatus;
}
/** 宿舍列表响应 */
export type DormitoriesResponse = PaginatedData<Dormitory>;
/** 单个宿舍详情响应 */
export type DormitoryDetailResponse = Dormitory;
/** 学生信息 */
export interface Student {
  id: number;
  student_no: string;
  name: string;
  gender: 'male' | 'female';
  class_name?: string;
  phone?: string;
  dormitory_id?: number;
  dormitory_room?: string;
  building_name?: string;
  check_in_date?: string;
  check_out_date?: string;
  status: 'checked_in' | 'checked_out';
  created_at: string;
  updated_at: string;
}
/** 学生列表请求参数 */
export interface StudentsRequest extends PaginationParams {
  student_no?: string;
  name?: string;
}
/** 学生列表响应 */
export type StudentsResponse = PaginatedData<Student>;
/** 入住请求 */
export interface CheckInRequest {
  student_id: number;
  dormitory_id: number;
  check_in_date?: string;
}
/** 入住响应 */
export interface CheckInResponse {
  student_id: number;
  dormitory_id: number;
  check_in_date: string;
  message: string;
}
/** 退宿请求参数 */
export interface CheckOutRequest {
  check_out_date?: string;
}
/** 退宿响应 */
export interface CheckOutResponse {
  student_id: number;
  check_out_date: string;
  message: string;
}
/** API错误响应 */
export interface ApiError {
  code: number;
  message: string;
  details?: Record<string, unknown>;
}

/** 报修工单状态 */
export type RepairStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

/** 报修工单信息 */
export interface Repair {
  id: number;
  title: string;
  description: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  status: RepairStatus;
  location: string;
  reporter_id: number;
  reporter_name?: string;
  handler_id?: number;
  handler_name?: string;
  created_at: string;
  updated_at: string;
}

/** 报修工单列表请求参数 */
export interface RepairsRequest extends PaginationParams {
  status?: RepairStatus;
}

/** 报修工单列表响应 */
export type RepairsResponse = PaginatedData<Repair>;

/** 费用类型 */
export type ChargeType = 'accommodation' | 'electricity' | 'water' | 'other';

/** 费用状态 */
export type ChargeStatus = 'pending' | 'paid' | 'overdue';

/** 费用信息 */
export interface Charge {
  id: number;
  type: ChargeType;
  amount: number;
  status: ChargeStatus;
  student_id: number;
  student_name?: string;
  dormitory_id?: number;
  dormitory_room?: string;
  semester: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

/** 费用列表响应 */
export type ChargesResponse = PaginatedData<Charge>;

/** 公告信息 */
export interface Announcement {
  announcement_id: number;
  title: string;
  content: string;
  category?: string;
  is_top: boolean;
  status: string;
  publisher_id: number;
  publish_time?: string;
  expire_time?: string;
  created_at: string;
  updated_at: string;
}

/** 公告列表响应 */
export type AnnouncementsResponse = PaginatedData<Announcement>;

/** 入住率统计 */
export interface OccupancyStatistics {
  total_dormitories: number;
  occupied_dormitories: number;
  available_dormitories: number;
  occupancy_rate: number;
}

/** 报修统计 */
export interface RepairStatistics {
  total_repairs: number;
  pending_repairs: number;
  in_progress_repairs: number;
  completed_repairs: number;
}

/** 费用统计 */
export interface ChargeStatistics {
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
}