import fetch from './fetch';
import * as config from '../../../config/server'
import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
    config.default.supabase.url,
    config.default.supabase.key,
);
/**
 * 上传文件
 * @param blob 文件blob数据
 * @param fileName 文件名
 */
export default async function uploadFile(
    blob: Blob | string,
    fileName: string,
    isBase64 = false,
): Promise<string> {
    const file = isBase64 ? Buffer.from(blob as string, 'base64') : blob;
    
    const { data, error } = await supabase.storage
        .from('fiora-uploads')
        .upload(fileName, file);

    if (error) {
        throw Error(`Failed to upload file: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
        .from('p5-users')
        .getPublicUrl(fileName);

    return publicUrl;
}

export function getOSSFileUrl(url: string | number = '', process = '') {
    if (typeof url === 'number') {
        return url;
    }
    
    // Handle Supabase storage URLs
    const [rawUrl = ''] = url.split('?');
    if (rawUrl.includes('pktxkdhuqdoxmtnwdirz.supabase.co')) {
        return url; // Return Supabase URLs as-is
    }
    
    // Legacy URL handling
    if (url.startsWith('//')) {
        return `https:${url}`;
    }
    if (url.startsWith('/')) {
        return supabase.storage.from('p5-users').getPublicUrl(url);
    }
    return url;
}
