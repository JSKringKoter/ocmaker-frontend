import request from './request'

// AI 绘图配置接口
export interface AiGenerateConfig {
  style: number      // 画风
  expression: number // 表情
  proximity: number  // 人物所占比例
  background: number // 背景
}

// AI 绘图请求参数接口
export interface GenerateImageParams {
  clothesId: number
  clothesOcId: number
  apiKey: string
  config: AiGenerateConfig
}

// AI 绘图响应数据接口
export interface GenerateImageResponse {
  imgUrl: string
}

// 生成图片的 API 函数
export const generateImage = async (params: GenerateImageParams) => {
  return request.post<GenerateImageResponse>('/generate-image', params)
}

// 删除服装的请求参数接口
export interface DeleteClothesParams {
  clothesId: number
}

// 删除服装的 API 函数
export const deleteClothes = async (params: DeleteClothesParams) => {
  return request.post('/generate-image/delete', params)
} 