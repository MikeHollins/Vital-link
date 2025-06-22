import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, FileText, Database, Calendar, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportOptions {
  format: 'json' | 'csv' | 'pdf';
  dateRange: 'all' | '1month' | '3months' | '6months' | '1year';
  includePersonalInfo: boolean;
  includeHealthData: boolean;
  includeInsights: boolean;
  includeDeviceData: boolean;
  includeBillingData: boolean;
}

export const DataExport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'json',
    dateRange: '1year',
    includePersonalInfo: true,
    includeHealthData: true,
    includeInsights: true,
    includeDeviceData: true,
    includeBillingData: false
  });
  const { toast } = useToas;

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeouresolve, 3000);
      
      // In production, would call actual export API
      const exportData = {
        exportDate: new Date().toISOString(),
        userId: 'testuser',
        options: options,
        // Would include actual user data based on selections
        data: {
          personalInfo: options.includePersonalInfo ? {
            name: 'Test User',
            email: 'testuser@vitallink.sg',
            createdAt: '2024-01-01T00:00:00Z'
          } : undefined,
          healthData: options.includeHealthData ? [
            { type: 'heart_rate', value: 72, timestamp: '2024-01-01T12:00:00Z' },
            { type: 'steps', value: 8234, timestamp: '2024-01-01T12:00:00Z' }
          ] : undefined,
          insights: options.includeInsights ? [
            { title: 'Health Insight', description: 'Your health is improving', date: '2024-01-01' }
          ] : undefined
        }
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: options.format === 'json' ? 'application/json' : 'text/csv' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElemen'a';
      link.href = url;
      link.download = `vitallink-export-${new Date().toISOString().spli'T'[0]}.${options.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: `Your data has been exported in ${options.format.toUpperCase()} format`,
      });

      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const updateOption = <K extends keyof ExportOptions>(key: K, value: ExportOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Export Your Data
          </CardTitle>
          <CardDescription>
            Download a copy of all your personal data stored in VitalLink (PDPA compliance)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsOpen(true)} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Request Data Export
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Export Personal Data
            </DialogTitle>
            <DialogDescription>
              Configure your data export according to Singapore PDPA requirements
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Export Format */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <Select value={options.format} onValueChange={(value: any) => updateOption('format', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      JSON (Machine readable)
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      CSV (Spreadsheet format)
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      PDF (Human readable)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </label>
              <Select value={options.dateRange} onValueChange={(value: any) => updateOption('dateRange', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last 1 Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last 1 Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data Categories */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Data Categories to Include</label>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="personalInfo"
                    checked={options.includePersonalInfo}
                    onCheckedChange={(checked) => updateOption('includePersonalInfo', !!checked)}
                  />
                  <div className="space-y-1">
                    <label htmlFor="personalInfo" className="text-sm font-medium leading-none">
                      Personal Information
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Name, email, account settings, preferences
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="healthData"
                    checked={options.includeHealthData}
                    onCheckedChange={(checked) => updateOption('includeHealthData', !!checked)}
                  />
                  <div className="space-y-1">
                    <label htmlFor="healthData" className="text-sm font-medium leading-none">
                      Health Data
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Heart rate, steps, sleep, weight, blood pressure
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="insights"
                    checked={options.includeInsights}
                    onCheckedChange={(checked) => updateOption('includeInsights', !!checked)}
                  />
                  <div className="space-y-1">
                    <label htmlFor="insights" className="text-sm font-medium leading-none">
                      AI Insights & Analytics
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Generated health insights, correlations, recommendations
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="deviceData"
                    checked={options.includeDeviceData}
                    onCheckedChange={(checked) => updateOption('includeDeviceData', !!checked)}
                  />
                  <div className="space-y-1">
                    <label htmlFor="deviceData" className="text-sm font-medium leading-none">
                      Connected Devices
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Device connections, sync history, permissions
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="billingData"
                    checked={options.includeBillingData}
                    onCheckedChange={(checked) => updateOption('includeBillingData', !!checked)}
                  />
                  <div className="space-y-1">
                    <label htmlFor="billingData" className="text-sm font-medium leading-none">
                      Billing & Subscription
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Payment history, subscription details, invoices
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <Shield className="h-3 w-3 inline mr-1" />
                Your export will be processed securely and made available for download within 24 hours. 
                The download link will be valid for 7 days for security purposes.
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleExport} 
                disabled={isExporting}
                className="flex-1"
              >
                {isExporting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};