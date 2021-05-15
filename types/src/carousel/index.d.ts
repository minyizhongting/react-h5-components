import React from 'react';
declare type CarouselProp = {
    data: Item[];
};
declare type CarouselState = {
    animate: boolean;
    current: number;
};
declare type Item = {
    imgUrl: string;
    id: number;
};
declare class Carousel extends React.Component<CarouselProp, CarouselState> {
    constructor(props: any);
    increment: () => void;
    decrement: () => void;
    boundaryHandler: () => void;
    changePage: (i: number) => void;
    render(): JSX.Element;
}
export default Carousel;
