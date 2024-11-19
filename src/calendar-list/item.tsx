import XDate from 'xdate';
import React, { useRef, useMemo, useCallback } from 'react';
import { Text } from 'react-native';
import { toMarkingFormat } from '../interface';
import Calendar from '../calendar'; // Make sure to import your modified Calendar component

const CalendarListItem = React.memo((props) => {  
  const {
    item,
    markedDates,
    calendarWidth,
    calendarHeight,
    horizontal,
    scrollToMonth,
    style: propsStyle,
    headerStyle,
    onPressArrowLeft,
    onPressArrowRight,
    visible,
    testID,
  } = props;

  const dateString = toMarkingFormat(item);

  // Filter markedDates to include only dates within the current month
  const monthMarkedDates = useMemo(() => {
    if (!markedDates) return {};
    
    const dates = {};
    const monthStart = item.clone().setDate(1).clearTime();
    const monthEnd = monthStart.clone().addMonths(1).addDays(-1);

    Object.keys(markedDates).forEach((date) => {
      const dateObj = new XDate(date);
      if (dateObj >= monthStart && dateObj <= monthEnd) {
        dates[date] = markedDates[date];
      }
    });

    return dates;
  }, [markedDates, item]);

  const calendarStyle = useMemo(() => {
    return [
      {
        width: calendarWidth,
        minHeight: calendarHeight
      }, 
      propsStyle
    ];
  }, [calendarWidth, calendarHeight, propsStyle]);

  const _onPressArrowLeft = useCallback((method, month) => {
    const monthClone = month?.clone();
    if (monthClone) {
      if (onPressArrowLeft) {
        onPressArrowLeft(method, monthClone);
      } else if (scrollToMonth) {
        const currentMonth = monthClone.getMonth();
        monthClone.addMonths(-1);
        // Ensure we get the previous month
        while (monthClone.getMonth() === currentMonth) {
          monthClone.setDate(monthClone.getDate() - 1);
        }
        scrollToMonth(monthClone);
      }
    }
  }, [onPressArrowLeft, scrollToMonth]);

  const _onPressArrowRight = useCallback((method, month) => {
    const monthClone = month?.clone();
    if (monthClone) {
      if (onPressArrowRight) {
        onPressArrowRight(method, monthClone);
      } else if (scrollToMonth) {
        monthClone.addMonths(1);
        scrollToMonth(monthClone);
      }
    }
  }, [onPressArrowRight, scrollToMonth]);

  if (!visible) {
    return (
      <Text style={calendarStyle}>{dateString}</Text>
    );
  }

  return (
    <Calendar
      {...props}
      current={dateString}
      style={calendarStyle}
      headerStyle={horizontal ? headerStyle : undefined}
      hideArrows={true}
      hideExtraDays={true}
      disableMonthChange
      markedDates={monthMarkedDates} // Pass the filtered markedDates
      onPressArrowLeft={horizontal ? _onPressArrowLeft : onPressArrowLeft}
      onPressArrowRight={horizontal ? _onPressArrowRight : onPressArrowRight}
      testID={testID}
    />
  );
});

export default CalendarListItem;
