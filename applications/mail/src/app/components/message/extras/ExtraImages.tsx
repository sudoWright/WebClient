import { c } from 'ttag';

import { Button, Kbd } from '@proton/atoms';
import { Icon, Tooltip } from '@proton/components';
import { shiftKey } from '@proton/shared/lib/helpers/browser';
import { MailSettings } from '@proton/shared/lib/interfaces';
import { hasShowEmbedded, hasShowRemote } from '@proton/shared/lib/mail/images';

import { hasToSkipProxy } from '../../../helpers/message/messageRemotes';
import { MessageImages } from '../../../logic/messages/messagesTypes';

interface Props {
    messageImages?: MessageImages;
    type: string;
    onLoadImages: () => void;
    mailSettings?: MailSettings;
}

const ExtraImages = ({ messageImages, type, onLoadImages, mailSettings }: Props) => {
    const { Shortcuts = 0 } = mailSettings || {};

    const { showRemoteImages = true, showEmbeddedImages = true } = messageImages || {};

    const couldLoadDirect = type === 'remote' && showRemoteImages === true && hasToSkipProxy(messageImages?.images);

    if (type === 'embedded' && hasShowEmbedded(mailSettings)) {
        return null;
    }

    if (type === 'embedded' && showEmbeddedImages !== false) {
        return null;
    }

    if (type === 'remote' && hasShowRemote(mailSettings) && !couldLoadDirect) {
        return null;
    }

    if (type === 'remote' && showRemoteImages !== false && !couldLoadDirect) {
        return null;
    }

    const remoteText = couldLoadDirect
        ? c('Action').t`Some images could not be loaded with tracker protection.`
        : c('Action').t`This message contains remote content.`;

    const embeddedText = c('Action').t`This message contains embedded images.`;

    const text = type === 'remote' ? remoteText : embeddedText;

    const actionText = type === 'embedded' ? c('Action').t`Load embedded images` : c('Action').t`Load`;

    const tooltipText = couldLoadDirect
        ? c('Action').t`Images will be loaded without a proxy`
        : type === 'remote'
        ? c('Title').t`Load remote content`
        : c('Title').t`Load embedded images`;

    const tooltip = Shortcuts ? (
        <>
            {tooltipText}
            <br />
            <Kbd shortcut={shiftKey} /> + <Kbd shortcut="C" />
        </>
    ) : undefined;

    if (type === 'embedded') {
        return (
            <Tooltip title={text}>
                <Button
                    onClick={onLoadImages}
                    data-testid="embedded-content:load"
                    className="inline-flex flex-align-items-center on-mobile-w100 on-mobile-flex-justify-center mr-0 md:mr-0 mb-3 px-2"
                >
                    <Icon name="image" className="flex-item-noshrink ml-1" />
                    <span className="ml-2">{actionText}</span>
                </Button>
            </Tooltip>
        );
    }

    return (
        <div className="bg-norm rounded border pr-2 md:pr-1 pb-2 md:pb-1 pt-1 pl-2 mb-3 flex flex-nowrap on-mobile-flex-column">
            <div className="flex-item-fluid flex flex-nowrap mb-2 md:mb-0">
                <Icon name={couldLoadDirect ? 'info-circle' : 'image'} className="mt-2 ml-1 flex-item-noshrink" />
                <span className="px-2 flex flex-item-fluid flex-align-items-center">{text}</span>
            </div>
            <span className="flex-item-noshrink flex-align-items-start flex on-mobile-w100 pt-0.5">
                <Tooltip title={tooltip}>
                    <Button
                        onClick={onLoadImages}
                        size="small"
                        color="weak"
                        shape="outline"
                        fullWidth
                        className="rounded-sm"
                        data-testid="remote-content:load"
                    >
                        {actionText}
                    </Button>
                </Tooltip>
            </span>
        </div>
    );
};

export default ExtraImages;
