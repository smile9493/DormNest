import apiClient from './client';
import type {
  Student,
  StudentsRequest,
  StudentsResponse,
  CheckInRequest,
  CheckInResponse,
  CheckOutResponse,
} from '@/types/api';

/** 获取学生列表 */
export const getStudents = async (
  studentNo?: string,
  name?: string,
  params?: { page?: number; page_size?: number }
): Promise<StudentsResponse> => {
  const queryParams: StudentsRequest = { ...params };

  if (studentNo !== undefined && studentNo.trim() !== '') {
    queryParams.student_no = studentNo;
  }

  if (name !== undefined && name.trim() !== '') {
    queryParams.name = name;
  }

  const response = await apiClient.get<StudentsResponse>('/students', {
    params: queryParams,
  });

  return response.data;
};

/** 获取单个学生详情 */
export const getStudentById = async (studentId: number): Promise<Student> => {
  const response = await apiClient.get<Student>(`/students/${studentId}`);
  return response.data;
};

/** 学生入住办理 */
export const checkIn = async (
  data: CheckInRequest
): Promise<CheckInResponse> => {
  const response = await apiClient.post<CheckInResponse>(
    '/students/check-in',
    data
  );
  return response.data;
};

/** 学生退宿 */
export const checkOut = async (
  studentId: number,
  checkOutDate?: string
): Promise<CheckOutResponse> => {
  const response = await apiClient.post<CheckOutResponse>(
    `/students/${studentId}/check-out`,
    { check_out_date: checkOutDate }
  );
  return response.data;
};