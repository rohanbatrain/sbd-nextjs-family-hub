"use client";

import { motion } from "framer-motion";
import { Users, Heart, Shield, Wallet, ArrowRight, Github, TrendingUp, Award, Lock } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";

export default function LandingPage() {
    return (
        <>
            <Header
                appName="Family Hub"
                appIcon={<Heart className="w-8 h-8 text-pink-400" />}
                primaryColor="pink"
            />
            <div className="relative min-h-screen w-full h-full flex flex-col items-center overflow-hidden bg-[#040508] pt-16">
                <div className="w-full">
                    {/* Hero Section */}
                    <section className="relative pt-32 pb-16 container mx-auto px-4 z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center space-y-6 flex flex-col gap-8 items-center justify-center"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block"
                            >
                                <span className="relative px-4 py-2 rounded-xl flex flex-row gap-2 items-center bg-white/10 text-sm text-white/90 backdrop-blur-sm border border-white/10 overflow-hidden">
                                    <motion.div
                                        className="absolute top-0 w-[10px] h-full bg-pink-300 opacity-60 blur-md shadow-2xl"
                                        initial={{ left: "-10%" }}
                                        animate={{ left: "110%" }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 2,
                                            ease: "linear",
                                        }}
                                    />
                                    <Heart className="w-4 h-4 relative z-10" />
                                    <p className="relative z-10">
                                        FAMILY COLLABORATION PLATFORM
                                    </p>
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-6xl md:text-7xl lg:text-8xl text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] font-bold tracking-tight"
                            >
                                Connect Your <br className="hidden md:block" /> Family
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="max-w-3xl mx-auto text-lg text-white/80 leading-relaxed"
                            >
                                A comprehensive family hub for shared resources, collaborative planning, and secure financial management.
                                Keep your family connected and organized.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto w-full"
                            >
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                                    <Users className="w-8 h-8 text-pink-400 shrink-0" />
                                    <div className="text-left">
                                        <p className="text-white font-medium">Member Management</p>
                                        <p className="text-white/60 text-sm">Role-based permissions</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                                    <Wallet className="w-8 h-8 text-green-400 shrink-0" />
                                    <div className="text-left">
                                        <p className="text-white font-medium">Family Wallet</p>
                                        <p className="text-white/60 text-sm">Shared financial tracking</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                                    <Shield className="w-8 h-8 text-blue-400 shrink-0" />
                                    <div className="text-left">
                                        <p className="text-white font-medium">Secure & Private</p>
                                        <p className="text-white/60 text-sm">Enterprise-grade security</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.0 }}
                                className="space-y-4 flex flex-col items-center justify-center pt-4"
                            >
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link href="/auth/signup">
                                        <button className="bg-gradient-to-b from-pink-600 to-pink-800 px-8 py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 w-full sm:w-auto hover:from-pink-700 hover:to-pink-900 transition-all duration-300 border border-pink-500/50">
                                            Create Family Hub
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </Link>
                                    <Link href="/dashboard">
                                        <button className="bg-gradient-to-b from-gray-700 to-gray-900 px-8 py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 w-full sm:w-auto hover:from-gray-600 hover:to-gray-800 transition-all duration-300 border border-gray-600/50">
                                            <Users className="w-5 h-5" />
                                            View Demo
                                        </button>
                                    </Link>
                                </div>
                                <p className="text-sm text-white/40">
                                    Don&apos;t have an account?{' '}
                                    <Link href="/auth/signup" className="text-pink-400 hover:text-pink-300 transition-colors">
                                        Get started
                                    </Link>
                                </p>
                                <p className="text-sm text-white/40 font-mono">
                                    Secure • Collaborative • Family-First
                                </p>
                            </motion.div>
                        </motion.div>
                    </section>

                    {/* Stats Section */}
                    <Stats
                        stats={[
                            {
                                icon: <Users className="w-8 h-8 text-pink-400" />,
                                value: "2K+",
                                label: "Active Families",
                                color: "bg-pink-500/20"
                            },
                            {
                                icon: <Wallet className="w-8 h-8 text-green-400" />,
                                value: "500K+",
                                label: "SBD Managed",
                                color: "bg-green-500/20"
                            },
                            {
                                icon: <Shield className="w-8 h-8 text-blue-400" />,
                                value: "100%",
                                label: "Data Encrypted",
                                color: "bg-blue-500/20"
                            },
                            {
                                icon: <Heart className="w-8 h-8 text-purple-400" />,
                                value: "4.8/5",
                                label: "Family Rating",
                                color: "bg-purple-500/20"
                            }
                        ]}
                    />

                    {/* Features Section */}
                    <section className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#040508] to-[#0C0F15] justify-center items-center relative py-20">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-16">
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-5xl md:text-6xl font-light mb-6 text-white"
                                >
                                    Family Features
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="text-xl text-white/70 max-w-3xl mx-auto"
                                >
                                    Everything your family needs to stay connected and organized
                                </motion.p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
                            >
                                <FeatureCard
                                    icon={<Users className="w-6 h-6 text-pink-400" />}
                                    iconBg="bg-pink-500/20"
                                    title="Member Management"
                                    description="Invite family members, assign roles, and manage permissions. Keep everyone connected with real-time updates."
                                    list={[
                                        "4-tier permission system",
                                        "Role-based access control",
                                        "Member invitations",
                                        "Activity tracking"
                                    ]}
                                />
                                <FeatureCard
                                    icon={<Wallet className="w-6 h-6 text-green-400" />}
                                    iconBg="bg-green-500/20"
                                    title="Shared Wallet"
                                    description="Track family finances, set spending limits, and manage shared resources with transparency and accountability."
                                    list={[
                                        "Virtual SBD tokens",
                                        "Transaction history",
                                        "Spending limits",
                                        "Balance tracking"
                                    ]}
                                    delay={0.1}
                                />
                                <FeatureCard
                                    icon={<Shield className="w-6 h-6 text-blue-400" />}
                                    iconBg="bg-blue-500/20"
                                    title="Security & Privacy"
                                    description="Enterprise-grade security with audit trails, encryption, and compliance features to protect your family data."
                                    list={[
                                        "End-to-end encryption",
                                        "Audit logging",
                                        "Privacy controls",
                                        "Compliance ready"
                                    ]}
                                    delay={0.2}
                                />
                                <FeatureCard
                                    icon={<Heart className="w-6 h-6 text-purple-400" />}
                                    iconBg="bg-purple-500/20"
                                    title="Collaboration Tools"
                                    description="Share resources, coordinate activities, and communicate effectively with built-in collaboration features."
                                    list={[
                                        "Shared resources",
                                        "Real-time notifications",
                                        "Activity feeds",
                                        "Family calendar"
                                    ]}
                                    delay={0.3}
                                />
                            </motion.div>
                        </div>
                    </section>

                    {/* How It Works Section */}
                    <HowItWorks
                        title="How Family Hub Works"
                        subtitle="Bring your family together in 4 simple steps"
                        steps={[
                            {
                                number: "01",
                                title: "Create Hub",
                                description: "Set up your family hub and invite members with customizable roles and permissions.",
                                icon: <Users className="w-8 h-8 text-pink-400" />
                            },
                            {
                                number: "02",
                                title: "Manage Wallet",
                                description: "Set up shared family wallet with SBD tokens and configure spending limits.",
                                icon: <Wallet className="w-8 h-8 text-green-400" />
                            },
                            {
                                number: "03",
                                title: "Collaborate",
                                description: "Share resources, coordinate activities, and communicate with your family.",
                                icon: <Heart className="w-8 h-8 text-purple-400" />
                            },
                            {
                                number: "04",
                                title: "Stay Secure",
                                description: "Enjoy enterprise-grade security with encryption, audit trails, and privacy controls.",
                                icon: <Shield className="w-8 h-8 text-blue-400" />
                            }
                        ]}
                    />

                    {/* Testimonials Section */}
                    <Testimonials
                        testimonials={[
                            {
                                quote: "Family Hub transformed how we manage our household. The shared wallet feature makes it easy to track family expenses, and the permission system ensures everyone has appropriate access.",
                                author: "Jennifer Martinez",
                                role: "Mother of 3, Family Organizer",
                                avatar: <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center"><Users className="w-6 h-6 text-pink-400" /></div>
                            },
                            {
                                quote: "The security features give us peace of mind. We can collaborate as a family while knowing our data is protected with enterprise-grade encryption and audit trails.",
                                author: "David Chen",
                                role: "Father & IT Professional",
                                avatar: <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center"><Shield className="w-6 h-6 text-blue-400" /></div>
                            }
                        ]}
                    />

                    {/* FAQ Section */}
                    <FAQ
                        faqs={[
                            {
                                question: "How many family members can I add?",
                                answer: "You can add unlimited family members to your Family Hub. Each member can have different permission levels (Owner, Admin, Member, or Guest) based on their role in the family."
                            },
                            {
                                question: "Is my family's data secure?",
                                answer: "Absolutely! We use enterprise-grade encryption for all data, maintain comprehensive audit trails, and comply with industry-standard security practices. Your family's privacy and security are our top priorities."
                            },
                            {
                                question: "How does the shared wallet work?",
                                answer: "The shared wallet uses SBD tokens that can be allocated to family members. Owners and Admins can set spending limits, track transactions, and manage the family budget. All transactions are logged and transparent to authorized members."
                            },
                            {
                                question: "Can I control what each family member can access?",
                                answer: "Yes! Our 4-tier permission system (Owner, Admin, Member, Guest) allows you to precisely control what each family member can see and do. You can customize permissions for resources, wallet access, and administrative functions."
                            },
                            {
                                question: "Is Family Hub free?",
                                answer: "Yes! Family Hub is completely free and open source. There are no hidden fees or premium features locked behind a paywall. We believe family organization tools should be accessible to everyone."
                            },
                            {
                                question: "Can I use Family Hub for extended family or groups?",
                                answer: "While designed for immediate families, Family Hub works great for extended families, roommates, or any group that needs to collaborate and share resources. The permission system is flexible enough to accommodate various group structures."
                            }
                        ]}
                    />

                    {/* CTA Section */}
                    <section className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#0C0F15] to-[#040508] justify-center items-center relative py-20">
                        <div className="container mx-auto px-4 text-center">
                            <h2 className="text-6xl md:text-7xl font-light mb-6 text-white">
                                Ready to Connect Your Family?
                            </h2>
                            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12">
                                Join families worldwide using Family Hub to stay organized, connected, and secure.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <Link href="/auth/signup">
                                    <button className="bg-gradient-to-b from-pink-600 to-pink-800 px-8 py-4 rounded-lg text-white font-medium text-lg flex items-center gap-2 hover:from-pink-700 hover:to-pink-900 transition-all duration-300 border border-pink-500/50">
                                        <Heart className="w-5 h-5" />
                                        Start Free
                                    </button>
                                </Link>
                                <Link href="https://github.com/rohanbatrain/second_brain_database" target="_blank" rel="noopener noreferrer">
                                    <button className="bg-gradient-to-b from-gray-700 to-gray-900 px-8 py-4 rounded-lg text-white font-medium text-lg flex items-center gap-2 hover:from-gray-600 hover:to-gray-800 transition-all duration-300 border border-gray-600/50">
                                        <Github className="w-5 h-5" />
                                        View on GitHub
                                    </button>
                                </Link>
                            </div>

                            <div className="mt-12 text-center">
                                <p className="text-white/60 mb-4">Trusted by families worldwide</p>
                                <div className="flex justify-center gap-8 text-white/40 text-sm">
                                    <span>Secure</span>
                                    <span>•</span>
                                    <span>Private</span>
                                    <span>•</span>
                                    <span>Family-First</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <Footer
                    appName="Family Hub"
                    appDescription="A comprehensive family hub for shared resources, collaborative planning, and secure financial management."
                    features={[
                        { name: "Member Management", href: "#" },
                        { name: "Shared Wallet", href: "#" },
                        { name: "Security & Privacy", href: "#" },
                        { name: "Collaboration Tools", href: "#" }
                    ]}
                />
            </div >
        </>
    );
}

function FeatureCard({ icon, iconBg, title, description, list, delay = 0 }: {
    icon: React.ReactNode,
    iconBg: string,
    title: string,
    description: string,
    list: string[],
    delay?: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 hover:bg-white/10 transition-colors duration-300"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
                    {icon}
                </div>
                <h3 className="text-2xl font-semibold text-white">{title}</h3>
            </div>
            <p className="text-white/80 mb-4">
                {description}
            </p>
            <ul className="text-white/70 space-y-2">
                {list.map((item, i) => (
                    <li key={i}>• {item}</li>
                ))}
            </ul>
        </motion.div>
    );
}
