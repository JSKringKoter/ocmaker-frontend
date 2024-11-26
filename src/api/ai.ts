import request from './request'

// AI 绘图请求参数接口
export interface GenerateImageParams {
  clothesId: number
  clothesOcId: number
  apiKey: string
}

// AI 绘图响应数据接口
export interface GenerateImageResponse {
  imgUrl: string
}

// 生成图片的 API 函数
export const generateImage = async (params: GenerateImageParams) => {
  return request.post<GenerateImageResponse>('/generate-image', params)
} 