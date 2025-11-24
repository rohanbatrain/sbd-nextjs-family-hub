"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Coins, MessageCircle, Plus, Heart, ShoppingBag, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Family Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Stay connected with your family and manage shared activities
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/calendar">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </Button>
          </Link>
          <Link href="/tasks/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Family Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              All active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SBD Balance</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,450 SBD</div>
            <p className="text-xs text-muted-foreground">
              Family wallet
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Next 7 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              3 new today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Family calendar highlights</CardDescription>
              </div>
              <Link href="/calendar">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Family Dinner", date: "Today, 7:00 PM", attendees: 5, type: "meal" },
                { title: "Soccer Practice", date: "Tomorrow, 4:30 PM", attendees: 2, type: "activity" },
                { title: "Movie Night", date: "Friday, 8:00 PM", attendees: 5, type: "entertainment" },
              ].map((event, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest family updates</CardDescription>
              </div>
              <Link href="/notifications">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: "Mom", action: "added a new event", item: "Doctor Appointment", time: "2 hours ago", icon: Calendar },
                { user: "Dad", action: "transferred tokens to", item: "Sarah", time: "5 hours ago", icon: Coins },
                { user: "Sarah", action: "completed goal", item: "Weekly Chores", time: "1 day ago", icon: Heart },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <activity.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                      <span className="font-medium">{activity.item}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/calendar" className="block">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                <Calendar className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Add Event</div>
                  <div className="text-xs text-muted-foreground">Schedule activity</div>
                </div>
              </Button>
            </Link>
            <Link href="/tokens" className="block">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                <Coins className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Send Tokens</div>
                  <div className="text-xs text-muted-foreground">Transfer SBD</div>
                </div>
              </Button>
            </Link>
            <Link href="/shopping" className="block">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                <ShoppingBag className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Shopping List</div>
                  <div className="text-xs text-muted-foreground">8 items</div>
                </div>
              </Button>
            </Link>
            <Link href="/goals" className="block">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
                <Heart className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Family Goals</div>
                  <div className="text-xs text-muted-foreground">Track progress</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Token Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Token Activity</CardTitle>
          <CardDescription>Recent SBD transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { from: "Dad", to: "Sarah", amount: 50, reason: "Weekly allowance", time: "2 hours ago" },
              { from: "Mom", to: "Alex", amount: 25, reason: "Completed chores", time: "1 day ago" },
              { from: "Sarah", to: "Family Wallet", amount: 20, reason: "Contribution", time: "2 days ago" },
            ].map((transaction, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {transaction.from} → {transaction.to}
                    </p>
                    <p className="text-xs text-muted-foreground">{transaction.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-emerald-600">+{transaction.amount} SBD</p>
                  <p className="text-xs text-muted-foreground">{transaction.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
