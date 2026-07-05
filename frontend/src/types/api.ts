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