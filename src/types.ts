export type PackageSummary = {
  id: string;
  title: string;
  destination: string[];
  duration: string;
  price: string;
  image: string;
  shortDescription: string;
  accentColor?: string;
};

export type ItineraryDay = {
  day: number;
  title: string;
  description: string;
  meals: string;
};

export type PackageDetail = {
  id: string;
  title: string;
  destination: string[];
  duration: string;
  price: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
  };
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
};

export type TermsAndConditions = {
  paymentPolicy?: string[];
  hotelPolicy?: string[];
  transportationPolicy?: string[];
  cancellationPolicy?: string[];
  childPolicy?: string[];
};

export type Review = {
  name: string;
  rating: number;
  review: string;
  image: string;
};

export type YoutubeData = {
  channelId: string;
  channelName?: string;
  latestVideo: { id: string; title: string; thumbnail: string };
};
