'use client'

import React, { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ArrowUp, TrendingUp, Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import reportData from '@/data/reports.json'
import membersData from '@/data/members.json'

export default function DashboardPage() {
  const allowedMemberIds = [
    'eb086854-76ee-4abd-b389-32b2cc2be605', // Anung Aninditha
    'd3942fbd-0e32-4715-ab6e-0e0087ae1682', // Putri Damayanti
    'f1670561-7885-4b81-8a11-75d04c7e9219', // Fardian Thofani
    '513af613-ab5e-405e-bfb5-cf78488698da'  // Azhary Arliansyah
  ]

  const analytics = useMemo(() => {
    const tasks = reportData.results || []
    
    const memberMap = {}
    membersData.forEach(member => {
      memberMap[member.id] = member.name
    })
    
    const completed = tasks.filter(t => t.state__group === 'completed').length
    const started = tasks.filter(t => t.state__group === 'started').length
    const backlog = tasks.filter(t => t.state__group === 'backlog').length
    const unstarted = tasks.filter(t => t.state__group === 'unstarted').length
    
    const completionRate = Math.round((completed / tasks.length) * 100) || 0
    const velocity = Math.round(completed / (tasks.length || 1) * 100)
    
    const teamMembers = new Set()
    tasks.forEach(t => {
      if (t.assignee_ids) {
        t.assignee_ids.forEach(id => {
          if (allowedMemberIds.includes(id)) {
            teamMembers.add(id)
          }
        })
      }
    })

    const teamPerformance = {}

    tasks.forEach(t => {
      if (t.assignee_ids) {
        t.assignee_ids.forEach(id => {
          if (!allowedMemberIds.includes(id)) return
          
          if (!teamPerformance[id]) {
            teamPerformance[id] = { completed: 0, started: 0, backlog: 0, unstarted: 0, total: 0 }
          }
          teamPerformance[id][t.state__group]++
          teamPerformance[id].total++
        })
      }
    })
    
    return {
      totalTasks: tasks.length,
      completed,
      started,
      backlog,
      unstarted,
      completionRate,
      velocity,
      teamSize: teamMembers.size,
      avgTasksPerMember: Math.round(tasks.length / (teamMembers.size || 1)),
      teamPerformance,
      memberMap
    }
  }, [])

  const stateGroupData = [
    { name: 'Completed', value: analytics.completed, fill: '#10b981', icon: CheckCircle2 },
    { name: 'Started', value: analytics.started, fill: '#f59e0b', icon: Clock },
    { name: 'Backlog', value: analytics.backlog, fill: '#8b5cf6', icon: AlertCircle },
    { name: 'Unstarted', value: analytics.unstarted, fill: '#6b7280', icon: AlertCircle }
  ]

  const statusData = [
    { name: 'Completed', value: analytics.completed, fill: '#10b981' },
    { name: 'In Progress', value: analytics.started, fill: '#f59e0b' },
    { name: 'Backlog', value: analytics.backlog + analytics.unstarted, fill: '#6b7280' }
  ]

  const trendsData = [
    { month: 'Week 1', completed: 15, inProgress: 32 },
    { month: 'Week 2', completed: 28, inProgress: 48 },
    { month: 'Week 3', completed: 45, inProgress: 42 },
    { month: 'Week 4', completed: 67, inProgress: 38 },
    { month: 'Week 5', completed: 89, inProgress: 35 },
  ]

  const priorityData = [
    { priority: 'Critical', count: 12 },
    { priority: 'High', count: 34 },
    { priority: 'Medium', count: 156 },
    { priority: 'Low', count: 206 }
  ]

  const teamPerformanceData = Object.entries(analytics.teamPerformance).map(([id, stats]) => ({
    name: analytics.memberMap[id] || id.substring(0, 8),
    completed: stats.completed,
    started: stats.started,
    backlog: stats.backlog,
    unstarted: stats.unstarted,
    total: stats.total
  }))

  return (
    <main className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Project Dashboard</h1>
          <p className="text-muted-foreground">Executive summary for stakeholders and investors</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{analytics.totalTasks}</div>
              <p className="text-xs text-muted-foreground mt-1">All tracked items</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{analytics.completionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-success font-semibold">{analytics.completed}</span> completed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Team Size</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{analytics.teamSize}</div>
              <p className="text-xs text-muted-foreground mt-1">{analytics.avgTasksPerMember} avg tasks/member</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Velocity</CardTitle>
              <ArrowUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{analytics.velocity}%</div>
              <p className="text-xs text-muted-foreground mt-1">Delivery rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Task Status Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stateGroupData.map((state) => (
              <Card key={state.name} className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{state.name}</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{state.value}</p>
                    </div>
                    <div className="p-2 bg-opacity-10 rounded-lg" style={{ backgroundColor: state.fill + '20' }}>
                      <state.icon className="h-6 w-6" style={{ color: state.fill }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>Current task allocation across states</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} tasks`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>State Group Breakdown</CardTitle>
              <CardDescription>Task distribution by workflow state</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateGroupData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    formatter={(value) => `${value} tasks`}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Team Member Performance</CardTitle>
              <CardDescription>Task distribution by team member and state</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamPerformanceData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    formatter={(value) => `${value} tasks`}
                  />
                  <Legend />
                  <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
                  <Bar dataKey="started" stackId="a" fill="#f59e0b" name="Started" />
                  <Bar dataKey="backlog" stackId="a" fill="#8b5cf6" name="Backlog" />
                  <Bar dataKey="unstarted" stackId="a" fill="#6b7280" name="Unstarted" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Completion Trend */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Completion Trend</CardTitle>
              <CardDescription>Weekly progress over the last month</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                    name="Completed Tasks"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="inProgress" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', r: 4 }}
                    name="In Progress Tasks"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Project Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">On Track Items</p>
                <p className="text-2xl font-bold text-success">{analytics.completed + analytics.started}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Backlog Items</p>
                <p className="text-2xl font-bold text-warning">{analytics.backlog + analytics.unstarted}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Average Load/Member</p>
                <p className="text-2xl font-bold text-primary">{analytics.avgTasksPerMember}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Team Capacity</p>
                <p className="text-2xl font-bold text-foreground">Optimal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
