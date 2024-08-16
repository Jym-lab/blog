import { getAllFiles, getCategoryInPosts } from "@/lib/contentsManager";
import { convertToDateFormat } from "@/utils/helpers";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    const posts = await getAllFiles()
    return posts.map(post => post.category, )
}

export default async function Page({ params }: { params: { category: string } }){
    const  { category } = params
    const posts = await getCategoryInPosts(category);
    if (!posts.length) {
      notFound();
    }
    return (
      <div>
        postLists Pages<br></br><br></br>
        {posts.map( post => (
            <>
                <div>
                    {post.meta.title}<br></br>
                    {post.meta.description}<br></br>
                    {post.meta.hidden.toString()}<br></br>
                    {post.meta.tags}<br></br>
                    {convertToDateFormat(post.meta.create_at)}<br></br>
                    {convertToDateFormat(post.meta.update_at)}<br></br>
                </div>
                <br></br>
            </>
            
        ))}
      </div>
    );
  }