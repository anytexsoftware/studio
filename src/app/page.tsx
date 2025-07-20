"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  Settings, 
  Download, 
  UploadCloud, 
  ClipboardCopy, 
  CheckCircle,
  Loader2,
  ChevronsRightLeft,
  Move,
  Code,
  Brush,
  Zap
} from 'lucide-react';
import Image from 'next/image';
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
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type StorageOption = 'local' | 'drive';

function BreakpointBandit() {
  const [breakpoint, setBreakpoint] = useState('1440');
  const [storageOption, setStorageOption] = useState<StorageOption>('drive');
  const [isDriveConnected, setIsDriveConnected] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      dragStartPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y,
      });
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if(isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const initialX = window.innerWidth - 400 - 16; 
    const initialY = 16;
    setPosition({ x: initialX, y: initialY });
  }, []);


  const handleCapture = () => {
    setIsCapturing(true);
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
  }, [isDriveConnected, isConnecting]);

  if (isCollapsed) {
    return (
      <div 
        className="fixed z-50"
        style={{ top: `${position.y}px`, left: `${position.x}px` }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="icon"
                className="rounded-full h-14 w-14 shadow-2xl"
                onClick={() => setIsCollapsed(false)}
              >
                <Camera className="h-7 w-7" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Show Breakpoint Bandit</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div 
      ref={cardRef}
      className="w-full max-w-sm fixed z-50"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        touchAction: 'none',
      }}
    >
      <Card className="w-full shadow-2xl">
        <div onMouseDown={handleMouseDown} className="cursor-move p-2 flex items-center justify-center text-muted-foreground">
            <Move className="h-4 w-4" />
        </div>
        <Separator />
        <CardHeader className="text-center relative pt-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-muted-foreground"
            onClick={() => setIsCollapsed(true)}
          >
            <ChevronsRightLeft className="h-5 w-5" />
          </Button>
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
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative bg-gray-50 text-gray-800 min-h-screen">
      <BreakpointBandit />
      <header className="bg-white shadow-md sticky top-0 z-40">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="text-primary h-6 w-6"/>
            <h1 className="text-xl font-bold text-gray-800">QuantumLeap</h1>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-primary transition">Home</a>
            <a href="#" className="text-gray-600 hover:text-primary transition">Features</a>
            <a href="#" className="text-gray-600 hover:text-primary transition">Pricing</a>
            <a href="#" className="text-gray-600 hover:text-primary transition">Contact</a>
          </div>
          <Button>Get Started</Button>
        </nav>
      </header>
      
      <main className="container mx-auto px-6 py-12">
        <section className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 leading-tight">Build Tomorrow's Web, Today.</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            QuantumLeap provides the tools, resources, and community to help you build and scale your next great idea faster than ever before.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg">Start Building</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </section>

        <section className="mt-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <Code className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">Developer Focused</h3>
              <p className="mt-2 text-gray-600">Built for developers, by developers. Our platform integrates seamlessly with your existing workflow.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <Brush className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">Stunning Design</h3>
              <p className="mt-2 text-gray-600">Create beautiful, responsive user interfaces with our pre-built component library.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <Zap className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">Blazing Fast</h3>
              <p className="mt-2 text-gray-600">Experience unparalleled performance with our optimized, global edge network.</p>
            </div>
          </div>
        </section>

        <section className="mt-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">Accelerate Your Workflow</h2>
            <p className="mt-4 text-gray-600">
              Stop reinventing the wheel. QuantumLeap offers a robust set of features designed to get your project off the ground in record time. Focus on what matters: your code.
            </p>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span><strong className="font-semibold">Powerful APIs:</strong> Easily integrate with third-party services.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span><strong className="font-semibold">Scalable Infrastructure:</strong> From side project to enterprise scale.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span><strong className="font-semibold">24/7 Support:</strong> Our team is always here to help you succeed.</span>
              </li>
            </ul>
          </div>
          <div className="rounded-lg overflow-hidden shadow-2xl">
            <Image 
              src="https://placehold.co/600x400.png"
              alt="Code editor"
              data-ai-hint="code editor"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
        </section>
      </main>

      <footer className="bg-white mt-20 border-t">
        <div className="container mx-auto px-6 py-8 text-center text-gray-600">
          <p>&copy; 2024 QuantumLeap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

    