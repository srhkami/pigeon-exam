import {useToastApi} from "@/hooks";
import {EXAM_API_V2} from "@/lib/config.ts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


type StatsData = {
  period: string,
  total_answered: number,
  correct_answered: number,
  correct_rate: number,
}
type TrendData = {
  result: Array<StatsData>
}



export default function TestPage() {

  //
  // const data = useToastApi<TrendData>({url: EXAM_API_V2 + '/trend'})
  //
  // if (!data.data) return null;
  //

  const data = [
    {
      "period": "12/22~01/06",
      "total_answered": 0,
      "correct_answered": 0,
      "correct_rate": 0
    },
    {
      "period": "01/06~01/21",
      "total_answered": 0,
      "correct_answered": 0,
      "correct_rate": 0
    },
    {
      "period": "01/21~02/05",
      "total_answered": 0,
      "correct_answered": 0,
      "correct_rate": 0
    },
    {
      "period": "02/05~02/20",
      "total_answered": 0,
      "correct_answered": 0,
      "correct_rate": 0
    },
    {
      "period": "02/20~03/07",
      "total_answered": 0,
      "correct_answered": 0,
      "correct_rate": 0
    },
    {
      "period": "03/07~03/22",
      "total_answered": 383,
      "correct_answered": 137,
      "correct_rate": 36
    }
  ];

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis dataKey="correct_rate"  domain={[0,100]}/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="correct_rate" stroke="#8884d8" strokeWidth={2} label name='正確率' />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}