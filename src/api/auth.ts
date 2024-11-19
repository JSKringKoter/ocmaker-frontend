import request from './request'

export interface LoginResponse {
  code: number
  msg: string | null
  data: {
    name: string
    token: string
  }
}

export interface LoginParams {
  account: string
  password: string
}

export const login = async (params: LoginParams): Promise<LoginResponse> => {
  return request.post('/login', params)
} 