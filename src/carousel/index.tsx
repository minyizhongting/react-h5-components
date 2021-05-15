import React from 'react';
import styles from './index.module.scss';

type CarouselProp = {
  data: Item[];
}

type CarouselState  = {
  animate: boolean,
  current: number;
}

type Item = {
  imgUrl: string;
  id: number;
}

class Carousel extends React.Component<CarouselProp, CarouselState> {
  constructor(props: any) {
    super(props);
    this.state = {
      animate: true,
      current: 0,
    };
  }

  increment = () => {
    this.changePage(this.state.current + 1);
  }

  decrement = () => {
    this.changePage(this.state.current - 1);
  }

  boundaryHandler = () => {
    if (this.state.animate) {
      return;
    }
    let { current } = this.state;
    if (current === this.props.data.length) {
      current = current - 1;
    } else if (current === -1) {
      current = 0;
    }
    setTimeout(() => {
      this.setState({
        current,
        animate: true,
      });
    }, 0);
  }

  changePage = (i: number) => {
    let current = i;
    let animate = true;
    if (current < 0) {
      current = this.props.data.length;
      animate = false;
    } else if (current > this.props.data.length - 1) {
      current = -1;
      animate = false;
    }
    this.setState({
      current,
      animate,
    }, () => {
      this.boundaryHandler()
    });
  }

  render() {
    const { data } = this.props;
    const { animate, current } = this.state;
    
    const firstClone = [ ...data ].shift();
    const lastClone = [ ...data ].pop();
    return (
      <div className={styles.carouselWrap}>
        <div className={styles.content}>
          <i className={styles.prevArrow} onClick={this.decrement}></i>
          <i className={styles.nextArrow} onClick={this.increment}></i>
          <ul style={{
            transform: `translate(-${100 * (current+1)}%, 0)`,
            transition: animate ? 'all 300ms' : 'none',
          }}>
            {
              lastClone && <li>
                <div>
                  <img src={lastClone.imgUrl} alt=""/>
                  <span>last</span>
                </div>
              </li>
            }
            {
              data.map((item: Item, index: number) => (
                <li key={index}>
                  <div>
                    <img src={item.imgUrl} alt=""/>
                    <span>{index+1}</span>
                  </div>
                </li>
                )
              )
            }
            {
              firstClone && <li>
                <div>
                  <img src={firstClone.imgUrl} alt=""/>
                  <span>first</span>
                </div>
              </li>
            }
          </ul>
          {
            data.length && <div className={styles.pagination}>
              {
                data.map((_item, index) => (
                  <i 
                    key={index} 
                    className={index === current ? styles.current : ''}
                  ></i>
                ))
              }
            </div>
          }
          </div>
      </div>
    )
  }
}

export default Carousel;
