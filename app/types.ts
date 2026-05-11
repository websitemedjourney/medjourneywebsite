export type PackageSummary = {
  id: string;
  title: string;
  destination: string[];
  duration: string;
  price: string;
  image: string;
  shortDescription: string;
  highlighted?: boolean;
  published?: boolean;
};

export type ItineraryDay = {
  day: number;
  title: string;
  description: string;
  meals?: string;
  image?: string;
};

export type PackageDetail = {
  id: string;
  title: string;
  destination: string[];
  duration: string;
  price: string;
  coverImage: string;
  shortDescription: string;
  overview: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  gallery: string[];
  termsAndConditions?: TermsAndConditions;
  termsNote?: string;
  itineraryPdf?: string;
  highlighted?: boolean;
  published?: boolean;
};

export type TermsAndConditions = {
  paymentPolicy?: string[];
  hotelPolicy?: string[];
  transportationPolicy?: string[];
  cancellationPolicy?: string[];
  childPolicy?: string[];
};

export type Review = {
  id?: number;
  name: string;
  email?: string;
  rating: number;
  review: string;
  image?: string;
  packageId?: string;
  highlightedHome?: boolean;
  highlightedPackage?: boolean;
  approved?: boolean;
  createdAt?: string;
};

export type ContactSubmission = {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read?: boolean;
  createdAt?: string;
};

export type YoutubeData = {
  channelId: string;
  channelName?: string;
  videos: { id: string; title: string; thumbnail: string }[];
};
