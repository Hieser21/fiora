import * as config from '../../../config/server';
import { createClient } from '@supabase/supabase-js';

let supabaseClient;
let endpoint = '';

export async function initOSS() {
    const supabase = createClient(
        config.default.supabase.url,
        config.default.supabase.key
    );
    supabaseClient = supabase;
    
    if (config.default.supabase.url) {
        endpoint = `${config.default.supabase.url}/`;
    }

    // Refresh token handling if needed
    const OneHour = 1000 * 60 * 60;
    setInterval(async () => {
        const { data: session } = await supabase.auth.getSession();
        if (session) {
            // Token refresh logic here if needed
        }
    }, OneHour);
}

export function getOSSFileUrl(url = '', process = '') {
    const [rawUrl = '', extraParams = ''] = url.split('?');
    function stripHttps(url: string): string {
        return url.replace('https://pktxkdhuqdoxmtnwdirz.supabase.co/', '');
      }
    if (supabaseClient && rawUrl.startsWith('supabase:')) {
        const filename = rawUrl.slice(9);
        const { data } = supabaseClient.storage
            .from('p5-users')
            .getPublicUrl(stripHttps(url));
            
        return `${data.data.publicUrl}${process ? `?process=${process}` : ''}${
            extraParams ? `&${extraParams}` : ''
        }`;
    }
    let data = supabaseClient.storage.from('p5-users').getPublicUrl(stripHttps(url))
    if (stripHttps(url).startsWith('/')){
        return `${url}`
    }
    return `${data.data.publicUrl}`;
}

export default async function uploadFile(
    blob: Blob | string,
    fileName: string,
    isBase64 = false,
): Promise<string> {
    if (!supabaseClient) {
        throw Error('Supabase client not initialized');
    }

    const file = isBase64 ? Buffer.from(blob as string, 'base64') : blob;
    
    const { data, error } = await supabaseClient.storage
        .from('p5-users')
        .upload(fileName, file);

    if (error) {
        throw Error(`Upload failed: ${error.message}`);
    }

    return endpoint + fileName;
}
