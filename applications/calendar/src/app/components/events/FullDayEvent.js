import React, { useMemo } from 'react';
import { classnames } from 'react-components';
import { c } from 'ttag';

import { useReadCalendarEvent, useReadEvent } from './useReadCalendarEvent';
import { bestColor } from '../../helpers/color';

const FullDayEvent = ({
    style,
    formatTime,
    className = 'calendar-dayeventcell absolute',
    event: { start, data, isAllDay },
    event,
    isSelected,
    isBeforeNow,
    eventRef,
    onClick
}) => {
    const [value, loading, error] = useReadCalendarEvent(data);
    const model = useReadEvent(value);

    const calendarColor = (data && data.Calendar && data.Calendar.Color) || undefined;

    const eventStyle = useMemo(() => {
        if (!isAllDay) {
            return {};
        }
        const background = calendarColor || 'rgba(255,0,255,0.3)';
        return {
            background,
            color: bestColor(background)
        };
    }, [calendarColor, isAllDay, isSelected]);

    const timeString = useMemo(() => {
        return formatTime(start);
    }, [start]);

    const isCreateEvent = event.id === 'tmp' && !event.data;

    const content = (() => {
        if (error) {
            return (
                <div className="ellipsis">
                    {c('Error').t`Error: `}
                    {error && error.message}
                </div>
            );
        }

        return (
            <div className="flex flex-nowrap bg-inherit">
                <span className={classnames(['ellipsis flex-item-fluid', loading && 'calendar-skeleton-loading'])}>
                    {loading ? '' : model.title}
                </span>
                {isCreateEvent || (isAllDay && model.isAllDay) ? null : <span className="">{timeString}</span>}
            </div>
        );
    })();

    const isBeforeNowClassModifier = isBeforeNow ? 'calendar-dayeventcell--isBefore' : '';

    return (
        <div
            style={style}
            className={classnames([className, isBeforeNowClassModifier])}
            data-ignore-create="1"
            onClick={onClick}
        >
            <div className="calendar-dayeventcell-inner pl0-5 pr0-5" style={eventStyle} ref={eventRef}>
                {content}
            </div>
        </div>
    );
};

export default FullDayEvent;
