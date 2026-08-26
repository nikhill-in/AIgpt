const servers = import.meta.env.VITE_API_URL;

if (!servers) {
  throw new Error(
    `VITE_API_URL missing. Available env keys: ${Object.keys(import.meta.env).join(", ")}`
  );
}

export default servers;