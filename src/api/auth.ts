import request from './request'

// 注册请求参数接口
export interface RegisterParams {
  username: string
  password: string
}

// 登录请求参数接口
export interface LoginParams {
  username: string
  password: string
}

// 登录响应接口
export interface LoginResponse {
  token: string
  username: string
}

// 用户信息接口
export interface UserInfo {
  userId: number
  username: string
}

// 注册API
export const register = async (params: RegisterParams) => {
  return request.post('/auth/register', params)
}

// 登录API
export const login = async (params: LoginParams) => {
  return request.post('/auth/login', params)
}

// 获取当前用户信息
export const getCurrentUser = async () => {
  return request.get('/auth/current-user')
}

// 退出登录
export const logout = async () => {
  return request.post('/auth/logout')
} 