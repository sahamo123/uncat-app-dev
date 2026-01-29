'use client';

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, User, Building, Shield } from "lucide-react";

export default function SettingsPage() {
    const { user } = useUser();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your profile, team, and application preferences.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Profile Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            <CardTitle>Personal Profile</CardTitle>
                        </div>
                        <CardDescription>
                            Your personal account information managed via Clerk.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={user?.fullName || ''}
                                disabled
                                className="bg-muted/50"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                value={user?.primaryEmailAddress?.emailAddress || ''}
                                disabled
                                className="bg-muted/50"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/5 border-t px-6 py-4 justify-between">
                        <span className="text-xs text-muted-foreground">Managed by Clerk Auth</span>
                        <Button variant="outline" size="sm" onClick={() => window.open('https://accounts.clerk.com/user', '_blank')}>
                            Manage Account
                        </Button>
                    </CardFooter>
                </Card>

                {/* Tenant Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Building className="w-5 h-5 text-primary" />
                            <CardTitle>Company Settings</CardTitle>
                        </div>
                        <CardDescription>
                            Manage your organization details and defaults.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input id="companyName" placeholder="Acme Accounting Inc." />
                        </div>
                        <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                            <div className="space-y-0.5">
                                <Label className="text-base">Sandbox Mode</Label>
                                <p className="text-sm text-muted-foreground">
                                    Use QuickBooks Sandbox environment for testing.
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                        <Button>Save Changes</Button>
                    </CardFooter>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary" />
                            <CardTitle>Notifications</CardTitle>
                        </div>
                        <CardDescription>
                            Configure how you want to be alerted.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                                <span>Email Notifications</span>
                                <span className="font-normal text-xs text-muted-foreground">
                                    Receive weekly summaries and critical alerts.
                                </span>
                            </Label>
                            <Switch id="email-notifications" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="ai-alerts" className="flex flex-col space-y-1">
                                <span>AI Confidence Alerts</span>
                                <span className="font-normal text-xs text-muted-foreground">
                                    Notify me when AI confidence drops below 50%.
                                </span>
                            </Label>
                            <Switch id="ai-alerts" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
