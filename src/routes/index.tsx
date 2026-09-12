import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  Container,
  Cog,
  Link2,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

import { FleetStatus } from "@/components/site/FleetStatus";
import { SeoJsonLd } from "@/components/site/SeoJsonLd";
import { StatCounters } from "@/components/site/StatCounters";
import { useQuote } from "@/components/site/quote-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FAQS, IMAGES,
