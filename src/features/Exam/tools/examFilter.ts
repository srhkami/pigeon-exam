import {FilterConfig} from "@/types/api-types.ts";

export const examFilter:Array<FilterConfig> = [
  {
    title: '出處',
    fieldName: 'source',
    options: [
      {label: '三等特考', value: '三等特考'},
      {label: '四等特考', value: '四等特考'},
      {label: '不限', value: '不限'},
    ]
  },
  {
    title: '類科',
    fieldName: 'category',
    options: [
      {label: '共同', value: '共同'},
      {label: '行政', value: '行政'},
      // {label: '外事', value: '外事'},
      {label: '刑事', value: '刑事'},
      // {label: '公安', value: '公安'},
      // {label: '犯防', value: '犯防'},
      {label: '交通', value: '交通'},
      // {label: '電訊', value: '電訊'},
      {label: '資管', value: '資管'},
      {label: '鑑識', value: '鑑識'},
      // {label: '法制', value: '法制'},
      // {label: '國境', value: '國境'},
      // {label: '消防', value: '消防'},
      // {label: '水上', value: '水上'},
      {label: '不限', value: '不限'},
    ]
  },
  {
    title: '科目',
    fieldName: 'subject',
    options: [
      {label: '警察法規', value: '警察法規'},
      {label: '警察情境實務', value: '警察情境實務'},
      {label: '犯罪偵查', value: '犯罪偵查'},
      {label: '警察勤務', value: '警察勤務'},
      {label: '警察政策與犯罪預防', value: '警察政策與犯罪預防'},
      {label: '刑案現場處理與刑事鑑識', value: '刑案現場處理與刑事鑑識'},
      {label: '偵查法學', value: '偵查法學'},
    ]
  },
]