const ACCENT = "#C8AB68";

type Row = { label: string; count: number };

export function StatisticsProvenanceBars({ rows }: { rows: Row[] }) {
  const total = rows.reduce((s, r) => s + r.count, 0);
  const maxVal = Math.max(1, ...rows.map((r) => r.count));

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1 flex justify-between gap-4 text-sm">
            <span className="truncate font-medium">{row.label}</span>
            <span className="text-muted-foreground shrink-0 tabular-nums">
              {total ? `${Math.round((row.count / total) * 100)}%` : "0%"}
            </span>
          </div>
          <div className="bg-muted h-2 w-full rounded-full">
            <div
              className="h-2 rounded-full transition-[width]"
              style={{
                width: `${(row.count / maxVal) * 100}%`,
                backgroundColor: ACCENT,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
