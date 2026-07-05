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

// 报修管理 API
export {
  getRepairs,
  getRepairById,
  createRepair,
  updateRepairStatus,
} from './repairs';

// 费用管理 API
export {
  getMyCharges,
  getAllCharges,
  getChargeById,
  payCharge,
} from './charges';

// 公告通知 API
export {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from './announcements';

// 统计数据 API
export {
  getOccupancyStatistics,
  getRepairStatistics,
  getChargeStatistics,
} from './statistics';