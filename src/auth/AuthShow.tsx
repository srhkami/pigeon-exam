import {handleHasAuth} from "@/auth/handleHasAuth.ts";
import {AuthType} from "@/types/auth-types.ts";
import {Badge} from "@/component";
import {useAuth} from "@/hooks";

const authList: Array<{ type: AuthType, label: string, tip: string }> = [
  {
    type: 'AM',
    label: '最高權限',
    tip: '可瀏覽、編輯所有功能'
  },
  {
    type: 'UM',
    label: '會員管理',
    tip: '可瀏覽會員列表、進行會員審核'
  },
  {
    type: 'CM',
    label: '警政管理',
    tip: '可編輯開心上班資料庫、警察執法初探'
  },
  {
    type: 'TM',
    label: '交通管理',
    tip: '可編輯交通函釋'
  },
  {
    type: 'EM',
    label: '測驗管理',
    tip: '可編輯測驗功能、查看學生測驗結果'
  },
  {
    type: 'EH',
    label: '測驗協作',
    tip: '可編輯測驗題目'
  },
  {
    type: 'E',
    label: '測驗權限',
    tip: '可使用考題測驗功能'
  },
  {
    type: 'C',
    label: '進階警政',
    tip: '可瀏覽開心上班資料庫'
  },
  {
    type: 'T',
    label: '交通權限',
    tip: '可瀏覽交通函釋'
  },
  {
    type: 'S',
    label: '基本警政',
    tip: '可瀏覽警察法規、作業程序、執法初探'
  },
]

/* 權限顯示的組件 */
export default function AuthShow() {

  const {userInfo} = useAuth();
  const auth = userInfo.auth;

  const items = authList.map(item => {
    if (handleHasAuth(auth, item.type)) {
      return (
          <div className="tooltip cursor-pointer flex m-1" data-tip={item.tip} key={item.type}>
            <Badge size='xs' color='info'>{item.label}</Badge>
          </div>
      )
    } else {
      return null
    }
  })

  return (
    <div className='flex flex-wrap items-center justify-center'>
      {items.length ?
        items :
          '無權限'
      }
    </div>
  )
}
