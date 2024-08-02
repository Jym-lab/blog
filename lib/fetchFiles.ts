import fs from 'fs'
import path from 'path'

const cacheFiles: { [key: string]: string[] } = {};

const isMdxFile = (filePath: string): boolean => path.extname(filePath) === '.mdx';

const fetchAllFiles = (dir: string, depth = 0, maxDepth = 2, results: string[] = []) => {
    if (depth > maxDepth) return results;

    fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            if (depth != maxDepth) results.push(filePath);
            fetchAllFiles(filePath, depth + 1, maxDepth, results);
        } else if (isMdxFile(filePath)) {
            results.push(filePath);
        }
    });

    return results;
};

export const getAllFiles = (dir: string) => {
    if (cacheFiles[dir]) return cacheFiles[dir];

    const results = fetchAllFiles(dir);
    cacheFiles[dir] = results;

    return results;
};

export const getPostsInfo = (dir: string) => {
    const allFiles = getAllFiles(dir)
    const posts: {category: string, file: string}[] = [];
    const categories: string[] = [];
    allFiles.forEach(filePath => {
        const relativePath = path.relative(dir, filePath);
        const splitPath = relativePath.split(path.sep);
    
        if (isMdxFile(filePath)) {
            posts.push({
                category: splitPath.slice(0, -1).join(path.sep),
                file: splitPath[splitPath.length - 1]
            });
        } else {
            categories.push(relativePath);
        }
    });
    return {categories, posts}
}