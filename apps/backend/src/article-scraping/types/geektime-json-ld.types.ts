/**
 * Common properties shared across all Geektime JSON-LD types
 */
interface GeektimeJsonLdBase {
  '@context'?: 'https://schema.org';
  '@id'?: string;
  inLanguage?: string;
}

/**
 * Common properties for media objects (images, videos, etc.)
 */
interface MediaObject extends GeektimeJsonLdBase {
  contentUrl: string; // Required since we rely on it
  width?: number;
  height?: number;
  caption?: string;
}

/**
 * Image object in Geektime JSON-LD
 */
interface GeektimeJsonLdImageObject extends MediaObject {
  '@type': 'ImageObject';
}

/**
 * Person object in Geektime JSON-LD
 */
interface GeektimeJsonLdPerson extends GeektimeJsonLdBase {
  '@type': 'Person';
  name: string;
  description?: string;
  sameAs?: string[];
  image?: GeektimeJsonLdImageObject;
}

/**
 * Organization object in Geektime JSON-LD
 */
interface GeektimeJsonLdOrganization extends GeektimeJsonLdBase {
  '@type': 'Organization';
  name: string;
  url?: string;
  logo?: GeektimeJsonLdImageObject;
  sameAs?: string[];
}

/**
 * Article object in Geektime JSON-LD
 */
interface GeektimeJsonLdArticle extends GeektimeJsonLdBase {
  '@type': 'Article';
  headline: string;
  datePublished?: string;
  dateModified?: string;
  author: GeektimeJsonLdPerson | { '@id': string } | { name: string };
  wordCount?: number;
  commentCount?: number;
  publisher?: GeektimeJsonLdOrganization | { '@id': string };
  image?: GeektimeJsonLdImageObject | { '@id': string };
  thumbnailUrl?: string;
  keywords?: string[];
  articleSection?: string[] | string;
  mainEntityOfPage?: { '@id': string };
  isPartOf?: { '@id': string };
}

/**
 * WebPage object in Geektime JSON-LD
 */
interface GeektimeJsonLdWebPage extends GeektimeJsonLdBase {
  '@type': 'WebPage';
  name: string;
  url?: string;
  description?: string;
  datePublished?: string;
  dateModified?: string;
  primaryImageOfPage?: GeektimeJsonLdImageObject | { '@id': string };
  thumbnailUrl?: string;
  breadcrumb?: { '@id': string };
  isPartOf?: { '@id': string };
}

/**
 * WebSite object in Geektime JSON-LD
 */
interface GeektimeJsonLdWebSite extends GeektimeJsonLdBase {
  '@type': 'WebSite';
  name: string;
  url?: string;
  description?: string;
  publisher?: GeektimeJsonLdOrganization | { '@id': string };
}

/**
 * BreadcrumbList object in Geektime JSON-LD
 */
interface GeektimeJsonLdBreadcrumbItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
}

interface GeektimeJsonLdBreadcrumbList extends GeektimeJsonLdBase {
  '@type': 'BreadcrumbList';
  itemListElement: GeektimeJsonLdBreadcrumbItem[];
}

/**
 * Union type of all possible Geektime JSON-LD types
 */
type GeektimeJsonLdType =
  | GeektimeJsonLdArticle
  | GeektimeJsonLdPerson
  | GeektimeJsonLdOrganization
  | GeektimeJsonLdImageObject
  | GeektimeJsonLdWebPage
  | GeektimeJsonLdWebSite
  | GeektimeJsonLdBreadcrumbList;

/**
 * Root Geektime JSON-LD structure
 */
interface GeektimeJsonLdRoot {
  '@context': 'https://schema.org';
  '@graph': GeektimeJsonLdType[];
}

export type {
  GeektimeJsonLdRoot,
  GeektimeJsonLdType,
  GeektimeJsonLdArticle,
  GeektimeJsonLdPerson,
  GeektimeJsonLdOrganization,
  GeektimeJsonLdImageObject,
  GeektimeJsonLdWebPage,
  GeektimeJsonLdWebSite,
  GeektimeJsonLdBreadcrumbList,
  GeektimeJsonLdBreadcrumbItem,
};
