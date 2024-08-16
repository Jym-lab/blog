import { getPostList } from "@/lib/contentsManager";
import { convertToDateFormat } from "@/utils/helpers";

export default async function Home() {
    const posts = await getPostList()
    console.log("🚀 ~ Home ~ posts:", posts)
    return (
      <div>
        postLists Pages<br></br><br></br>
        {posts.map(post => (
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