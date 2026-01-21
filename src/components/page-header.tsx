type PageHeaderProps = {
  title: string
  description: string
}

export const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="mt-6 text-lg text-muted-foreground">{description}</p>
    </div>
  )
}
