import { resultCache } from '@/utils/cache';
import { isMdxFile } from '@/utils/helpers';
import { POSTS_DIR } from '@/utils/paths';
import fs from 'fs'
import path from 'path'

export const countPostsByCategory = (posts: string[]) => {
    const countMap: Record<string, number> = {};

    posts.forEach(post => {
        let category = path.dirname(path.relative(POSTS_DIR, post));
        while (category !== '.') {
            countMap[category] = (countMap[category] || 0) + 1;
            category = path.dirname(category);
        }
    });

    return countMap;
};

const fetchAllFiles = (dir: string, depth = 0, maxDepth = 2, posts: string[] = [], categories: string[] = []) => {
    if (depth > maxDepth) return {categories, posts};
    fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            if (depth != maxDepth) categories.push(path.relative(POSTS_DIR, filePath));
            fetchAllFiles(filePath, depth + 1, maxDepth, posts, categories);
        } else if (isMdxFile(filePath)) {
            posts.push(filePath);
        }
    });

    return {categories, posts};
};

export const getAllFiles = () => resultCache('getAllFiles', () => fetchAllFiles(POSTS_DIR));