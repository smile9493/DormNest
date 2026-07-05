/**
 * API 统一导出
 */

// API 客户端配置
export { default as apiClient, getToken, setToken, removeToken } from './client';

// 认证 API
export {
  login,
  register,
  logout,
  getCurrentUser,
  validateToken,
  updateProfile,
  changePassword,
} from './auth';

// 楼栋和宿舍 API
export {
  getBuildings,
  getBuildingById,
  getDormitories,
  getDormitoryById,
} from './dormitories';

// 学生管理 API
export {
  getStudents,
  getStudentById,
  checkIn,
  checkOut,
} from './students';