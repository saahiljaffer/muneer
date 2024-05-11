import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

import NewCalendar from '~/components/Calendar'
import Container from '~/components/Container'
import hijri from '~/utils/hijri'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(advancedFormat)
dayjs.extend(hijri)

export default function IndexPage() {
  return (
    <Container>
      <section>
        <div className="min-h-screen">
          <NewCalendar />
        </div>
      </section>
    </Container>
  )
}
