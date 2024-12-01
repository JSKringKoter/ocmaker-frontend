import request from './request'

// 服装基础信息接口
export interface ClothesBaseInfo {
  clothesId: number
  clothesOcId: number
  name: string
  imgUrl: string
  abbImgUrl: string
  describe: string
}

// 服装详细信息接口
export interface ClothesData {
    clothesId?: number
    name: string
    describe: string
    imgUrl?: string
    abbImgUrl?: string
    hat?: string
    faceDecorate?: string
    uppers?: string
    belt?: string
    bottoms?: string
    legDecorate?: string
    shoes?: string
    otherDecorate?: string
    clothesOcId: number
  }

// 更新服装时使用的接口
export interface ClothesDetailVO extends Omit<ClothesData, 'clothesId' | 'clothesOcId'> {
    clothesId: number
    clothesOcId: number
}

  

// 获取服装基础信息列表
export const getClothesBaseInfo = async (ocId: number) => {
  return request.get(`/clothes/base-info/${ocId}`)
}


// 创建新服装的API函数
export const createNewClothes = async (clothesData: ClothesData) => {
  return request.post('/clothes/new', clothesData)
}

// 修改获取服装详情的接口
interface ClothesDetailParams {
  clothesId: number
  clothesOcId: number
}

// 获取服装详情
export const getClothesDetail = async (params: ClothesDetailParams) => {
  return request.post('/clothes/detail', params)
}

// 修改更新服装的 API 函数
export const updateClothes = async (clothesData: ClothesDetailVO) => {
    return request.post('/clothes/update', clothesData)
}

// 删除服装的API函数
export const deleteClothes = async (params: ClothesDetailParams) => {
  return request.post('/clothes/delete', params)
} 