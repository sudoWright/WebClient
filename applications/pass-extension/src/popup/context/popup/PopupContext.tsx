import { type FC, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { c } from 'ttag';

import { CircleLoader } from '@proton/atoms/CircleLoader';
import { NotificationsContext } from '@proton/components';
import { useNotifications } from '@proton/components/hooks';
import { popupMessage, sendMessage } from '@proton/pass/extension/message';
import { selectWorkerSyncing } from '@proton/pass/store';
import * as requests from '@proton/pass/store/actions/requests';
import type { MaybeNull, PopupInitialState, WorkerState } from '@proton/pass/types';
import { WorkerMessageType, type WorkerMessageWithSender, WorkerStatus } from '@proton/pass/types';
import type { ParsedUrl } from '@proton/pass/utils/url';
import { parseUrl } from '@proton/pass/utils/url';
import { workerReady } from '@proton/pass/utils/worker';
import noop from '@proton/utils/noop';

import type { ExtensionAppContextValue } from '../../../shared/components/extension';
import { ExtensionContextProvider } from '../../../shared/components/extension';
import { INITIAL_POPUP_STATE, INITIAL_WORKER_STATE } from '../../../shared/constants';
import { useExtensionContext } from '../../../shared/hooks';
import { useRequestStatusEffect } from '../../../shared/hooks/useRequestStatusEffect';
import { enhanceNotification } from '../../../shared/notification';
import type { ItemDraftState } from '../../hooks/useItemDraft';

export interface PopupContextValue extends Omit<ExtensionAppContextValue, 'context'> {
    initialized: boolean /* retrieved popup initial state */;
    ready: boolean /* enable UI user actions */;
    url: ParsedUrl /* current tab parsed URL */;
    state: WorkerState & PopupInitialState;
    sync: () => void;
}

export const PopupContext = createContext<PopupContextValue>({
    initialized: false,
    ready: false,
    url: parseUrl(),
    state: { ...INITIAL_WORKER_STATE, ...INITIAL_POPUP_STATE },
    logout: noop,
    lock: noop,
    sync: noop,
});

/* this cannot be included directly in `PopupContextProvider` because
 * of the `useExtensionContext` call which requires this component to
 * be a descendant of `ExtensionContextProvider`  */
const PopupContextContainer: FC = ({ children }) => {
    const history = useHistory<ItemDraftState>();

    const extensionContext = useExtensionContext();
    const { status } = extensionContext.state;
    const { url, tabId } = extensionContext.context!;

    const { createNotification } = useNotifications();
    const notificationsManager = useContext(NotificationsContext);
    useEffect(() => notificationsManager.setOffset({ y: 10 }), []);

    const [initial, setInitial] = useState<MaybeNull<PopupInitialState>>(null);
    const syncing = useSelector(selectWorkerSyncing) || extensionContext.state.status === WorkerStatus.BOOTING;

    useRequestStatusEffect(requests.syncing(), {
        onStart: () =>
            createNotification({
                key: requests.syncing(),
                showCloseButton: false,
                text: (
                    <>
                        {c('Info').t`Syncing your vaults…`} <CircleLoader />
                    </>
                ),
            }),
    });

    const onPopupInit = useCallback((state: PopupInitialState) => {
        setInitial(state);

        if (state.draft !== null) {
            const { draft } = state;
            const { itemId, shareId, type, mode } = draft;

            switch (mode) {
                case 'new':
                    return history.push(`/item/new/${type}`, { draft });
                case 'edit':
                    return history.push(`/share/${shareId}/item/${itemId}/edit`, { draft });
            }
        }
    }, []);

    useEffect(() => {
        if (workerReady(status)) {
            void sendMessage.onSuccess(
                popupMessage({ type: WorkerMessageType.POPUP_INIT, payload: { tabId } }),
                onPopupInit
            );
        }
    }, [status]);

    const popupContext = useMemo<PopupContextValue>(() => {
        const { state, ready } = extensionContext;

        return {
            ...extensionContext,
            state: { ...state, ...(initial ?? INITIAL_POPUP_STATE) },
            ready: ready && !syncing /* worker ready and no ongoing syncs */,
            initialized: initial !== null /* `POPUP_INIT` response resolved */,
            url,
        };
    }, [extensionContext, syncing, initial]);

    return <PopupContext.Provider value={popupContext}>{children}</PopupContext.Provider>;
};

export const PopupContextProvider: FC = ({ children }) => {
    const { createNotification } = useNotifications();

    const onWorkerMessage = (message: WorkerMessageWithSender) => {
        if (message.type === WorkerMessageType.NOTIFICATION) {
            createNotification(enhanceNotification(message.payload.notification));
        }
    };

    return (
        <ExtensionContextProvider endpoint="popup" messageFactory={popupMessage} onWorkerMessage={onWorkerMessage}>
            <PopupContextContainer>{children}</PopupContextContainer>
        </ExtensionContextProvider>
    );
};