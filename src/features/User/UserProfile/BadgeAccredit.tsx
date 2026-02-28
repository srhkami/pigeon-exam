import {Badge} from "@/component";
import {handleHasAuth} from "@/auth/handleHasAuth.ts";
import {UserDetailData, UserInfo} from "@/types/user-types.ts";

type Props = {
  readonly user: UserDetailData | UserInfo,
}

export default function BadgeAccredit({user}: Props) {

  let color: "neutral" | "primary" | "secondary" | "accent" | "info" | "success" | "warning" | "error";
  let text: string

  if (user.wait_accredit == 1) {
    return <Badge size='xs' color='warning'>待審核</Badge>
  }

  if (!handleHasAuth(user.auth, 'C') && !handleHasAuth(user.auth, 'S') && !handleHasAuth(user.auth, 'T')) {
    return <Badge size='xs' color='neutral'>未認證</Badge>
  }

  if (user.expiry_days && user.expiry_days >= 0) {
    color = 'success';
    text = '已認證'
  } else if (user.expiry_days && user.expiry_days > -30 && user.expiry_days < 0) {
    color = 'warning';
    text = '需更新'
  } else if (user.expiry_days && user.expiry_days <= -30) {
    color = 'error';
    text = '已失效'
  } else {
    color = 'neutral';
    text = '不明'
  }

  return <Badge size='xs' color={color}>{text}</Badge>
}

