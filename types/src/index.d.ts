import React from 'react';
declare type ActiveItem = {
    year: number;
    month: number[];
};
interface DatePickerProps {
    value?: string;
    data?: ActiveItem[];
    onChange?: any;
    onCallback?: Function;
}
interface DatePickerState {
    showPicker: boolean;
    currentStartY: number;
    currentMoveY: number;
    finalMonthMove: number;
    finalYearMove: number;
    monthList: string[];
}
declare class DatePicker extends React.Component<DatePickerProps, DatePickerState> {
    yearList: string[];
    currentTouchType: string;
    itemHeight: number;
    constructor(props: DatePickerProps);
    toggleShowStatus: () => void;
    componentDidMount(): void;
    createScrollBox: ({ list, type }: any) => JSX.Element;
    handleTouchStart: (e: React.TouchEvent, type: string) => void;
    handleTouchMove: (e: any) => void;
    handleTouchEnd: () => void;
    updateMonthList: () => void;
    confirm: () => void;
    render(): JSX.Element;
}
export default DatePicker;
