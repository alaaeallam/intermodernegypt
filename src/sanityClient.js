import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: 'uev0xjjp',     
  dataset: 'production',     
  apiVersion: '2024-06-29',  
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(client);

export function urlForImage(source) {
  if (!source?.asset?._ref) {
    console.error('Invalid image source:', source);
    return '';
  }
  return builder.image(source).url();
}