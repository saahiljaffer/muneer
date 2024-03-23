import Header from '~/components/Header'

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <footer>{/* TODO: add footer */}</footer>
    </div>
  )
}
