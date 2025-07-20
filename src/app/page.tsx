"use client";

import { useState, useMemo } from 'react';
import { 
  Camera, 
  Settings, 
  Download, 
  UploadCloud, 
  ClipboardCopy, 
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

type StorageOption = 'local' | 'drive';

export default function Home() {
  const [breakpoint, setBreakpoint] = useState('1440');
  const [storageOption, setStorageOption] = useState<StorageOption>('drive');
  const [isDriveConnected, setIsDriveConnected] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleCapture = () => {
    setIsCapturing(true);
    // Simulate capture process
    setTimeout(() => {
      setIsCapturing(false);
      toast({
        title: "Đã chụp và lưu thành công!",
        description: "Ảnh đã được tự động sao chép vào clipboard.",
      });
    }, 2000);
  };

  const handleConnectDrive = () => {
    setIsConnecting(true);
    // Simulate OAuth flow
    setTimeout(() => {
      setIsConnecting(false);
      setIsDriveConnected(true);
      toast({
        title: "Google Drive Connected",
        description: "You can now upload screenshots to your Google Drive.",
      });
    }, 1500);
  };

  const driveButton = useMemo(() => {
    if (isDriveConnected) {
      return (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="h-5 w-5" />
          <span>Connected to Google Drive</span>
        </div>
      );
    }
    return (
      <Button variant="outline" onClick={handleConnectDrive} disabled={isConnecting}>
        {isConnecting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <UploadCloud className="mr-2 h-4 w-4" />
        )}
        {isConnecting ? 'Connecting...' : 'Connect to Google Drive'}
      </Button>
    );
  }, [isDriveConnected, isConnecting, handleConnectDrive]);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
            <Camera className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-headline">Breakpoint Bandit</CardTitle>
          <CardDescription>Advanced Screenshot Tool</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Button 
              onClick={handleCapture} 
              disabled={isCapturing} 
              className="w-full text-lg py-6"
              size="lg"
            >
              {isCapturing ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Camera className="mr-2 h-5 w-5" />
              )}
              {isCapturing ? 'Capturing...' : `Capture at ${breakpoint}px`}
            </Button>
          </div>
          
          <Separator />

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Settings className="h-5 w-5" />
              Settings
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="breakpoint">Breakpoint Width</Label>
              <div className="flex items-center">
                <Input
                  id="breakpoint"
                  type="number"
                  value={breakpoint}
                  onChange={(e) => setBreakpoint(e.target.value)}
                  placeholder="e.g., 1440"
                  className="rounded-r-none"
                />
                <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-secondary text-secondary-foreground text-sm">
                  px
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Default Storage</Label>
              <RadioGroup
                value={storageOption}
                onValueChange={(value) => setStorageOption(value as StorageOption)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              >
                <Label htmlFor="r1" className="flex flex-col items-start space-y-1 rounded-md border p-4 cursor-pointer hover:bg-accent/50 has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground has-[input:checked]:border-accent-foreground/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="local" id="r1" />
                    <Download className="h-4 w-4" />
                    <span>Save to Device</span>
                  </div>
                </Label>
                <Label htmlFor="r2" className="flex flex-col items-start space-y-1 rounded-md border p-4 cursor-pointer hover:bg-accent/50 has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground has-[input:checked]:border-accent-foreground/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="drive" id="r2" />
                    <UploadCloud className="h-4 w-4" />
                    <span>Google Drive</span>
                  </div>
                </Label>
              </RadioGroup>
            </div>
            
            {storageOption === 'drive' && (
              <div className="flex justify-center pt-2">
                {driveButton}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mx-auto">
            <ClipboardCopy className="h-3 w-3" />
            Screenshots are automatically copied to clipboard.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
