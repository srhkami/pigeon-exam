import {TVersion} from "@/types/about-types.ts";


export const CHANGE_LOGS: Array<TVersion> = [
  {
    version: '1.0.0',
    date: '1150302',
    logs: [
      {type: 'new', text: '【全站】將本功能從鴿手網站中獨立。'},
    ]
  }
]

export const APP_VER = CHANGE_LOGS[0].version;
export const UPDATE_AT = CHANGE_LOGS[0].date;