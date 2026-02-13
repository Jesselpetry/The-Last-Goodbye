'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Activity, LogOut, Menu, X, Lock, Bell } from 'lucide-react';
import { logoutAdmin } from '@/app/actions/admin';
import { getUnreadRepliesCount } from '@/app/actions/replies';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (pathname === '/admin/login') return;

        const fetchUnread = async () => {
            const count = await getUnreadRepliesCount();
            setUnreadCount(count);
        };
        fetchUnread();

        // Optional: Poll every 30 seconds
        const interval = setInterval(fetchUnread, 30000);
        return () => clearInterval(interval);
    }, [pathname]);

    // If login page, don't show sidebar
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const menuItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'จัดการเพื่อน', href: '/admin/friends', icon: Users },
        { name: 'ข้อความตอบกลับ', href: '/admin/notifications', icon: Bell, badge: unreadCount },
        { name: 'Spy Mode', href: '/admin/analytics', icon: Activity },
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex font-sans">
            {/* Mobile Sidebar Toggle */}
            <button
                className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-md text-gray-800"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
                )}
            </button>

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 shadow-lg md:shadow-none
            `}>
                <div className="h-full flex flex-col p-6">
                    {/* Logo Area */}
                    <div className="mb-10 flex items-center gap-3 px-2">
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-md">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-900 text-lg leading-tight">Admin Panel</h1>
                            <p className="text-xs text-gray-500 font-medium tracking-wide">THE LAST GOODBYE</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
                                        isActive
                                            ? 'bg-gray-900 text-white shadow-md transform scale-[1.02]'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'}`} />
                                    <span className="font-medium">{item.name}</span>
                                    {item.badge !== undefined && item.badge > 0 && (
                                        <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                                            isActive ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600'
                                        }`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <button
                        onClick={() => logoutAdmin()}
                        className="flex items-center gap-3 px-4 py-3.5 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all mt-auto group"
                    >
                        <LogOut className="w-5 h-5 group-hover:text-red-600" />
                        <span className="font-medium">ออกจากระบบ</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen">
                <div className="max-w-6xl mx-auto pb-20">
                    {children}
                </div>
            </main>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
