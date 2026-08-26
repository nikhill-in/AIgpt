// let IS_PROD = true;

// const servers = IS_PROD
//   ? import.meta.env.PROD_API_URL
//   : import.meta.env.VITE_API_URL;

// export default servers;


const servers = import.meta.env.PROD_API_URL;

if (!servers) {
  throw new Error("VITE_API_URL is not configured");
}

export default servers;