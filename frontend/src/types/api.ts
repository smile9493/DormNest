/** 统一API响应格式 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

/** 登录请求 */
export interface LoginRequest {
  username: string;
  password: string;
}

/** 用户信息（与后端 auth_schema.UserInfo 对齐） */
export interface UserInfo {
  id: number;
  username: string;
  real_name?: string;
  role: 'admin' | 'student' | 'repairman';
  email?: string;
  phone?: string;
}

/** 登录响应（与后端 auth_schema.LoginResponse 对齐） */
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

/** 楼栋信息（与后端 building_schema.BuildingResponse 对齐） */
export interface Building {
  build_id: number;
  build_name: string;
  dorm_count: number;
  dorm_floor: number;
  address?: string;
  created_at: string;
  updated_at: string;
}

/** 宿舍状态（与后端 dormitory_status 枚举对齐） */
export type DormitoryStatus = 'available' | 'full' | 'maintenance';

/** 宿舍信息（与后端 dormitory_schema.DormitoryWithBuildingResponse 对齐） */
export interface Dormitory {
  dorm_id: number;
  build_id: number;
  room_number: string;
  floor?: number;
  bed_count: number;
  occupied_beds: number;
  status: DormitoryStatus;
  price?: number;
  created_at: string;
  updated_at: string;
  building_name?: string;
  available_beds: number;
  occupancy_rate: number;
}

/** 宿舍列表请求参数 */
export interface DormitoriesRequest {
  build_id?: number;
  status?: DormitoryStatus;
  skip?: number;
  limit?: number;
}

/** 学生性别 */
export type StudentGender = 'male' | 'female';

/** 学生状态（与后端 student_status 枚举对齐） */
export type StudentStatus = 'living' | 'graduated' | 'leave';

/** 学生信息（与后端 student_schema.StudentWithDormitoryResponse 对齐） */
export interface Student {
  student_id: number;
  student_no: string;
  name: string;
  gender: StudentGender;
  phone?: string;
  department?: string;
  class_name?: string;
  dorm_id?: number;
  bed_number?: number;
  check_in_date?: string;
  status: StudentStatus;
  created_at: string;
  updated_at: string;
  building_name?: string;
  room_number?: string;
}

/** 学生列表请求参数 */
export interface StudentsRequest {
  student_no?: string;
  name?: string;
  skip?: number;
  limit?: number;
}

/** 入住请求（与后端 student_schema.CheckInRequest 对齐） */
export interface CheckInRequest {
  student_id: number;
  dorm_id: number;
  bed_number?: number;
}

/** 退宿请求（与后端 student_schema.CheckOutRequest 对齐） */
export interface CheckOutRequest {
  student_id: number;
}

/** 报修工单状态（与后端 repair_status 枚举对齐） */
export type RepairStatus = 'pending' | 'assigned' | 'processing' | 'completed' | 'cancelled';

/** 报修优先级 */
export type RepairPriority = 'low' | 'medium' | 'high' | 'urgent';

/** 报修工单信息（与后端 repair_schema.RepairWithDetailsResponse 对齐） */
export interface Repair {
  repair_id: number;
  student_id: number;
  dorm_id: number;
  title: string;
  description?: string;
  category?: string;
  status: RepairStatus;
  priority: RepairPriority;
  assigned_to?: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  feedback?: string;
  student_name?: string;
  student_no?: string;
  room_number?: string;
  building_name?: string;
}

/** 创建报修工单请求 */
export interface RepairCreateRequest {
  dorm_id: number;
  title: string;
  description?: string;
  category?: string;
  priority?: RepairPriority;
}

/** 更新工单状态请求 */
export interface RepairStatusUpdateRequest {
  status: RepairStatus;
  assigned_to?: number;
  feedback?: string;
}

/** 费用状态（与后端 charge_pay_status 枚举对齐） */
export type ChargeStatus = 'unpaid' | 'paid' | 'overdue';

/** 费用信息（与后端 charge_schema.ChargeWithStudentResponse 对齐） */
export interface Charge {
  charge_id: number;
  student_id: number;
  charge_type: string;
  amount: number;
  charge_date: string;
  due_date?: string;
  pay_status: ChargeStatus;
  pay_date?: string;
  pay_method?: string;
  memo?: string;
  created_at: string;
  updated_at: string;
  student_name?: string;
  student_no?: string;
}

/** 缴费请求 */
export interface ChargePayRequest {
  pay_method?: string;
}

/** 公告信息（与后端 announcement_schema.AnnouncementResponse 对齐） */
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

/** 入住率统计（与后端 statistics/occupancy 响应对齐） */
export interface OccupancyStatistics {
  total_dormitories: number;
  total_beds: number;
  occupied_beds: number;
  available_beds: number;
  occupancy_rate: number;
  buildings: Array<{
    build_name: string;
    total_rooms: number;
    total_beds: number;
    occupied_beds: number;
    available_beds: number;
    occupancy_rate: number;
  }>;
}

/** 报修统计（与后端 statistics/repairs 响应对齐） */
export interface RepairStatistics {
  total_repairs: number;
  pending: number;
  assigned: number;
  processing: number;
  completed: number;
  cancelled: number;
  completion_rate: number;
}

/** 费用统计（与后端 statistics/charges 响应对齐） */
export interface ChargeStatistics {
  total_amount: number;
  paid: { amount: number; count: number };
  unpaid: { amount: number; count: number };
  overdue: { amount: number; count: number };
  collection_rate: number;
}

/** 学生统计（与后端 statistics/students 响应对齐） */
export interface StudentStatistics {
  total_students: number;
  living: number;
  graduated: number;
  leave: number;
  checked_in: number;
  not_checked_in: number;
}

/** API错误响应 */
export interface ApiError {
  code: number;
  message: string;
  details?: Record<string, unknown>;
}
