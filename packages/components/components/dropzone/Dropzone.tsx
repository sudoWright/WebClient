import { ComponentPropsWithoutRef, DragEvent as ReactDragEvent, ReactNode } from 'react';

import { c } from 'ttag';

import { isDragFile } from '@proton/components/components';
import { useDragOver } from '@proton/components/hooks';
import dragAndDrop from '@proton/styles/assets/img/illustrations/drag-and-drop-img.svg';
import clsx from '@proton/utils/clsx';

import './Dropzone.scss';

export type DropzoneSize = 'small' | 'medium' | 'large';
export type DropzoneShape = 'norm' | 'transparent' | 'flashy' | 'invisible';

interface DropzoneProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onDrop'> {
    /**
     * Action to trigger when dropping files on top of the dropzone
     */
    onDrop: (files: File[]) => void;
    /**
     * Content to display when no hover
     */
    children: JSX.Element;
    /**
     * Custom content to show when dragging over the Dropzone
     */
    customContent?: ReactNode;
    /**
     * Dropzone's size : small | medium | large
     */
    size?: DropzoneSize;
    /**
     * Dropzone has a border
     */
    border?: boolean;
    /**
     * Dropzone's border is rounded
     */
    rounded?: boolean;
    /**
     * Dropzone's shade : norm | transparent | flashy | invisible
     */
    shape?: DropzoneShape;
    /**
     * Dropzone is always on dragOver state, content is always displayed
     */
    showDragOverState?: boolean;
    /**
     * Dropzone has no dragOver state, children is always displayed
     */
    disabled?: boolean;
}

const Dropzone = ({
    className,
    children,
    customContent,
    onDrop,
    disabled = false,
    showDragOverState = false,
    size = 'medium',
    rounded = true,
    border = true,
    shape = 'norm',
    ...rest
}: DropzoneProps) => {
    const handleDrop = (event: ReactDragEvent) => {
        onDrop([...event.dataTransfer.files]);
    };

    const [hovering, dragProps] = useDragOver(isDragFile, 'move', { onDrop: handleDrop });

    const isSmallDropView = size === 'small';
    const isLargeDropView = size === 'large';

    const isTransparentShape = shape === 'transparent';
    const isFlashyShape = shape === 'flashy';
    const isInvisible = shape === 'invisible';

    // We need to display the dropzone content when:
    // - We are on dragOver state
    // - We force to always display the dragOver state
    // BUT, we don't want to show it when:
    // - Dropzone is completely disabled
    // - The dropzone is invisible (we always show the children)
    const shouldDisplayDropzoneContent = (hovering || showDragOverState) && !disabled && !isInvisible;

    const dropzoneContent = shouldDisplayDropzoneContent && (
        <div
            className={clsx(
                'dropzone-content dropzone-content--hovered h100 w100 absolute-cover flex flex-justify-center flex-align-items-center',
                rounded && 'rounded-xl',
                border && 'dropzone--bordered',
                isTransparentShape && 'dropzone-content--transparent',
                isFlashyShape && 'dropzone-content--flashy',
                className
            )}
        >
            {customContent ? (
                customContent
            ) : (
                <div className="text-center">
                    {!isSmallDropView && <img src={dragAndDrop} alt="" aria-hidden="true" className="mb1" />}
                    {isLargeDropView ? (
                        <p className={'mb0 mt1-5"'}>
                            <span className="text-xl text-bold">{c('Info').t`Drop to import`}</span>
                            <br />
                            <span className={clsx(!isFlashyShape && 'color-weak')}>
                                {c('Info').t`Your files will be encrypted and then saved`}
                            </span>
                        </p>
                    ) : (
                        <p className={clsx('m0', !isFlashyShape && 'color-weak')}>
                            {c('Info').t`Drop file here to upload`}
                        </p>
                    )}
                </div>
            )}
        </div>
    );

    // If invisible, we always show the children, even on dragOver state
    if (isInvisible) {
        return (
            <div className="w100 h100" {...(!disabled ? rest : undefined)} {...dragProps}>
                {children}
            </div>
        );
    }

    const canShowChildren = !!children || disabled;

    return (
        <div
            className={clsx('w100 h100 relative', !children && 'absolute-cover')}
            {...(!disabled ? rest : undefined)}
            {...dragProps}
        >
            {canShowChildren && (
                <div className={clsx('dropzone-children flex flex-align-items-center flex-justify-center w100 h100')}>
                    {children}
                </div>
            )}
            {dropzoneContent}
        </div>
    );
};

export default Dropzone;
