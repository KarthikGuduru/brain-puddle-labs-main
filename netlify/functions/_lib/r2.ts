import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getEnv } from './env';

export const isR2Configured = () => {
    const endpoint = getEnv('CF_R2_ENDPOINT');
    const bucket = getEnv('CF_R2_BUCKET');
    const accessKeyId = getEnv('CF_R2_ACCESS_KEY_ID');
    const secretAccessKey = getEnv('CF_R2_SECRET_ACCESS_KEY');
    const publicBase = getEnv('CF_R2_PUBLIC_BASE_URL');
    return Boolean(endpoint && bucket && accessKeyId && secretAccessKey && publicBase);
};

const getS3Client = () => {
    const endpoint = getEnv('CF_R2_ENDPOINT');
    const accessKeyId = getEnv('CF_R2_ACCESS_KEY_ID');
    const secretAccessKey = getEnv('CF_R2_SECRET_ACCESS_KEY');
    return new S3Client({
        region: 'auto',
        endpoint,
        forcePathStyle: true,
        credentials: { accessKeyId, secretAccessKey }
    });
};

const parseImageDataUrl = (dataUrl: string) => {
    const match = String(dataUrl || '').match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) {
        throw new Error('cardImageBase64 must be a valid image data URL');
    }
    const mimeType = match[1];
    const base64Data = match[2];
    return {
        mimeType,
        body: Buffer.from(base64Data, 'base64')
    };
};

const resolveExtension = (mimeType: string) => {
    if (mimeType.includes('png')) return 'png';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'jpg';
    if (mimeType.includes('webp')) return 'webp';
    return 'png';
};

export const uploadCardImage = async (dataUrl: string, shareId: string) => {
    const { mimeType, body } = parseImageDataUrl(dataUrl);
    const bucket = getEnv('CF_R2_BUCKET');
    const publicBase = getEnv('CF_R2_PUBLIC_BASE_URL').replace(/\/+$/, '');
    const extension = resolveExtension(mimeType);
    const objectKey = `ai-cards/${shareId}.${extension}`;

    if (!isR2Configured()) {
        return { objectKey, publicUrl: dataUrl };
    }

    const s3Client = getS3Client();
    await s3Client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: body,
        ContentType: mimeType,
        CacheControl: 'public, max-age=31536000, immutable'
    }));

    return {
        objectKey,
        publicUrl: `${publicBase}/${objectKey}`
    };
};
