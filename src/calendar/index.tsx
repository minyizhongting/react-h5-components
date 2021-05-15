import React from 'react';
import styles from './index.module.scss';
import get from 'lodash/get';

import { rem } from './utils';

type ActiveItem = {
  year: number;
  month: number[];
}

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

class DatePicker extends React.Component<DatePickerProps, DatePickerState> {
  yearList: string[] = [];
  currentTouchType = 'year'; // 当前滑动模块 year or month
  itemHeight = 64; // 每一个数的高度
  constructor(props: DatePickerProps) {
    super(props);
    const { value = '' } = props;
    const currYear = new Date().getFullYear();
    this.yearList = new Array(currYear - 2020).fill(1).map((_, index) => `${2021 + index}`); // 默认从2021年开始
    let monthList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    if (props.data && props.data.length) {
      this.yearList = props.data.map(item => item.year.toString()).sort();
      const [ currentYear, _currentMonth] = value.split('-');
      const curMonths = props.data.find(item => +item.year === +currentYear)?.month || [];
      if (curMonths.length) {
        monthList = curMonths.map(i => i.toString().padStart(2, '0')).sort();
      }
    }

    this.state = {
      showPicker: false,
      monthList,
      currentStartY: 0, // 起始移动位置
      currentMoveY: 0, // 每次touchmove的实时位移差值
      finalMonthMove: 0, // 累计month的位移 范围限制: [-(monthList.length-1)*64, 0]
      finalYearMove: 0, // 累计year的位移 范围限制: [-(yearList.length-1)*64, 0]
    };
  
  }

  toggleShowStatus = () => {
    const { showPicker } = this.state;
    if (!showPicker) { // 打开日历回调
      typeof this.props.onCallback === 'function' && this.props.onCallback();
    }
    this.setState({
      showPicker: !showPicker,
    }, () => { // 解决ios页面滑动
      document.body.style.height = this.state.showPicker ? '100%' : 'auto';
      document.body.style.position = this.state.showPicker ? 'fixed' : 'relative';
      document.body.style.overflow = this.state.showPicker ? 'hidden' : 'visible';
    });
  }

  componentDidMount() {
    const { value = '' } = this.props;
    const { monthList } = this.state;
    try {
      const [ currentYear, currentMonth] = value.split('-');
      if (currentYear && currentMonth) {
        const yearMove = Math.min(this.yearList.indexOf(currentYear) * this.itemHeight * -1, 0);
        const monthMove = Math.min(monthList.indexOf(currentMonth) * this.itemHeight * -1, 0);
        // 只能是负数 找不到用0兜底
        this.setState({
          finalYearMove: yearMove,
          finalMonthMove: monthMove,
        });
      }
    } catch (error) {
    }
    if (monthList.length) {
      this.setState({ monthList });
    }
  }

  createScrollBox = ({ list, type }: any) => {
    const { currentMoveY, finalMonthMove, finalYearMove, monthList } = this.state;
    let currentFinalMove = 0;
    if (type === 'year') {
      currentFinalMove = finalYearMove;
    } else {
      currentFinalMove = finalMonthMove;
    }
    const position = type === this.currentTouchType && currentMoveY ?
      currentFinalMove + currentMoveY : currentFinalMove;
    const year1 = Math.abs(finalYearMove) / this.itemHeight;
    const month1 = Math.abs(finalMonthMove) / this.itemHeight;
    const yearVal = this.yearList[year1];
    const monthVal = monthList[month1];
    const curr = type === 'year' ? yearVal : monthVal;

    return (
      <div className={styles.outerBox}>
        <div className={styles.line1}></div>
        <div className={styles.line2}></div>
        <div
          className={styles.scroll}
          style={{
            height: rem(this.itemHeight * list.length + 37 * 2),
            transform: `translateY(${rem(position)}`,
          }}
          onTouchStart={(e) => { this.handleTouchStart(e, type);}}
          onTouchMove={(e) => { this.handleTouchMove(e);}}
          onTouchEnd={() => { this.handleTouchEnd(); }}
        >
          {
            list.map((v: any, index: number) => {
              return (
                <div className={v === curr ? `${styles.item} ${styles.curr}`: styles.item} key={index}>{v}</div>
              );
            })
          }
        </div>
      </div>
    );
  }

  handleTouchStart = (e: React.TouchEvent, type: string) => {
    const y = get(e, 'touches.0.pageY');
    this.currentTouchType = type;
    this.setState({
      currentStartY: y,
    });
  }

  handleTouchMove = (e: any) => {
    // finalMonthMove + currentMoveY 必须在[-(monthList.length-1)*64, 0]范围内
    // finalYearMove + currentMoveY 必须在[-(yearList.length-1)*64, 0]范围内
    const { currentStartY, finalMonthMove, finalYearMove } = this.state;
    const list = this.currentTouchType === 'year' ? this.yearList : this.state.monthList;
    const currentFinalMove = this.currentTouchType === 'year' ? finalYearMove : finalMonthMove;
    const lBoundary = (list.length - 1) * this.itemHeight * -1;
    const rBoundary = 0;
    const y = get(e, 'touches.0.pageY');
    let move = y - currentStartY; // 当前位移
    // 边界case
    if (currentFinalMove + move < lBoundary) {
      move = lBoundary - currentFinalMove;
    }
    if (currentFinalMove + move > rBoundary) {
      move = rBoundary - currentFinalMove;
    }
    this.setState({
      currentMoveY: move, // 当前位移
    });
  }

  handleTouchEnd = () => {
    const { currentMoveY, finalMonthMove, finalYearMove } = this.state;
    const finalValue = currentMoveY + (this.currentTouchType === 'year' ? finalYearMove : finalMonthMove);
    const h = this.itemHeight;
    const key = this.currentTouchType === 'year' ? 'finalYearMove' : 'finalMonthMove';
    let move = Math.ceil(Math.abs(finalValue) / h) * h * -1;
    if (Math.abs(finalValue % h) < 0.5 * h) {
      move = Math.floor(Math.abs(finalValue) / h) * h * -1;
    }
    this.setState({
      [key]: move,
      currentStartY: 0,
      currentMoveY: 0,
    } as unknown as DatePickerState, () => {
      if (this.currentTouchType === 'year' && finalYearMove !== move && this.props.data && this.props.data.length) {
      // 更新年份 月份数据同时更新
        this.updateMonthList();
      }
    });
  }

  updateMonthList = () => {
    const { data = [] } = this.props;
    const { finalYearMove } = this.state;
    let year: string | number = Math.abs(finalYearMove) / this.itemHeight;
    year = this.yearList[year].toString();
    const months = data.find(item => +item.year === +year)?.month || [];
    const monthList = months.map(i => i.toString().padStart(2, '0')).sort();
    this.setState({
      monthList,
      finalMonthMove: 0,
    });
  }

  confirm = () => {
    const { finalMonthMove, finalYearMove, monthList } = this.state;
    const year = Math.abs(finalYearMove) / this.itemHeight;
    const month = Math.abs(finalMonthMove) / this.itemHeight;
    const value = `${this.yearList[year]}-${monthList[month]}`;
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      console.log('value: ', value);
      onChange(value);
    }
    this.toggleShowStatus();
  }

  render() {
    const { value } = this.props;
    const { showPicker, monthList } = this.state;
    return (
      <div className={styles.datePicker}>
        {
          showPicker ? <div className={styles.mask} onClick={this.toggleShowStatus}></div> : null
        }
        <div className={styles.currentValue} onClick={this.toggleShowStatus}>
          <div className={styles.value}>{value}</div>
          <i className={styles.icon}></i>
        </div>
        {
          showPicker && (
            <div className={styles.picker}>
              <div className={styles.pickerTitle}>
                <div className={styles.item}>Year</div>
                <div className={styles.item}>Month</div>
              </div>

              <div className={styles.scrollContainer}>
                {
                  [
                    { list: this.yearList, type: 'year' },
                    { list: monthList, type: 'month' },
                  ].map(list => {
                    return this.createScrollBox(list);
                  })
                }
              </div>

              <div className={styles.confirmBtnBox}>
                <div className={styles.confirmBtn} onClick={this.confirm}>Confirm</div>
              </div>
            </div>
          )
        }
      </div>
    );
  }
};

export default DatePicker;

