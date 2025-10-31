import { Heart, User, Briefcase, Trees, Camera, Calendar, FolderOpen, Globe, Lock, Users, FileText, Star } from "lucide-react";

export const GALLERY_CATEGORIES = [
  { value: 'wedding', label: 'Wedding', icon: Heart },
  { value: 'portrait', label: 'Portrait', icon: User },
  { value: 'corporate', label: 'Corporate', icon: Briefcase },
  { value: 'nature', label: 'Nature', icon: Trees },
  { value: 'street', label: 'Street Photography', icon: Camera },
  { value: 'event', label: 'Event', icon: Calendar },
  { value: 'other', label: 'Other', icon: FolderOpen }
] as const;

export const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public', description: 'Anyone can view this gallery', icon: Globe },
  { value: 'private', label: 'Private', description: 'Password protected access', icon: Lock },
  { value: 'client-review', label: 'Client Review', description: 'Share with specific clients', icon: Users },
  { value: 'draft', label: 'Draft', description: 'Not visible to anyone', icon: FileText },
  { value: 'portfolio', label: 'Portfolio', description: 'Featured work showcase', icon: Star }
] as const;
