

"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Sprout,
  Warehouse,
  IndianRupee,
  Leaf,
  Tractor,
  Award,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Upload,
  FileText,
  X,
  Languages,
  Shield,
  CircleDot,
  Cloud,
  Heart,
  Wheat,
  Users,
  Star,
  Download,
} from "lucide-react";
import dynamic from 'next/dynamic';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Logo } from "@/components/icons";
import type { Role } from "@/lib/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState, useCallback, useContext } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useDropzone } from "react-dropzone";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageContext, content } from "@/contexts/language-context";
import type { LangKey } from "@/contexts/language-context";
import { useTranslation } from "@/hooks/use-language-font";

// Dynamically import AnimatedCounter to avoid SSR issues
const AnimatedCounter = dynamic(() => import('@/components/animated-counter'), { 
  ssr: false,
  loading: () => <span>0</span>
});


interface PerformerCardProps {
  name: string;
  roleKey: string;
  location: string;
  value: string;
  unitKey: string;
  avatarUrl: string;
}

function PerformerCard({ name, roleKey, location, value, unitKey, avatarUrl }: PerformerCardProps) {
  const { t } = useTranslation();
  return (
    <Card className="relative group bg-sky-100/50 dark:bg-900/30 rounded-2xl border-2 border-transparent hover:border-blue-300 transition-all duration-300 flex flex-col items-center p-6 text-center h-full overflow-hidden">
        <Image src="https://i.ibb.co/JwHdxbZ6/Generated-Image-September-10-2025-7-55-PM.png" alt="eAaharSetu mini logo" width={80} height={32} className="mb-4" />
        <Avatar className="h-32 w-32 border-4 border-white dark:border-blue-900/50 ring-2 ring-blue-200 dark:ring-blue-700 mb-3">
          <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
          <AvatarFallback className="bg-blue-200 text-blue-800 font-medium text-2xl">{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="font-bold text-lg text-blue-900 dark:text-blue-100">{name}</div>
        <div className="text-sm text-blue-800 dark:text-blue-200 font-light">{t(roleKey, roleKey.replace(/_/g, ' '))}</div>
        <div className="text-xs text-blue-600 dark:text-blue-300 font-light mb-4">{location}</div>

        <div className="mt-auto bg-white/70 dark:bg-blue-900/50 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-sm text-blue-900 dark:text-blue-100 font-medium shadow-sm">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span>{value} {t(unitKey, unitKey)}</span>
        </div>
    </Card>
  );
}

interface GuidelineCardProps {
  titleKey: string;
  year: string;
  size: string;
  imageUrl: string;
  downloadUrl: string;
}

function GuidelineCard({ titleKey, year, size, imageUrl, downloadUrl }: GuidelineCardProps) {
  const { t } = useTranslation();
  return (
    <a href={downloadUrl} download className="block rounded-lg overflow-hidden group transition-all duration-300 hover:border-primary hover:shadow-lg bg-white/10 border-white/20">
      <div className="relative aspect-video">
        <Image src={imageUrl} alt={t(titleKey, titleKey)} fill style={{ objectFit: 'cover' }} />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      <div className="p-3 bg-orange-600">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-sm text-white">{t(titleKey, titleKey.replace(/_/g, ' '))}</p>
            <p className="text-xs text-gray-200">{year}</p>
          </div>
          <Button size="sm" variant="secondary" className="rounded-full text-xs h-7 bg-white/20 hover:bg-white/30 text-white">
            <Download className="mr-2 h-3 w-3" />
            {size}
          </Button>
        </div>
      </div>
    </a>
  );
}

export default function RoleSelectionPage() {
  const { lang, setLang, t } = useTranslation();
  
  const topPerformers: PerformerCardProps[] = [
    {
      name: "Vijay Kumar",
      roleKey: "logistics_head",
      location: "Maharashtra Region",
      value: "1.2",
      unitKey: "tons",
      avatarUrl: "https://i.ibb.co/5WM3K1tb/Chat-GPT-Image-Jan-30-2026-10-24-34-AM.png"
    },
    {
      name: "Meera Patel", 
      roleKey: "warehouse_manager",
      location: "Nashik Cold Storage",
      value: "800",
      unitKey: "kg",
      avatarUrl: "https://i.ibb.co/N2q3PK1S/Chat-GPT-Image-Jan-30-2026-10-28-34-AM.png"
    },
    {
      name: "Rohan Gupta",
      roleKey: "top_farmer",
      location: "Pune District",
      value: "1.5",
      unitKey: "tons",
      avatarUrl: "https://i.ibb.co/8gGfF6Bg/Chat-GPT-Image-Jan-30-2026-10-29-28-AM.png"
    },
    {
      name: "Aisha Sharma",
      roleKey: "quality_control_lead",
      location: "Nagpur Hub", 
      value: "750",
      unitKey: "kg",
      avatarUrl: "https://i.ibb.co/N2q3PK1S/Chat-GPT-Image-Jan-30-2026-10-28-34-AM.png"
    },
    {
      name: "Suresh Singh",
      roleKey: "top_dealer",
      location: "Aurangabad",
      value: "2.1",
      unitKey: "tons",
      avatarUrl: "https://i.ibb.co/5WM3K1tb/Chat-GPT-Image-Jan-30-2026-10-24-34-AM.png"
    },
    {
        name: "Priya Rao",
        roleKey: "eco_farmer",
        location: "Satara", 
        value: "900",
        unitKey: "kg",
        avatarUrl: "https://i.ibb.co/N2q3PK1S/Chat-GPT-Image-Jan-30-2026-10-28-34-AM.png"
    },
    {
        name: "Amit Deshmukh",
        roleKey: "logistics_coordinator",
        location: "Mumbai Port",
        value: "600",
        unitKey: "kg",
        avatarUrl: "https://i.ibb.co/8gGfF6Bg/Chat-GPT-Image-Jan-30-2026-10-29-28-AM.png"
    }
  ];

  const guidelines: GuidelineCardProps[] = [
    { 
      titleKey: "farmer_handbook",
      year: "2024",
      size: "1.2 MB",
      imageUrl: "https://i.ibb.co/4n3wFvDb/Chat-GPT-Image-Jan-30-2026-10-16-17-AM.png",
      downloadUrl: "/docs/farmer-handbook.pdf"
    },
    { 
      titleKey: "dealer_manual",
      year: "2024",
      size: "850 KB",
      imageUrl: "https://i.ibb.co/0jN4VfTB/Chat-GPT-Image-Jan-30-2026-10-18-40-AM.png",
      downloadUrl: "/docs/dealer-manual.pdf"
    },
    { 
      titleKey: "warehouse_practices",
      year: "2024",
      size: "1.5 MB",
      imageUrl: "https://i.ibb.co/bM0RXDwd/Chat-GPT-Image-Jan-30-2026-10-20-47-AM.png",
      downloadUrl: "/docs/warehouse-practices.pdf"
    },
    { 
      titleKey: "platform_policy",
      year: "2024",
      size: "450 KB",
      imageUrl: "https://i.ibb.co/GvBfvv45/Chat-GPT-Image-Jan-30-2026-10-21-34-AM.png",
      downloadUrl: "/docs/platform-policy.pdf"
    },
  ];

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [performerApi, setPerformerApi] = useState<CarouselApi>();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (fileName: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };


  useEffect(() => {
    if (!api) {
      return;
    }
    const updateSlideInfo = () => {
      setCurrent(api.selectedScrollSnap());
    }
    
    updateSlideInfo();
    api.on("select", updateSlideInfo);
    
    return () => {
      api.off("select", updateSlideInfo);
    };
  }, [api]);

  useEffect(() => {
    if (!performerApi) {
      return;
    }
  }, [performerApi]);


  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="w-full bg-white px-4">
        <div className="grid grid-cols-3 items-center md:hidden h-14">
          <div className="flex items-center gap-2 justify-start">
            <Image src="https://i.ibb.co/JwHdxbZ6/Generated-Image-September-10-2025-7-55-PM.png" alt="eAaharSetu Logo" width={80} height={32} />
          </div>
          <div className="flex justify-center">
            <Image src="https://i.ibb.co/qLZXZG2y/image.png" alt="Azadi-Ka-Amrit-Mahotsav-Logo" width={55} height={55} />
          </div>
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-blue-500 border-2">
                  <Languages className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
                  <span className="text-xs">{content[lang].langName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLang('en')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('hi')}>हिंदी</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('bn')}>বাংলা</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('te')}>తెలుగు</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('mr')}>मराठी</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('ta')}>தமிழ்</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="hidden md:grid md:grid-cols-3 md:items-center h-20">
          <div className="flex items-center gap-4">
            <Image src="https://i.ibb.co/JwHdxbZ6/Generated-Image-September-10-2025-7-55-PM.png" alt="eAaharSetu Logo" width={112} height={45} />
            <div className="border-l-2 border-gray-300 h-10"></div>
            <Image src="https://i.ibb.co/rfXNQV5w/image.png" alt="QCI Logo" width={150} height={60}/>
          </div>
          <div className="flex justify-center">
            <Image src="https://i.ibb.co/qLZXZG2y/image.png" alt="Azadi-Ka-Amrit-Mahotsav-Logo" width={70} height={70} />
          </div>
          <div className="flex justify-end">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-blue-500 border-2">
                  <Languages className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
                  <span className="text-xs">{content[lang].langName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLang('en')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('hi')}>हिंदी</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('bn')}>বাংলা</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('te')}>తెలుగు</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('mr')}>मराठी</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang('ta')}>தமিழ்</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <hr className="w-full border-t-8 border-primary" />
      <div className="wavy-border">
        <main>
          <div className="flex w-full flex-col items-center justify-center p-4">
            <div className="z-10 flex w-full max-w-5xl flex-col items-center justify-center pt-10">
              <div className="mb-4 text-foreground flex items-center gap-4">
                <h1 className="text-5xl font-bold tracking-tight md:text-6xl animate-in fade-in slide-in-from-top-4 duration-1000">
                  {t('welcome', "Welcome to eAaharSetu")}
                </h1>
                <Wheat className="h-12 w-12 text-yellow-500" />
              </div>
              <p className="max-w-3xl text-center text-xl text-muted-foreground mb-6 animate-in fade-in slide-in-from-top-6 duration-1000">
                {t('tagline', "Transforming Agriculture with a Single Digital Platform")}
              </p>

              <p className="text-lg text-muted-foreground mb-6">{t('chooseRole', "Choose Your Role to Get Started")}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {content.en.roles.slice(0, 4).map((role, idx) => {
                  const href = role.role === 'dealer'
                    ? `/register/dealer?lang=${lang}`
                    : `/dashboard?role=${role.role}&lang=${lang}`;
                  
                  return (
                    <div key={idx} className="group bg-white dark:bg-card rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center p-5 gap-5 transition-all duration-300 hover:border-2 hover:border-primary hover:outline hover:outline-2 hover:outline-primary hover:-translate-y-1">
                      <div className="flex-shrink-0">
                        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-full p-3 flex items-center justify-center border-4 border-blue-100 dark:border-blue-900 group-hover:border-primary/30 transition-all duration-300">
                          <role.icon className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-xl text-foreground mb-1">{t(role.titleKey, role.title)}</div>
                        <div className="text-sm text-muted-foreground mb-2">{t(role.descriptionKey, role.description)}</div>
                      </div>
                      <div>
                        <Button asChild size="icon" className="rounded-full bg-primary text-white shadow-md hover:bg-primary/90 group-hover:scale-110 transition-transform duration-300">
                          <Link href={href} aria-label={`${t('continueAs', 'Continue as')} ${t(role.titleKey, role.title)}`}>
                            <ArrowRight className="h-5 w-5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {content.en.roles.length > 4 && (
                <div className="flex justify-center w-full max-w-4xl mx-auto mb-10">
                  <div className="w-full max-w-md">
                    {content.en.roles.slice(4).map((role, idx) => (
                      <div key={idx + 4} className="group bg-white dark:bg-card rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center p-5 gap-5 transition-all duration-300 hover:border-2 hover:border-blue-500 hover:outline hover:outline-2 hover:outline-blue-500 hover:-translate-y-1">
                        <div className="flex-shrink-0">
                          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-full p-3 flex items-center justify-center border-4 border-blue-100 dark:border-blue-900 group-hover:border-blue-400 transition-all duration-300">
                            <role.icon className="h-8 w-8 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-xl text-foreground mb-1">{t(role.titleKey, role.title)}</div>
                          <div className="text-sm text-muted-foreground mb-2">{t(role.descriptionKey, role.description)}</div>
                        </div>
                        <div>
                          <Button asChild size="icon" className="rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 group-hover:scale-110 transition-transform duration-300">
                            <Link href={`/dashboard?role=${role.role}&lang=${lang}`} aria-label={`${t('continueAs', 'Continue as')} ${t(role.titleKey, role.title)}`}>
                              <ArrowRight className="h-5 w-5" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="w-full bg-sky-100 dark:bg-sky-900/30 py-8 md:py-12">
            <div className="relative max-w-5xl mx-auto px-4">
              <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
                  <span className="text-[25vw] md:text-[20vw] lg:text-[18vw] xl:text-[16vw] font-black text-gray-100 dark:text-gray-500/10 opacity-30 leading-none tracking-tighter whitespace-nowrap">
                      #eAaharSetu
                  </span>
              </div>
              <div className="relative z-10 flex flex-col items-center justify-center">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-none tracking-tight mb-4 bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 text-transparent bg-clip-text">
                      #eAaharSetu
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-4">
                      <div>
                          <div className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-bold text-green-600">
                              <IndianRupee className="h-6 w-6 md:h-8 md:w-8" />
                              <AnimatedCounter end={17300000} duration={3000} />
                          </div>
                          <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium">
                              {t('valueSaved', "Value Saved this year")}
                          </p>
                      </div>
                      <div>
                          <div className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-bold text-yellow-600">
                              <Wheat className="h-6 w-6 md:h-8 md:w-8" />
                              <AnimatedCounter end={5000} duration={3000} suffix={` ${t('tons', 'Tons')}`}/>
                          </div>
                          <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium">
                              {t('grainsSaved', "Grains Saved")}
                          </p>
                      </div>
                        <div>
                          <div className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-bold text-blue-600">
                              <Users className="h-6 w-6 md:h-8 md:w-8" />
                              <AnimatedCounter end={25000} duration={3000} />
                          </div>
                          <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium">
                              {t('peopleFed', "People Fed (Est.)")}
                          </p>
                      </div>
                  </div>
              </div>
            </div>
          </div>
          
          <div className="w-full max-w-6xl mx-auto px-4">
            <div className="mt-12 w-full text-left animate-in fade-in duration-1000">
              <div className="mb-6 max-w-6xl mx-auto">
                <hr className="w-1/4 border-t-2 border-primary/20" />
              </div>

              <h2 className="text-4xl font-bold text-foreground mb-6 max-w-6xl mx-auto">{t('topPerformers', "Top Performers")}</h2>
              <div className="relative w-full">
                <Carousel
                  setApi={setPerformerApi}
                  opts={{
                  align: "start",
                  loop: false,
                  slidesToScroll: "auto",
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-4">
                    {topPerformers.map((performer, index) => (
                      <CarouselItem
                        key={index}
                        className="pl-4 md:basis-1/2 lg:basis-1/3"
                      >
                        <div className="h-full">
                          <PerformerCard {...performer} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-center items-center mt-8 gap-4 w-full">
                    <CarouselPrevious className="rounded-full bg-white shadow-lg border-0 hover:bg-gray-50 w-10 h-10 flex items-center justify-center static" />
                    <CarouselNext className="rounded-full bg-white shadow-lg border-0 hover:bg-gray-50 w-10 h-10 flex items-center justify-center static" />
                  </div>
                </Carousel>
              </div>
            </div>
          </div>

          <section className="w-full bg-gray-50 dark:bg-gray-800/10 py-12 my-12">
            <div className="container mx-auto px-4">
              <div className="flex justify-around items-center gap-8 flex-wrap">
                <Image src="https://i.ibb.co/wNJ6DjkN/Copilot-20250911-210534.png" alt="Encryption" width={140} height={140} className="object-contain" />
                <Image src="https://i.ibb.co/cSgn89w3/image.png" alt="FCI" width={140} height={140} className="object-contain" />
                <Image src="https://i.ibb.co/rfXNQV5w/image.png" alt="QCI" width={140} height={140} className="object-contain" />
                <Image src="https://i.ibb.co/BFxQDv2/Copilot-20250911-210952.png" alt="Cloud Based" width={140} height={140} className="object-contain" />
              </div>
            </div>
          </section>

          <section className="w-full bg-blue-800 text-white py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-6 text-center">{t('guidelinesTitle', "Standard Guidelines")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {guidelines.map((guideline, index) => (
                        <GuidelineCard key={index} {...guideline} />
                    ))}
                </div>
            </div>
          </section>

        </main>
        
        <section className="w-full bg-sky-100/70 dark:bg-sky-900/30 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-around items-center gap-8 text-center md:text-left">
              {content.en.impactStats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="bg-white rounded-full p-4 shadow-md">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stat.value}</p>
                    <p className="text-muted-foreground mt-1 text-sm">{t(stat.labelKey, stat.label)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <footer className="w-full bg-gray-900 text-white py-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} eAaharSetu. {t('footerRights', "All rights reserved.")}</p>
          </div>
      </footer>
    </div>
  );
}

    





    
    