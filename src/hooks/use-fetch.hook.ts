import { TRANSLATIONS_KEYS_2 } from '@/i18n/translation-keys';
import { customToast } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react'

function useFetch<R = any>(fetchAction: () => Promise<R>, initialData: R, isAllowedToFetch: boolean = true): [R, boolean] {

    const [isPending, startTransition] = useTransition()
    const [data, setData] = useState<R>(initialData);
    const translation = useTranslations()

    useEffect(() => {
        if (!isAllowedToFetch) return
        startTransition(async () => {
            try {
                const result = await fetchAction();
                setData(result);
            } catch (error) {
                customToast.error(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.SOMETHING_WRONG));
            }
        });
    }, [isAllowedToFetch]);

    return [data, isPending]
}

export default useFetch