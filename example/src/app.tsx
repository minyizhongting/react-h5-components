import React from 'react'
import { render } from 'react-dom'
import Calendar from '../../src/calendar';
import Carousel from '../../src/carousel';

// 日历数据
const calendarData = [
  { year: 2021, month: [4, 5, 7, 12] },
  { year: 2022, month: [1, 8, 9] },
  { year: 2023, month: [2, 9, 11] },
];

// 轮播图数据
const carouselData = [
  { imgUrl: 'https://react-responsive-carousel.js.org/assets/1.jpeg', id: 1 },
  { imgUrl: 'https://react-responsive-carousel.js.org/assets/2.jpeg', id: 2 },
  { imgUrl: 'https://react-responsive-carousel.js.org/assets/3.jpeg', id: 3 },
  { imgUrl: 'https://react-responsive-carousel.js.org/assets/4.jpeg', id: 4 },
  { imgUrl: 'https://react-responsive-carousel.js.org/assets/5.jpeg', id: 5 },
]

type IState = {
  dateValue: string;
};

class App extends React.Component<any, IState> {
 
  constructor(props: any) {
    super(props);
    this.state = {
      dateValue: '2023-09',
    }
  }

  change = (value: string) => {
    this.setState({ dateValue: value });
  }

  open = () => {
    console.log('open calendar');
  }

  render() {
    const { dateValue } = this.state;
    return (
      <>
        <h6>日历组件</h6>
        <Calendar
          value={dateValue}
          data={calendarData}
          onChange={this.change}
          onCallback={this.open}
        />
        <h6>轮播图组件</h6>
        <Carousel 
          data={carouselData}
        />
      </>
    );
  }
}

render(<App />, document.getElementById('root'))
