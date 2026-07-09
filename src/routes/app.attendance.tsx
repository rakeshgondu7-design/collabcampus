import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { attendanceBySubject, attendanceTrend } from "@/lib/mock-data";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/app/attendance")({ component: AttendancePage });

function AttendancePage() {
  const overall = Math.round(attendanceBySubject.reduce((s, a) => s + a.percent, 0) / attendanceBySubject.length);
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Attendance" description="Overall and subject-wise breakdown" icon={CalendarCheck} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 text-center">
          <div className="text-sm text-muted-foreground">Overall attendance</div>
          <div className="mt-2 text-5xl font-bold text-gradient">{overall}%</div>
          <Badge className="mt-2" variant={overall >= 75 ? "secondary" : "destructive"}>
            {overall >= 75 ? "Above threshold" : "Below 75%"}
          </Badge>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="text-sm font-semibold">Monthly trend</div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} domain={[60, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="percent" stroke="hsl(230 70% 55%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <div className="text-sm font-semibold">Subject-wise</div>
        <div className="mt-4 space-y-4">
          {attendanceBySubject.map((s) => (
            <div key={s.subject}>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="text-sm font-medium">{s.subject}</div>
                <div className="text-xs text-muted-foreground">{s.attended}/{s.total} classes • {s.percent}%</div>
              </div>
              <Progress value={s.percent} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <div className="text-xs text-muted-foreground">
          🔌 Ready for ERP integration — connect your institution's ERP to auto-sync attendance in real-time.
        </div>
      </Card>
    </div>
  );
}
