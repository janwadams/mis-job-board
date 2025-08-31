import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Star, Users, BarChart3, Settings } from "lucide-react";

export default function JobBoardMockups() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="p-6 space-y-10 bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen">
      {/* Header */}
      <header className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-bold text-emerald-800">MIS Student Job Board</h1>
        <p className="text-emerald-700">Your central hub for internships and job opportunities</p>
      </header>

      {/* --- Student Job Search --- */}
      <section className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-emerald-800">Browse Jobs</h2>
        <div className="flex flex-wrap gap-3">
          <Input placeholder="Search jobs..." className="flex-1" />
          <Select>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Job Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="fulltime">Full-Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Company" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="abc">ABC Tech</SelectItem>
              <SelectItem value="delta">Delta Corp</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-emerald-700 hover:bg-emerald-800">Search</Button>
        </div>

        {/* Job Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card className="rounded-2xl shadow-md border border-emerald-200">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-lg text-emerald-900">Data Analyst Intern</h3>
              <p className="text-emerald-700">ABC Tech • Internship • Deadline: Sep 30, 2025</p>
              <div className="flex justify-between items-center pt-2">
                <Button variant="outline" className="rounded-xl border-emerald-400 text-emerald-700">View Details</Button>
                <Button variant="ghost" size="icon" onClick={() => setSaved(!saved)}>
                  <Star className={`h-5 w-5 ${saved ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md border border-emerald-200">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-lg text-emerald-900">Systems Engineer</h3>
              <p className="text-emerald-700">Delta Corp • Full-Time • Deadline: Oct 15, 2025</p>
              <div className="flex justify-between items-center pt-2">
                <Button variant="outline" className="rounded-xl border-emerald-400 text-emerald-700">View Details</Button>
                <Button variant="ghost" size="icon">
                  <Star className="h-5 w-5 text-gray-400" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* --- Faculty/Company Job Posting Form --- */}
      <section className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-emerald-800">Post a Job</h2>
        <div className="grid gap-4">
          <Input placeholder="Job Title" />
          <Input placeholder="Company Name" />
          <Select>
            <SelectTrigger><SelectValue placeholder="Industry" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tech">Technology</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger><SelectValue placeholder="Job Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="fulltime">Full-Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>
          <Textarea placeholder="Job Description & Responsibilities" rows={3} />
          <Textarea placeholder="Required Skills/Qualifications" rows={2} />
          <Input type="date" />
          <Input placeholder="Application Method (Email / URL / Phone)" />
          <Button className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl">Submit Posting</Button>
        </div>
      </section>

      {/* --- Job Details / Apply Flow --- */}
      <section className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-emerald-800">Job Details</h2>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-emerald-900">Data Analyst Intern</h3>
          <p className="text-emerald-700">ABC Tech • Internship • Deadline: Sep 30, 2025</p>
          <p className="text-gray-700">Analyze data sets, build reports, collaborate with MIS team. Must know SQL & Python.</p>

          <div className="pt-3 space-y-2">
            <h4 className="font-semibold text-emerald-800">Apply via:</h4>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">Email Recruiter</Button>
            <Button variant="outline" className="w-full rounded-xl border-emerald-400 text-emerald-700">Visit Careers Page</Button>
            <p className="text-gray-600 text-sm">Optional: Call (123) 456-7890</p>
          </div>
        </div>
      </section>

      {/* --- Admin Dashboard --- */}
      <section className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold text-emerald-800">Admin Dashboard</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="rounded-2xl border border-emerald-200 shadow-md">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Users className="h-8 w-8 text-emerald-600" />
              <h3 className="font-semibold text-lg">User Management</h3>
              <p className="text-sm text-gray-600">Approve company reps, assign roles, disable accounts.</p>
              <Button className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">Manage Users</Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-emerald-200 shadow-md">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <BarChart3 className="h-8 w-8 text-emerald-600" />
              <h3 className="font-semibold text-lg">Metrics</h3>
              <p className="text-sm text-gray-600">Track active postings, views, and application clicks.</p>
              <Button className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">View Reports</Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-emerald-200 shadow-md">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Settings className="h-8 w-8 text-emerald-600" />
              <h3 className="font-semibold text-lg">Platform Settings</h3>
              <p className="text-sm text-gray-600">Configure industries, job types, approval workflows.</p>
              <Button className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">Adjust Settings</Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
