import React from 'react';
import Helmet from 'react-helmet';
import DayPicker, { DateUtils } from 'react-day-picker';

import { prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
    dispatchMultipleFieldChangeAction,
    getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";



// import {
//     getBreak, getCommonCard, getCommonContainer, getCommonGrayCard, getCommonTitle,
//     getSelectField, getDateField, getTextField, getPattern, getLabel, getTodaysDateInYMD
// } from "egov-ui-framework/ui-config/screens/specs/utils";
//import { addDays } from 'date-fns';
//import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";
import 'react-day-picker/lib/style.css';
class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.state = {
            filterfromDate: '',
            filtertoDate: '',
            dselectedDays: [],

        }
    }

    componentDidMount() {
        // let reservedDays = ['2020-07-01', '2020-07-04', '2020-07-12'];
        let pushReservedDay = [];
        for (let i = 0; i < this.props.reservedDays.length; i++) {
            pushReservedDay.push(new Date(this.props.reservedDays[i]));
        }
        this.setState({ dselectedDays: pushReservedDay })
    }

    componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps', nextProps.state.screenConfiguration.preparedFinalObject.availabilityCheckSelectedData);
        //   this.setState(nextProps);

        //TODO
        //Call API with SelectedData

        let reservedDays = nextProps.reservedDays;
        let pushReservedDay = [];
        for (let i = 0; i < reservedDays.length; i++) {
            pushReservedDay.push(new Date(reservedDays[i]));
        }
        this.setState({ dselectedDays: pushReservedDay })
    }

    getInitialState() {
        return {
            from: null,
            to: null,
            enteredTo: null, // Keep track of the last day for mouseEnter.
        };
    }

    isSelectingFirstDay(from, to, day) {
        const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
        const isRangeSelected = from && to;
        return !from || isBeforeFirstDay || isRangeSelected;
    }

    handleDayClick = (day, modifiers = {}) => {


        let val = this.props.allowClickData
        if (val === "false") {

            this.handleResetClick();
            this.props.showError2();
            return;
        }

        else {
            console.log(modifiers.disabled, 'Modifiers');
            const { from, to } = this.state;
            if (from && to && day >= from && day <= to) {
                this.handleResetClick();
                return;
            }
            if (this.isSelectingFirstDay(from, to, day)) {


                this.props.prepareFinalObject("Check.fromDate", day)


                this.setState({
                    from: day,
                    to: null,
                    enteredTo: null,
                });
            } else {
                this.setState({
                    to: day,
                    enteredTo: day,
                });
                this.props.prepareFinalObject("Check.toDate", day)
                this.checkRangeValidity()
            }
        }
    }

    handleDayMouseEnter = (day) => {
        const { from, to } = this.state;
        if (!this.isSelectingFirstDay(from, to, day)) {
            this.setState({
                enteredTo: day,
            });
        }
    }

    handleResetClick = () => {


        this.setState(this.getInitialState());
        this.props.prepareFinalObject("Check.toDate", "")
    }

    setFromDateHandle = date => {
        this.setState({ filterfromDate: date })
        // this.props.prepareFinalObject("Booking", this.state)
        // this.props.prepareFinalObject("newBooking", { name: "sumit" })
        // console.log(this.props.Booking, "new state")

    }


    setToDateHandle = date => {
        this.setState({ filtertoDate: date })
        //console.log(this.props.bookingCalendar)
    }

    checkRangeValidity() {

        let Range = {

            from: this.state.from,
            to: this.state.enteredTo
        }

        for (let i = 0; i < this.state.dselectedDays.length; i++) {

            let bookedDate = this.state.dselectedDays[i]

            if (DateUtils.isDayInRange(bookedDate, Range)) {

                this.props.showError()

                this.handleResetClick()
            }
            else {

                //  this.props.showBookButton()
            }
        }

    }











    areaChangeHandle = (e) => {
        let area = e.target.value;
        this.setState({ area: area });
    };


    selectChangeHandle = (e) => {
        const selectedSelectBox = e.target.dataset.name;
        let value = e.target.value;
        if (selectedSelectBox == 'property') {
            this.setState({ prop: value });
        } else {
            this.setState({ area: value });
        }

    };


    SearchBookings = () => {
        console.log(this.state);
        let reservedDays = ['2020-07-01', '2020-07-05', '2020-07-06', '2020-07-11', '2020-07-12', '2020-07-21', '2020-07-23', '2020-07-24', '2020-07-25', '2020-07-26', '2020-08-01', '2020-08-02', '2020-08-05', '2020-08-07', '2020-08-12', '2020-08-25'];
        let pushReservedDay = [];
        for (let i = 0; i < reservedDays.length; i++) {
            pushReservedDay.push(new Date(reservedDays[i]));
        }
        this.setState({ dselectedDays: pushReservedDay })
    }

    render() {
        const { from, to, enteredTo } = this.state;
        const modifiers = { start: from, end: enteredTo };
        const disabledDays = { before: this.state.from };
        const selectedDays = [from, { from, to: enteredTo }];
        console.log(this.state.dselectedDays);
        console.log(this.props, "sankalp")
        return (

            <div className="Outer">
                {/* <div className="filter-section fl">

                    <div className="area-filter-section fl ml-20">
                        <div className="mb-10">
                            <label>Area/Sector</label>
                        </div>
                        <div>
                            <select className="area-select" value={this.state.area} onChange={this.selectChangeHandle} data-name="area">
                                <option value="_none">-Select-</option>
                                <option>Sector 37, Noida</option>
                                <option>Sector 44, Noida</option>
                                <option>Sector 66 Greator Noida</option>
                                <option>Sector 120, Noida</option>
                            </select>
                        </div>
                    </div>

                    <div className="prop-filter-section fl ml-20">
                        <div className="mb-10">
                            <label>Property</label>
                        </div>
                        <div>
                            <select className="prop-select" value={this.state.prop} onChange={this.selectChangeHandle} data-name="property">
                                <option value="_none">-Select-</option>
                                <option>AKG Complex</option>
                                <option>Raiway Quarters</option>
                                <option>Guar City Stadium</option>
                                <option>MIET Compus</option>
                            </select>
                        </div>
                    </div>

                     <div className="fromdate-filter-section fl ml-20">
                        <div className="mb-10">
                            <label>From Date</label>
                        </div>
                        <div>
                            <DatePicker
                                selected={this.state.filterfromDate}
                                onChange={this.setFromDateHandle}
                                className="form-control"
                                dateFormat="dd/MM/yyyy"
                                isClearable={true}
                                placeholderText="DD/MM/YYYY"

                            />
                        </div>
                    </div>

                    <div className="todate-filter-section fl ml-20">
                        <div className="mb-10">
                            <label>To Date</label>
                        </div>
                        <div>
                            <DatePicker
                                selected={this.state.filtertoDate}
                                onChange={this.setToDateHandle}
                                className="form-control"
                                dateFormat="dd/MM/yyyy"
                                isClearable={true}
                                placeholderText="DD/MM/YYYY"

                            />
                        </div>
                    </div> 
                    <div className="actions-section fl ml-20" style={{ marginTop: "27px" }}>
                        <input type="button" value="Search" onClick={this.SearchBookings} />

                    </div>

                </div> */}
                <div className="calendar-section fl" >
                    <DayPicker
                        className="Range"
                        numberOfMonths={1}
                        fromMonth={from}
                        selectedDays={selectedDays}
                        disabledDays={this.state.dselectedDays}
                        modifiers={modifiers}
                        onDayClick={this.handleDayClick}
                        onDayMouseEnter={this.handleDayMouseEnter}

                    />
                </div>

                <div>
                    {!from && !to && 'Please select the first day.'}
                    {from && !to && 'Please select the last day.'}
                    {from &&
                        to &&
                        `Selected from ${from.toLocaleDateString()} to
                ${to.toLocaleDateString()}`}{' '}
                    {from && to && (
                        <button className="link" onClick={this.handleResetClick}>
                            Reset
                        </button>
                    )}
                </div>
                <Helmet>
                    <style>{`
                    .Outer{ align-item :center}
          .Range .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
          background-color: #f0f8ff !important;
          color: #4a90e2;
          }
          .Range .DayPicker-Day {
            border-radius: 0 !important;
          }
  
          .DayPicker-Month{width: 768px; height:521px;margin:auto;}
          .fl{float:left;}
          .filter-section{width:100%;display:block;margin-bottom:20px;margin-top:40px;}
          .calendar-section{width:100%;display:block;}
          .ml-20{margin-left: 20px;}
          .mb-10{margin-bottom: 10px;}
          .mt-10{margin-top: 10px;}
          .DayPicker-Day {
            background-color: #8BD642;
            color: white;
            border: 2px solid white;
          }
          .DayPicker-Day.DayPicker-Day--disabled{background-color: red;}
          .DayPicker-Day.DayPicker-Day--outside{background-color: #E9E9E9;}
  `}</style>
                </Helmet>
            </div>
        );
    }
}
const mapStateToProps = (state) => {

    return ({ allowClickData: state.screenConfiguration.preparedFinalObject.bookingCalendar.allowClick })
};

const mapDispatchToProps = (dispatch) => {

    const actionDefination = [
        {
            path: "components.bookButton",
            property: "visible",
            value: true
        },

    ];

    return {
        prepareFinalObject: (jsonPath, value) =>
            dispatch(prepareFinalObject(jsonPath, value)),
        changeRoute: (path) => dispatch(setRoute(path)),
        showError: () => dispatch(toggleSnackbar(true, { labelName: "Selected Range Should Not Contain Red Blocks", labelKey: "" },
            "warning")),
        showError2: () => dispatch(toggleSnackbar(true, { labelName: "First Check Availability By Filling Above Form", labelKey: "" },
            "warning")),
        //showBookButton: () => dispatchMultipleFieldChangeAction("checkavailability", actionDefination, dispatch)

    };
};

export default
    connect(mapStateToProps, mapDispatchToProps)(Example)

