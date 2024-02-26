import { SketchContext, SketchProvider } from "./context"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <SketchProvider>
      {children}
    </SketchProvider>
  )
}
