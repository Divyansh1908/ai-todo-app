'use client'

import { CheckSquare, Clock, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import MainLayout from '@/components/MainLayout'

export default function Dashboard() {
  const quickStats = [
    {
      title: 'Active Tasks',
      value: '12',
      icon: CheckSquare,
      color: 'bg-blue-500',
      description: 'Tasks in progress'
    },
    {
      title: 'Completed Today',
      value: '8',
      icon: TrendingUp,
      color: 'bg-green-500',
      description: 'Tasks finished today'
    },
    {
      title: 'Due This Week',
      value: '5',
      icon: Clock,
      color: 'bg-orange-500',
      description: 'Upcoming deadlines'
    },
    {
      title: 'Team Projects',
      value: '3',
      icon: Users,
      color: 'bg-purple-500',
      description: 'Collaborative tasks'
    }
  ]

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="mb-2">Welcome back, Divy!</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.title} className="bg-card border rounded-lg p-6 card-shadow interactive">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-primary p-2 rounded-lg">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <h3 className="font-semibold mb-1">{stat.title}</h3>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </div>
            )
          })}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-card border rounded-lg p-6 card-shadow">
              <h2 className="mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Completed "Setup database connection"</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Started working on "Frontend redesign"</p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Due date approaching for "Team meeting"</p>
                    <p className="text-xs text-muted-foreground">6 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-6 card-shadow">
              <h2 className="mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/todos">
                  <Button className="w-full justify-start focus-ring interactive">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    View All Tasks
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start focus-ring interactive">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start focus-ring interactive">
                  <Users className="h-4 w-4 mr-2" />
                  Team Collaboration
                </Button>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6 card-shadow">
              <h2 className="mb-4">Upcoming</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Team standup</span>
                  <span className="text-muted-foreground">Tomorrow</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Project review</span>
                  <span className="text-muted-foreground">Friday</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Sprint planning</span>
                  <span className="text-muted-foreground">Next week</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 bg-gradient-to-r from-primary/10 to-primary/5 border rounded-lg p-8 text-center card-shadow">
          <h2 className="mb-2">AI Todo Manager</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Your intelligent task management companion. More features coming soon!
          </p>
          <Link href="/todos">
            <Button size="lg" className="focus-ring interactive">
              Get Started with Tasks
              <CheckSquare className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}