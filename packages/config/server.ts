import ip from 'ip';

require('dotenv').config()

const { env } = process;

export default {
    /** 服务端host, 默认为本机ip地址(可能会是局域网地址) */
    host: env.Host || ip.address(),

    // service port
    port: env.Port ? parseInt(env.Port, 10) : 9200,

    // mongodb address
    database: "mongodb+srv://Bot:rattlesnake20@cluster0.ehnrp.mongodb.net/persona",

    redis: {
        host: env.RedisHost || 'redis-18607.c283.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 18607,
    },

    // jwt encryption secret
    jwtSecret: env.JwtSecret || 'jwtSecret',

    // Maximize the number of groups
    maxGroupsCount: env.MaxGroupCount ? parseInt(env.MaxGroupCount, 10) : 3,

    allowOrigin: env.AllowOrigin ? env.AllowOrigin.split(',') : null,

    // token expires time
    tokenExpiresTime: env.TokenExpiresTime
        ? parseInt(env.TokenExpiresTime, 10)
        : 1000 * 60 * 60 * 24 * 30,

    // administrator user id
    administrator: env.Administrator ? env.Administrator.split(',') : [],

    /** 禁用注册功能 */
    disableRegister: env.DisableRegister
        ? env.DisableRegister === 'true'
        : false,

    /** disable user create new group */
    disableCreateGroup: env.DisableCreateGroup
        ? env.DisableCreateGroup === 'true'
        : false,

    /** Aliyun OSS */
    aliyunOSS: {
        enable: env.ALIYUN_OSS ? env.ALIYUN_OSS === 'true' : false,
        accessKeyId: env.ACCESS_KEY_ID || '',
        accessKeySecret: env.ACCESS_KEY_SECRET || '',
        roleArn: env.ROLE_ARN || '',
        region: env.REGION || '',
        bucket: env.BUCKET || '',
        endpoint: env.ENDPOINT || '',
    },
    //supabase config
    supabase: {
        url: env.SUPABASE_URL || 'https://pktxkdhuqdoxmtnwdirz.supabase.co',
        key: env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrdHhrZGh1cWRveG10bndkaXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MTg1NDUsImV4cCI6MjA1MDI5NDU0NX0.8F2His81RSoaNQnGXxH4eQnMF4qOuoTUfswmdmoekHM',
    }
};
