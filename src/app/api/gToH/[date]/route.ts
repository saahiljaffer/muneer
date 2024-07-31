import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import hijri from '@/lib/hijri'
import 'dayjs/locale/ar'
import preParsePostFormat from 'dayjs/plugin/preParsePostFormat'

export async function GET(
  request: Request,
  { params }: { params: { date: string } },
) {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.extend(hijri)
  dayjs.extend(preParsePostFormat)

  const date = dayjs(params.date).tz('America/Toronto').locale('ar')

  return Response.json({
    year: date.format('iYYYY'),
    month: date.format('iMMMM'),
    day: date.format('iD'),
  })
}
