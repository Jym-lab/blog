import path from "path";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export const isMdxFile = (filePath: string): boolean => path.extname(filePath) === '.mdx';

export const convertToBoolean = (value: any) => {
    if (typeof value === 'string') {
        return value.toLowerCase() === 'no';
    }

    return false;
};

export const convertToDateFormat = (date: Date) => {
    return dayjs.utc(date).format('YYYY년 MM월 DD일 HH:mm:ss')
}