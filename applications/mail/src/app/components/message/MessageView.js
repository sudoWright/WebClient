import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useToggle, Loader, classnames } from 'react-components';

import { useComputeMessage } from './hooks/useComputeMessage';
import { hasAttachments } from './logic/message';

import MessageBody from './MessageBody';
import MessageHeaderCollapsed from './MessageHeaderCollapsed';
import MessageHeaderExpanded from './MessageHeaderExpanded';
import MessageFooter from './MessageFooter';

const MessageView = ({ labels, message: inputMessage, mailSettings }) => {
    const { state: expanded, set: setExpanded } = useToggle();
    const { state: showDetails, toggle: toggleDetails } = useToggle();

    // Not using usePromiseResult as in this case the task has to be called later
    // TODO: use useAsync
    const [loaded, setLoaded] = useState(false);

    const [message, setMessage] = useState({ data: inputMessage });

    const { initialize, loadRemoteImages, loadEmbeddedImages } = useComputeMessage(mailSettings);

    const prepareMessage = async () => {
        setMessage(await initialize(message));
        setLoaded(true);
    };

    const handleLoadRemoteImages = async () => {
        setMessage(await loadRemoteImages(message));
    };

    const handleLoadEmbeddedImages = async () => {
        setMessage(await loadEmbeddedImages(message));
    };

    const handleExpand = () => {
        setExpanded(true);
        prepareMessage();
    };

    return (
        <article className={classnames(['message-container mb2', expanded && 'is-opened'])}>
            {expanded ? (
                <>
                    <MessageHeaderExpanded
                        message={message}
                        messageLoaded={loaded}
                        onLoadRemoteImages={handleLoadRemoteImages}
                        onLoadEmbeddedImages={handleLoadEmbeddedImages}
                        labels={labels}
                        mailSettings={mailSettings}
                        showDetails={showDetails}
                        toggleDetails={toggleDetails}
                    />
                    {loaded ? (
                        <>
                            <MessageBody message={message} />
                            {hasAttachments(message.data) ? <MessageFooter message={message} /> : null}
                        </>
                    ) : (
                        <Loader />
                    )}
                </>
            ) : (
                <MessageHeaderCollapsed message={message} onExpand={handleExpand} />
            )}
        </article>
    );
};

MessageView.propTypes = {
    labels: PropTypes.array,
    mailSettings: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired
};

export default MessageView;
