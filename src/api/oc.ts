import request from './request'

// OC接口类型定义
export interface OcData {
  name: string
  gender: string
  age: number
  height: number
  weight: number
  skinColor: string
  hair: string
  hairColor: string
  eyesColor: string
  body: string
  face: string
  personality: string
  skill: string
  hobby: string
}

// 详细信息类型
export interface OcDetail {
  name: string
  gender: string
  age: number
  height: number
  weight: number
  skinColor: string
  hair: string
  hairColor: number
  eyesColor: string
  body: string
  face: string
  personality: string
  skill: string
  hobby: string
  favouriteClothesId: number | null
}

// OC基础信息接口
export interface OcBaseInfo {
  ocId: number
  name: string
  gender: string
  age: number
  favouriteClothesId: number | null
  abbUrl: string | null
}

// 创建新OC的API函数
export const createNewOc = async (ocData: OcData) => {
  return request.post('/oc/new', ocData)
}

// 获取OC基础信息列表
export const getOcBaseInfo = async () => {
  return request.get('/oc/base-info')
} 

// 获取单个OC详细信息
export const getOcDetail = async (ocId: number) => {
  return request.get(`/oc/detail/${ocId}`)
}

// 添加更新OC详情的API函数
export const updateOcDetail = async (ocId: number, data: OcDetail) => {
  return request.put(`/oc/detail/${ocId}`, data)
}

// 删除OC的API函数
export const deleteOc = async (ocId: number) => {
  return request.delete(`/oc/delete/${ocId}`)
}

// 批量删除OC的API函数
export const batchDeleteOcs = async (ocIds: number[]) => {
  return request.delete('/oc/batch-delete', { data: ocIds })
}
