import { getAllFiles } from "@/lib/contentsManager";

export default async function Home() {
  const posts = await getAllFiles()
  console.log("🚀 ~ Home ~ posts:", posts)

  return (
    <>Hello, Nextjs!</>
  );
}