export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main className="bg-slate-50">{children}</main>
    </div>
  )
}
