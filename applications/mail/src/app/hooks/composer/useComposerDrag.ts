import { MouseEventHandler, Reducer, useCallback, useEffect, useReducer, useRef } from 'react';
import { debounce, throttle } from '@proton/shared/lib/helpers/function';
import { COMPOSER_GUTTER, COMPOSER_WIDTH, computeRightPosition } from '../../helpers/composerPositioning';

interface Props {
    windowWidth: number;
    minimized: boolean;
    maximized: boolean;
    isNarrow: boolean;
    totalComposers: number;
    composerIndex: number;
}

interface State {
    isDragging: boolean;
    initialCursorPosition: number | null;
    offset: number;
    lastOffset: number;
}

type Action =
    | { type: 'start'; payload: Pick<State, 'isDragging' | 'initialCursorPosition'> }
    | { type: 'stop'; payload: Pick<State, 'isDragging' | 'initialCursorPosition'> }
    | { type: 'move'; payload: Pick<State, 'offset'> }
    | { type: 'reset-offset'; payload: Pick<State, 'offset'> };

const moveReducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'start':
        case 'move':
        case 'reset-offset':
            return { ...state, ...action.payload };
        case 'stop':
            // Add lastOffset based on reducer state because stop callback is executed
            // in event listener and value is not up to date when passed through the action
            return { ...state, lastOffset: state.offset, ...action.payload };
        default:
            throw new Error('This action does not exist');
    }
};

const useComposerDrag = ({ windowWidth, maximized, minimized, totalComposers, composerIndex }: Props) => {
    const prevMinimized = useRef(minimized);
    const prevMaximized = useRef(maximized);
    const composerRightStyle = computeRightPosition(composerIndex, totalComposers, windowWidth);

    const [{ isDragging, initialCursorPosition, offset, lastOffset }, dispatch] = useReducer<Reducer<State, Action>>(
        moveReducer,
        {
            isDragging: false,
            initialCursorPosition: null,
            offset: 0,
            lastOffset: 0,
        }
    );

    const handleStartDragging: MouseEventHandler<HTMLElement> = (e) => {
        dispatch({ type: 'start', payload: { isDragging: true, initialCursorPosition: e.clientX } });
    };

    const handleStopDragging = () => {
        dispatch({ type: 'stop', payload: { isDragging: false, initialCursorPosition: null } });
    };

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!initialCursorPosition || !isDragging || (maximized && !minimized)) {
                return;
            }

            const composerWidth = COMPOSER_WIDTH;

            const prevOffset = offset;
            const cursorMoveOffset = e.clientX - initialCursorPosition;
            let finalOffset = prevOffset + cursorMoveOffset;

            const composerRightCornerPos = windowWidth + finalOffset - composerRightStyle;
            const composerLeftCornerPos = windowWidth + finalOffset - composerRightStyle - composerWidth;

            if (composerLeftCornerPos < COMPOSER_GUTTER) {
                const remainingWidth = windowWidth - composerRightStyle - composerWidth;
                finalOffset = -remainingWidth + COMPOSER_GUTTER;
            }
            if (composerRightCornerPos > windowWidth - COMPOSER_GUTTER) {
                finalOffset = composerRightStyle - COMPOSER_GUTTER;
            }

            dispatch({ type: 'move', payload: { offset: finalOffset } });
        },
        [isDragging, initialCursorPosition, maximized]
    );

    useEffect(() => {
        const throttledMouseMove = throttle(handleMouseMove, 20);
        const debouncedStopDragging = debounce(handleStopDragging, 50);

        if (isDragging) {
            document.addEventListener('mousemove', throttledMouseMove);
            document.addEventListener('mouseup', debouncedStopDragging);
            document.addEventListener('mouseleave', debouncedStopDragging);
        }

        return () => {
            document.removeEventListener('mousemove', throttledMouseMove);
            document.removeEventListener('mouseup', debouncedStopDragging);
            document.removeEventListener('mouseleave', debouncedStopDragging);
        };
    }, [isDragging]);

    useEffect(() => {
        dispatch({ type: 'reset-offset', payload: { offset: 0 } });
    }, [composerRightStyle, totalComposers]);

    useEffect(() => {
        if (
            minimized === false &&
            maximized === true &&
            prevMaximized.current === true &&
            prevMinimized.current === true
        ) {
            dispatch({ type: 'reset-offset', payload: { offset: 0 } });
        }

        prevMinimized.current = minimized;
    }, [minimized]);

    useEffect(() => {
        if (
            minimized === false &&
            maximized === false &&
            prevMaximized.current === true &&
            prevMinimized.current === true
        ) {
            prevMaximized.current = maximized;
            return;
        }
        dispatch({ type: 'reset-offset', payload: { offset: 0 } });
        prevMaximized.current = maximized;
    }, [maximized]);

    return {
        start: handleStartDragging,
        offset,
        // Add some boundaries in order be sure that we are dragging and not clicking
        isDragging: isDragging === true && (offset > lastOffset + 10 || offset < lastOffset - 10),
    };
};

export default useComposerDrag;
