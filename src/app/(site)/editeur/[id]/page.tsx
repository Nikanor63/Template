import { EditorShell } from '@/components/editor/editor-shell'

export default async function EditeurPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <EditorShell id={id} />
}
