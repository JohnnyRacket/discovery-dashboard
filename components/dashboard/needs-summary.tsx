import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface NeedsSummaryProps {
  summary?: string
}

export function NeedsSummary({ summary }: NeedsSummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">AI Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {summary ? (
          <div className="text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: summary }} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Summaries will appear here after generating them from individual sessions.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
