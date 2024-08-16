import { convertToBoolean } from '@/utils/helpers';

export const userCustomFormat = (grayMatter) => {
    if (typeof grayMatter.tags === 'string') {
        grayMatter.tags = grayMatter.tags.slice(1, -1).split(', ').map(item => item.trim());
    }
    if (typeof grayMatter.hidden === 'string') {
        grayMatter.hidden = convertToBoolean(grayMatter.hidden)
    }

    return grayMatter
}