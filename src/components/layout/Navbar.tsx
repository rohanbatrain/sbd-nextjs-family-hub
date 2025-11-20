import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Home, Calendar, ListTodo, Coins } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <Users className="h-6 w-6" />
                        <span>FamilyHub</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
                        <Link href="/dashboard" className="hover:text-foreground transition-colors flex items-center gap-1">
                            <Home className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link href="/calendar" className="hover:text-foreground transition-colors flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Calendar
                        </Link>
                        <Link href="/tasks" className="hover:text-foreground transition-colors flex items-center gap-1">
                            <ListTodo className="h-4 w-4" />
                            Tasks
                        </Link>
                        <Link href="/tokens" className="hover:text-foreground transition-colors flex items-center gap-1">
                            <Coins className="h-4 w-4" />
                            Tokens
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" size="sm">Log in</Button>
                    </Link>
                    <Link href="/create">
                        <Button size="sm">Create Family</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
