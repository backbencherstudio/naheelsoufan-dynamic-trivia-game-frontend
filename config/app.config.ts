// server base url
export const URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT ||
  "https://car-wash-backend.signalsmind.com";

export const ImageUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/storage/services/`;
export const blogImgUrl =
  process.env.NEXT_PUBLIC_API_ENDPOINT ||
  "https://car-wash-backend.signalsmind.com";

// app config
export const AppConfig = () => ({
  app: {
    // server endpoint
    url: URL,
    name: "inzillytrivia",
    slogan: "inzillytrivia",
    meta: {
      description: "inzillytrivia",
      keywords: "inzillytrivia",
    },

    // api endpoint
    apiUrl: `${URL}/api`,
  },
});
