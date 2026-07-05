import apiClient from './client';
import type {
  Student,
  CheckInRequest,
  CheckOutRequest,
} from '@/types/api';

/** 获取学生列表 */
export const getStudents = async (
  studentNo?: string,
  name?: string,
  params?: { skip?: number; limit?: number }
): Promise<Student[]> => {
  const queryParams: Record<string, unknown> = { ...params };

  if (studentNo !== undefined && studentNo.trim() !== '') {
    queryParams.student_no = studentNo;
  }

  if (name !== undefined && name.trim() !== '') {
    queryParams.name = name;
  }

  const response = await apiClient.get<Student[]>('/students', {
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
): Promise<{ message: string; bed_number: number }> => {
  const response = await apiClient.post<{ message: string; bed_number: number }>(
    '/students/checkin',
    data
  );
  return response.data;
};

/** 学生退宿 */
export const checkOut = async (
  data: CheckOutRequest
): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(
    '/students/checkout',
    data
  );
  return response.data;
};
