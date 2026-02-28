import {Badge} from "@/component";

type Props = {
  type:'new' | 'fix' | 'info' | 'delete',
}

export default function BadgeLog({type}:Props){

  if(type === 'new'){
    return <Badge size='sm' color='primary'>新增</Badge>
  }else if(type === 'fix'){
    return <Badge size='sm' color='error'>修復</Badge>
  }else if(type === 'info'){
    return <Badge size='sm' color='success'>改善</Badge>
  }else{
    return <Badge size='sm' color='neutral'>棄用</Badge>
  }
}