import { PostInfo, PostListItem, PostMetadata } from '@/config/posts';
import { resultCache } from '@/utils/cache';
import { isMdxFile } from '@/utils/helpers';
import { POSTS_DIR } from '@/utils/paths';
import { userCustomFormat } from '@/lib/custom/format'
import fs from 'fs'
import matter from 'gray-matter';
import { posix as path} from 'path'

export const getPostList = async (): Promise<PostListItem[]> => {
    const postsInfo = await getAllFiles();

    const postsListPromises = postsInfo.map(async (post) => {
        const file = await fs.promises.readFile(post.post, 'utf-8');
        const { data } = matter(file);
        const grayMatter = userCustomFormat(data as PostMetadata);
        const slug = `${post.category}/${path.basename(post.post, '.mdx')}`

        grayMatter.category = post.category
        if (post.category === '.') grayMatter.category = 'uncategorized';

        return {
            meta: {
                ...grayMatter,
            },
            slug: slug,
        };
    });

    const postsList = await Promise.all(postsListPromises);

    return postsList;
};

export const getCategoryInPosts = async (category: string): Promise<PostListItem[]> => {
    const allPosts = await getPostList();
    return allPosts.filter(post => post.meta.category === category);
};

export const countPostsByCategory = (posts: string[]) => {
    const countMap: Record<string, number> = {};

    posts.forEach(post => {
        let category = path.dirname(path.relative(POSTS_DIR, post))
        while (category !== '.') {
            countMap[category] = (countMap[category] || 0) + 1;
            category = path.dirname(category);
        }
    });

    return countMap;
};

const fetchAllFiles = async (dir: string, depth = 0, maxDepth = 2): Promise<PostInfo[]> => {
    const postInfos: PostInfo[] = [];

    const navigateDir = async (currentDir: string, currentDepth: number) => {
        if (currentDepth > maxDepth) return;

        const files = await fs.promises.readdir(currentDir);
        for (const file of files) {
            const filePath = path.join(currentDir, file);
            const stat = await fs.promises.stat(filePath);

            if (stat.isDirectory()) {
                await navigateDir(filePath, currentDepth + 1);
            } else if (isMdxFile(filePath)) {
                const category = path.relative(dir, path.dirname(filePath)).split(path.sep).join('_');
                postInfos.push({
                    post: filePath,
                    category: category === '' ? '.' : category,
                });
            }
        }
    };

    await navigateDir(dir, depth);

    return postInfos;
};

export const getAllFiles = () => resultCache('getAllFiles', () => fetchAllFiles(POSTS_DIR));