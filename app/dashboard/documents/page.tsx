'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, MoreVertical, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DocumentsPage() {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        // Mock upload logic
        alert("File drop detected (Mock)");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
                    <p className="text-muted-foreground mt-1">
                        Upload and manage receipts, invoices, and bank statements.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                    <Button>
                        <UploadCloud className="w-4 h-4 mr-2" /> Upload
                    </Button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search documents by name or content..."
                    className="pl-10"
                />
            </div>

            {/* Upload Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
                    ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'}
                `}
            >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <UploadCloud className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Drag & drop your files here</h3>
                <p className="text-muted-foreground mt-2 mb-6 max-w-sm mx-auto">
                    Support for PDF, PNG, JPG. We'll automatically OCR and match them to transactions.
                </p>
                <Button variant="outline">Select Files</Button>
            </div>

            {/* Recent Files Grid */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Recent Uploads</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="group hover:shadow-md transition-all cursor-pointer">
                            <CardContent className="p-4 flex items-start gap-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="font-medium truncate">Invoice_#{1000 + i}.pdf</div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Uploaded just now • 2.4 MB
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="mt-3 flex items-center gap-2">
                                        <div className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] font-medium rounded-full uppercase tracking-wide">
                                            Processed
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
