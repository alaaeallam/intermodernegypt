import { client } from "./sanityClient";

export async function fetchCards() {
  const query = `
    *[_type == "card"]{
      _id,
      title,
      image
    }
  `;

  const data = await client.fetch(query);

  return data.map(item => ({
    title: item.title,
    imageRef: item.image
  }));
}