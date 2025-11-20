import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Users, Calendar, Coins, Shield, Heart, MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-4xl space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-pink-600">
            Keep Your Family Connected
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share moments, manage tasks, coordinate events, and stay close to the people who matter most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/create">
              <Button size="lg" className="gap-2">
                Create Your Family Hub <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything Your Family Needs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful tools to help your family stay organized and connected.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <CardTitle>Shared Calendar</CardTitle>
                <CardDescription>
                  Keep everyone on the same page with a family calendar for events and appointments.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Coins className="h-6 w-6" />
                </div>
                <CardTitle>Token System</CardTitle>
                <CardDescription>
                  Manage allowances and rewards with a virtual token system for your family.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <CardTitle>Family Chat</CardTitle>
                <CardDescription>
                  Stay in touch with private family messaging and group conversations.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>Member Management</CardTitle>
                <CardDescription>
                  Invite family members and manage roles and permissions easily.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <CardTitle>Private & Secure</CardTitle>
                <CardDescription>
                  Your family's data is encrypted and protected with enterprise-grade security.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Heart className="h-6 w-6" />
                </div>
                <CardTitle>Shared Memories</CardTitle>
                <CardDescription>
                  Create photo albums and share special moments with your loved ones.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Bring Your Family Together?</h2>
          <p className="text-xl text-muted-foreground">
            Start your family hub today and experience the joy of staying connected.
          </p>
          <Link href="/create">
            <Button size="lg" className="gap-2">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
