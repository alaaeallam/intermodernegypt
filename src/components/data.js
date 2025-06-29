// src/components/data.js
import { client } from "../sanityClient";

export async function fetchCards() {
  const query = `*[_type == "card"]{
  _id,
  title,
  image {
    asset->{
      url
    }
  }
}`;

  const cards = await client.fetch(query);
  return cards;
}