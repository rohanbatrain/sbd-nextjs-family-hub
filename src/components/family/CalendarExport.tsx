'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { api, endpoints } from '@/lib/api';

interface CalendarExportProps {
    familyId: string;
    startDate?: Date;
    endDate?: Date;
}

export function CalendarExport({ familyId, startDate, endDate }: CalendarExportProps) {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (startDate) params.append('start_date', startDate.toISOString());
            if (endDate) params.append('end_date', endDate.toISOString());

            const response = await api.get(
                `${endpoints.calendar.export(familyId)}?${params.toString()}`,
                { responseType: 'blob' }
            );

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `family-calendar-${new Date().toISOString().split('T')[0]}.ics`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error: unknown) {
            console.error('Failed to export calendar:', error);
            // Attempt to access error.response safely if it's an AxiosError or similar
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (typeof error === 'object' && error !== null && 'response' in error && typeof (error as any).response?.data?.detail === 'string') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                alert((error as any).response.data.detail);
            } else {
                alert('Failed to export calendar');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            onClick={handleExport}
            disabled={loading}
            className="gap-2"
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Download className="h-4 w-4" />
            )}
            Export to iCal
        </Button>
    );
}
