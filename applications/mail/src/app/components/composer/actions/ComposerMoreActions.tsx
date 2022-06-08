import { classnames, Icon } from '@proton/components';
import DropdownMenuButton from '@proton/components/components/dropdown/DropdownMenuButton';
import { c } from 'ttag';
import { useMemo } from 'react';
import ComposerMoreOptionsDropdown from './ComposerMoreOptionsDropdown';
import { MessageState } from '../../../logic/messages/messagesTypes';
import { MessageChange, MessageChangeFlag } from '../Composer';
import MoreActionsExtension from './MoreActionsExtension';

interface Props {
    isExpiration: boolean;
    message: MessageState;
    onExpiration: () => void;
    lock: boolean;
    onChangeFlag: MessageChangeFlag;
    onChange: MessageChange;
}

const ComposerMoreActions = ({ isExpiration, message, onExpiration, lock, onChangeFlag, onChange }: Props) => {
    const titleMoreOptions = c('Title').t`More options`;

    const toolbarExtension = useMemo(
        () => <MoreActionsExtension message={message.data} onChangeFlag={onChangeFlag} />,
        [message.data, onChangeFlag]
    );

    const handleRemoveExpiration = () => {
        onChange({ draftFlags: { expiresIn: undefined } });
    };

    return (
        <ComposerMoreOptionsDropdown
            title={titleMoreOptions}
            titleTooltip={titleMoreOptions}
            className="button button-for-icon composer-more-dropdown"
            content={
                <Icon
                    name="three-dots-horizontal"
                    alt={titleMoreOptions}
                    className={classnames([isExpiration && 'color-primary'])}
                />
            }
        >
            {toolbarExtension}
            <div className="dropdown-item-hr" key="hr-more-options" />
            <DropdownMenuButton
                className="text-left flex flex-nowrap flex-align-items-center"
                onClick={onExpiration}
                aria-pressed={isExpiration}
                disabled={lock}
                data-testid="composer:expiration-button"
            >
                <Icon name="hourglass" />
                <span className="ml0-5 mtauto mbauto flex-item-fluid">
                    {isExpiration ? c('Action').t`Set expiration time` : c('Action').t`Expiration time`}
                </span>
            </DropdownMenuButton>

            {isExpiration && (
                <DropdownMenuButton
                    className="text-left flex flex-nowrap flex-align-items-center color-danger"
                    onClick={handleRemoveExpiration}
                    aria-pressed={isExpiration}
                    disabled={lock}
                    data-testid="composer:remove-expiration-button"
                >
                    <Icon name="trash" />
                    <span className="ml0-5 mtauto mbauto flex-item-fluid">{c('Action').t`Remove expiration time`}</span>
                </DropdownMenuButton>
            )}
        </ComposerMoreOptionsDropdown>
    );
};

export default ComposerMoreActions;