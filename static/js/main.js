// API 基础 URL
const API_BASE_URL = '/api/v1';

// 通用 API 请求函数
async function apiRequest(url, options = {}) {
    const token = localStorage.getItem('access_token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        localStorage.removeItem('access_token');
        window.location.href = '/';
        throw new Error('未授权，请重新登录');
    }

    return response.json();
}

// 登录表单处理
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const data = await apiRequest(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        localStorage.setItem('access_token', data.access_token);
        alert('登录成功！');
        window.location.href = '/dashboard.html';
    } catch (error) {
        alert('登录失败：' + error.message);
    }
});

// 获取宿舍列表示例
async function getDormitories() {
    try {
        const dormitories = await apiRequest(`${API_BASE_URL}/dormitories`);
        console.log('宿舍列表:', dormitories);
        return dormitories;
    } catch (error) {
        console.error('获取宿舍列表失败:', error);
    }
}

// 获取学生列表示例
async function getStudents() {
    try {
        const students = await apiRequest(`${API_BASE_URL}/students`);
        console.log('学生列表:', students);
        return students;
    } catch (error) {
        console.error('获取学生列表失败:', error);
    }
}