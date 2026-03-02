const parseFlag = (value: string | undefined, defaultValue: boolean) => {
    if (value === undefined || value === null || value === '') return defaultValue;
    const normalized = value.trim().toLowerCase();
    if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
    return defaultValue;
};

export const featureFlags = {
    claimForm: parseFlag(import.meta.env.VITE_FEATURE_CLAIM_FORM as string | undefined, true),
    persistentShare: parseFlag(import.meta.env.VITE_FEATURE_PERSISTENT_SHARE as string | undefined, true),
    opsDash: parseFlag(import.meta.env.VITE_FEATURE_OPS_DASH as string | undefined, true)
};
