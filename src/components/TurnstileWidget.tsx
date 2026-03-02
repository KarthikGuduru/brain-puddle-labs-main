import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        turnstile?: {
            render: (container: HTMLElement, options: Record<string, unknown>) => string;
            reset: (widgetId?: string) => void;
            remove: (widgetId?: string) => void;
        };
    }
}

const SCRIPT_ID = 'cloudflare-turnstile-script';

interface TurnstileWidgetProps {
    siteKey: string;
    onTokenChange: (token: string) => void;
}

const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({ siteKey, onTokenChange }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!siteKey || !containerRef.current) return;

        const renderWidget = () => {
            if (!window.turnstile || !containerRef.current || widgetIdRef.current) return;
            widgetIdRef.current = window.turnstile.render(containerRef.current, {
                sitekey: siteKey,
                callback: (token: string) => onTokenChange(token),
                'expired-callback': () => onTokenChange(''),
                'error-callback': () => onTokenChange('')
            });
        };

        const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
        if (existingScript) {
            if (window.turnstile) renderWidget();
            else existingScript.addEventListener('load', renderWidget, { once: true });
        } else {
            const script = document.createElement('script');
            script.id = SCRIPT_ID;
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
            script.async = true;
            script.defer = true;
            script.addEventListener('load', renderWidget, { once: true });
            document.head.appendChild(script);
        }

        return () => {
            if (window.turnstile && widgetIdRef.current) {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, [siteKey, onTokenChange]);

    return <div ref={containerRef} />;
};

export default TurnstileWidget;
