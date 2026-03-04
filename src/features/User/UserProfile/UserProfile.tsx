import {DetailRow} from "@/component";
import {useAxios} from "@/hooks";
import {useEffect, useState} from "react";
import {USER_API} from "@/lib/config.ts";
import {errorLogger, showToast} from "@/func";
import BadgeAccredit from "./BadgeAccredit.tsx";
import ModalChangePassword from "./ModalChangePassword.tsx";
import {UserDetailData} from "@/types/user-types.ts";
import PageHeader from "@/features/Layout/PageHeader.tsx";
import AuthShow from "@/auth/AuthShow.tsx";

export default function UserProfile() {

  const title = '會員個人資料';
  const api = useAxios();
  const [user, setUser] = useState<UserDetailData | null>(null);

  const requestData = async () => {
    const res = await api({
      method: 'GET',
      url: USER_API + '/get_self_detail/',
    })
    return res.data as UserDetailData
  }

  useEffect(() => {
    showToast(requestData, {label: '載入'})
      .then(data => setUser(data))
      .catch(err => errorLogger(err, '載入會員詳情錯誤'))
  }, []);

  return (
    <div className="card bg-base-100 card-border border-base-300 card-sm">
      <div className='card-body'>
        <PageHeader title={title} as='h4' divider={false}/>
        <div className='divider m-0'></div>
        <ul className="list rounded-box mx-2">
          <DetailRow
            start='會員名稱：'
            center={user?.name}
          />
          <DetailRow
            start='信箱：'
            center={user?.email}
          />
          <DetailRow
            start='密碼：'
            center={<ModalChangePassword/>}
          />
          <DetailRow
            start={<span className='font-bold text-primary'>實名認證</span>}
          />
          <DetailRow
            start='認證狀態：'
            center={user && <BadgeAccredit user={user}/>}
          />
          <DetailRow
            start='權限效期：'
            center={`${user?.accredit_expiry}（剩餘${user?.expiry_days}天）`}
          />
          <DetailRow
            start='帳號權限：'
            center={<AuthShow/>}
          />
          <DetailRow
            start='單位：'
            center={<>{user?.unit_first} {user?.unit_second} {user?.unit_third}</>}
          />
          <DetailRow
            start='職稱：'
            center={user?.job_title}
          />
          <DetailRow
            start='手機：'
            center={user?.phone}
          />
          <DetailRow
            start='Line ID：'
            center={user?.line_id}
          />
          <DetailRow
            start={<span className='font-bold text-primary'>Line綁定</span>}
          />
          <DetailRow
            start='交通小鴿手：'
            center={user?.line_connect.includes('tp') && '已綁定'}
          />
          <DetailRow
            start='開心上班：'
            center={user?.line_connect.includes('hp') && '已綁定'}
          />
        </ul>
      </div>
    </div>
  )
}