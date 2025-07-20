
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
  Zap,
  Users,
  Shield,
  BarChart,
  Star
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


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
    // Only allow dragging from the drag handle area
    const handle = (e.target as HTMLElement).closest('[data-drag-handle]');
    if (!handle) return;

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
        title: "Capture Successful!",
        description: "Screenshot copied to clipboard.",
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
      onMouseDown={handleMouseDown}
    >
      <Card className="w-full shadow-2xl">
        <div data-drag-handle className="cursor-move p-2 flex items-center justify-center text-muted-foreground">
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

        <section className="mt-24 bg-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900">Why QuantumLeap?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We provide the best-in-class features to get you up and running in no time.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mt-12">
              <div className="p-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Team Collaboration</h3>
                <p className="mt-2 text-gray-600">Work together with your team in a shared, collaborative environment.</p>
              </div>
              <div className="p-6">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Top-Notch Security</h3>
                <p className="mt-2 text-gray-600">Your data is safe with us. We use enterprise-grade security measures.</p>
              </div>
              <div className="p-6">
                <BarChart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Advanced Analytics</h3>
                <p className="mt-2 text-gray-600">Gain insights into your application's performance and usage.</p>
              </div>
              <div className="p-6">
                <Code className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Extensible APIs</h3>
                <p className="mt-2 text-gray-600">Build custom integrations with our flexible and powerful APIs.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">Loved by Developers Worldwide</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what people are saying about QuantumLeap.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-10 mt-12">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-bold">Jane Doe</p>
                    <p className="text-sm text-gray-500">Lead Developer, TechCorp</p>
                  </div>
                </div>
                <p className="text-gray-600">"QuantumLeap has revolutionized our development process. We're shipping features faster than ever before."</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-bold">John Smith</p>
                    <p className="text-sm text-gray-500">Founder, StartupX</p>
                  </div>
                </div>
                <p className="text-gray-600">"The best platform for getting a project off the ground. The support is incredible and the features are top-tier."</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Avatar>
                    <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-bold">Sarah Chen</p>
                    <p className="text-sm text-gray-500">CTO, Innovate LLC</p>
                  </div>
                </div>
                <p className="text-gray-600">"An indispensable tool for any modern development team. Highly recommended for its performance and ease of use."</p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="mt-24">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">Choose Your Plan</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Simple, transparent pricing for teams of all sizes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Starter</CardTitle>
                <CardDescription className="text-center">For individuals and hobby projects.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                 <p className="text-4xl font-bold text-center">$0<span className="text-lg font-normal text-gray-500">/mo</span></p>
                 <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2"/>1 Project</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2"/>1 User</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2"/>Community Support</li>
                 </ul>
              </CardContent>
              <CardFooter>
                  <Button variant="outline" className="w-full">Get Started</Button>
              </CardFooter>
            </Card>
            <Card className="border-primary flex flex-col shadow-2xl">
               <CardHeader>
                <CardTitle className="text-2xl text-center">Pro</CardTitle>
                <CardDescription className="text-center">For professional developers and teams.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                 <p className="text-4xl font-bold text-center">$49<span className="text-lg font-normal text-gray-500">/mo</span></p>
                 <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2"/>Unlimited Projects</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2"/>Up to 10 Users</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2"/>Priority Email Support</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2"/>Advanced Analytics</li>
                 </ul>
              </CardContent>
              <CardFooter>
                  <Button className="w-full">Choose Pro</Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Enterprise</CardTitle>
                <CardDescription className="text-center">For large-scale applications.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                 <p className="text-4xl font-bold text-center">Custom</p>
                 <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2"/>Unlimited Everything</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2"/>Dedicated Support & Onboarding</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2"/>SAML/SSO Integration</li>
                    <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2"/>Custom SLAs</li>
                 </ul>
              </CardContent>
              <CardFooter>
                  <Button variant="outline" className="w-full">Contact Sales</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section className="mt-24">
           <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions? We have answers. If you can't find what you're looking for, feel free to contact us.
            </p>
          </div>
          <div className="max-w-3xl mx-auto mt-12">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is there a free trial?</AccordionTrigger>
                <AccordionContent>
                  Yes! You can use the Starter plan for free for as long as you like. If you want to try the Pro features, we offer a 14-day free trial, no credit card required.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I change my plan later?</AccordionTrigger>
                <AccordionContent>
                  Absolutely. You can upgrade or downgrade your plan at any time from your account dashboard. The changes will be prorated.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What is your refund policy?</AccordionTrigger>
                <AccordionContent>
                  We offer a 30-day money-back guarantee on all our paid plans. If you're not satisfied for any reason, just let us know and we'll process a full refund.
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="item-4">
                <AccordionTrigger>How does billing work?</AccordionTrigger>
                <AccordionContent>
                  You will be billed monthly or annually, depending on your choice. We accept all major credit cards. For Enterprise plans, we also support invoicing.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
