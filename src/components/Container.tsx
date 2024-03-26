import Header from '~/components/Header'

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className="bg-slate-50">{children}</main>
      <footer>{/* TODO: add footer */}</footer>
    </div>
  )
}
