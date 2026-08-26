const servers = import.meta.env.VITE_API_URL;

console.log("VITE_API_URL:", servers);
console.log("MODE:", import.meta.env.MODE);

if (!servers) {
  throw new Error("VITE_API_URL is not configured");
}

export default servers;