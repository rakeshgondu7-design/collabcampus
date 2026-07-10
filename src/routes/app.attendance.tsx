import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Users, Check, X, Save } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { attendanceBySubject, attendanceTrend } from "@/lib/mock-data";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/app/attendance")({ component: AttendancePage });

const STUDENTS = [
  { id: "CSE21B045", name: "Aarav Sharma" },
  { id: "CSE21B012", name: "Priya Nair" },
  { id: "CSE21B023", name: "Rahul Menon" },
  { id: "CSE21B034", name: "Sneha Iyer" },
  { id: "CSE21B056", name: "Vikram Rao" },
  { id: "CSE21B067", name: "Ananya Gupta" },
  { id: "CSE21B078", name: "Karthik Reddy" },
  { id: "CSE21B089", name: "Meera Joshi" },
  { id: "CSE21B090", name: "Rohan Kumar" },
  { id: "CSE21B091", name: "Divya Pillai" },
];

function StudentView() {
  const overall = Math.round(attendanceBySubject.reduce((s, a) => s + a.percent, 0) / attendanceBySubject.length);
  return (
    <>
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
    </>
  );
}

function FacultyMarking() {
  const [subject, setSubject] = useState("Operating Systems");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<Record<string, "present" | "absent">>(
    () => Object.fromEntries(STUDENTS.map((s) => [s.id, "present"])),
  );

  const present = useMemo(() => Object.values(status).filter((v) => v === "present").length, [status]);

  const setAll = (v: "present" | "absent") =>
    setStatus(Object.fromEntries(STUDENTS.map((s) => [s.id, v])));

  const submit = () => {
    toast.success(`Attendance saved — ${present}/${STUDENTS.length} present in ${subject}`);
  };

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[180px]">
          <div className="mb-1 text-xs font-medium text-muted-foreground">Subject</div>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div>
          <div className="mb-1 text-xs font-medium text-muted-foreground">Date</div>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setAll("present")}>Mark all present</Button>
          <Button variant="outline" size="sm" onClick={() => setAll("absent")}>Mark all absent</Button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Roll No.</th>
              <th className="p-3">Name</th>
              <th className="p-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {STUDENTS.map((s) => {
              const v = status[s.id];
              return (
                <tr key={s.id} className="border-t">
                  <td className="p-3 font-medium">{s.id}</td>
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant={v === "present" ? "default" : "outline"}
                        onClick={() => setStatus((p) => ({ ...p, [s.id]: "present" }))}
                      >
                        <Check className="mr-1 h-3.5 w-3.5" /> Present
                      </Button>
                      <Button
                        size="sm"
                        variant={v === "absent" ? "destructive" : "outline"}
                        onClick={() => setStatus((p) => ({ ...p, [s.id]: "absent" }))}
                      >
                        <X className="mr-1 h-3.5 w-3.5" /> Absent
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {present} of {STUDENTS.length} marked present
        </div>
        <Button onClick={submit}><Save className="mr-1 h-4 w-4" /> Save attendance</Button>
      </div>
    </Card>
  );
}

function AttendancePage() {
  const { user } = useAuth();
  const isFaculty = user?.role === "Faculty" || user?.role === "Admin";

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Attendance"
        description={isFaculty ? "Mark attendance for your class and review analytics" : "Overall and subject-wise breakdown"}
        icon={CalendarCheck}
      />

      {isFaculty ? (
        <Tabs defaultValue="mark">
          <TabsList>
            <TabsTrigger value="mark"><Users className="mr-1 h-4 w-4" /> Mark attendance</TabsTrigger>
            <TabsTrigger value="analytics">Class analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="mark" className="mt-4">
            <FacultyMarking />
          </TabsContent>
          <TabsContent value="analytics" className="mt-4">
            <StudentView />
          </TabsContent>
        </Tabs>
      ) : (
        <StudentView />
      )}

      <Card className="mt-6 p-6">
        <div className="text-xs text-muted-foreground">
          🔌 Ready for ERP integration — connect Lovable Cloud to persist attendance and sync with your institution's ERP.
        </div>
      </Card>
    </div>
  );
}
