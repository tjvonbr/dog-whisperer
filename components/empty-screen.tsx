interface EmptyScreenProps {
  title: string
  description: string
}

export function EmptyScreen({ title, description }: EmptyScreenProps) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="leading-normal text-muted-foreground">{description}</p>
        <p className="leading-normal text-muted-foreground">
          This is a free tool, but you&apos;ll need to create an account to
          access our dog-training AI chatbot!
        </p>
      </div>
    </div>
  )
}
