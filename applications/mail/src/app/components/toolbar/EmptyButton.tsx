import React from 'react';
import { Icon, useLoading, useLabels } from 'react-components';
import { MAILBOX_LABEL_IDS } from 'proton-shared/lib/constants';
import { c } from 'ttag';

import ToolbarButton from './ToolbarButton';
import ToolbarSeparator from './ToolbarSeparator';
import { Breakpoints } from '../../models/utils';
import { labelIncludes, isCustomLabel } from '../../helpers/labels';
import { Element } from '../../models/element';
import { useEmptyLabel } from '../../hooks/useEmptyLabel';

const { DRAFTS, ALL_DRAFTS, ALL_MAIL, INBOX, SENT, ALL_SENT, ARCHIVE, STARRED } = MAILBOX_LABEL_IDS;

interface Props {
    labelID: string;
    breakpoints: Breakpoints;
    elements: Element[];
}

const EmptyButton = ({ labelID = '', breakpoints, elements }: Props) => {
    const [loading, withLoading] = useLoading();
    const [labels = []] = useLabels();
    const emptyLabel = useEmptyLabel();

    const displayEmpty =
        !breakpoints.isNarrow &&
        !labelIncludes(labelID, INBOX, DRAFTS, ALL_DRAFTS, STARRED, SENT, ALL_SENT, ARCHIVE, ALL_MAIL);

    if (!displayEmpty) {
        return null;
    }

    const handleClick = () => withLoading(emptyLabel(labelID));

    const isLabel = isCustomLabel(labelID, labels);
    const title = isLabel ? c('Action').t`Empty label` : c('Action').t`Empty folder`;

    return (
        <>
            <ToolbarSeparator />
            <ToolbarButton
                disabled={!elements.length}
                loading={loading}
                title={title}
                onClick={handleClick}
                data-test-id="toolbar:emptyfolder"
            >
                <Icon className="toolbar-icon mauto" name="empty-folder" />
            </ToolbarButton>
        </>
    );
};

export default EmptyButton;
