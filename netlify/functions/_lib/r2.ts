import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
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

const toBuffer = async (body: unknown): Promise<Buffer> => {
    if (!body) return Buffer.alloc(0);
    const maybeTransform = body as { transformToByteArray?: () => Promise<Uint8Array> };
    if (typeof maybeTransform.transformToByteArray === 'function') {
        const bytes = await maybeTransform.transformToByteArray();
        return Buffer.from(bytes);
    }
    if (body instanceof Uint8Array) return Buffer.from(body);
    if (Buffer.isBuffer(body)) return body;
    throw new Error('Unsupported R2 body stream type');
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

export const downloadCardImage = async (objectKey: string) => {
    if (!isR2Configured()) {
        throw new Error('R2 is not configured.');
    }

    const bucket = getEnv('CF_R2_BUCKET');
    const s3Client = getS3Client();
    const result = await s3Client.send(new GetObjectCommand({
        Bucket: bucket,
        Key: objectKey
    }));

    const body = await toBuffer(result.Body);
    return {
        body,
        contentType: result.ContentType || 'image/png',
        cacheControl: result.CacheControl || 'public, max-age=31536000, immutable'
    };
};
