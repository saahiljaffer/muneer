import NewCalendar from '~/components/Calendar'
import Container from '~/components/Container'

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
