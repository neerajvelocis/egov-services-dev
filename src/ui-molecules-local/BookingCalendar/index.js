import React from "react";
import Helmet from "react-helmet";
import DayPicker, { DateUtils } from "react-day-picker";
import {
    prepareFinalObject,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
    getFileUrlFromAPI,
    getQueryArg,
    addQueryArg
} from "egov-ui-framework/ui-utils/commons";
import "react-day-picker/lib/style.css";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
class BookingCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.state = {
            filterfromDate: "",
            filtertoDate: "",
            dselectedDays: [],
        };
    }

    getDeselectDays() { }
    componentDidMount() {
        const { availabilityCheckData } = this.props;
        if ("reservedDays" in availabilityCheckData) {
            let pushReservedDay = [];
            availabilityCheckData.reservedDays.length > 0 && availabilityCheckData.reservedDays.map(el => {
                pushReservedDay.push(new Date(el));
            })
            this.setState({
                dselectedDays: pushReservedDay,
                from: new Date(availabilityCheckData.bkFromDate),
                to: new Date(availabilityCheckData.bkToDate),
                enteredTo: new Date(availabilityCheckData.bkToDate)
            })
        }





        // for (let i = 0; i < this.props.reservedDays.length; i++) {
        //     pushReservedDay.push(new Date(this.props.reservedDays[i]));
        // }


        //  if(this.props.reservedDays.length > 0) {

        //     this.setState({
        //         from: new Date(this.props.availabilityCheckData.bkFromDate),
        //         // to: new Date(this.props.availabilityCheckData.bkToDate),
        //         enteredTo: new Date(this.props.availabilityCheckData.bkToDate),
        //     });
        // }
        // if(applicationNumber !== null || applicationNumber !== undefined){
        //     alert("in it")
        //     this.setState({
        //         from: new Date(localStorageGet("fromDateCG")),
        //         // to: new Date(this.props.availabilityCheckData.bkToDate),
        //         enteredTo: new Date(localStorageGet("toDateCG")),
        //     });
        // }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.availabilityCheckData, "myNextprops.availabilityCheckData");
        if (nextProps.availabilityCheckData === undefined || nextProps.availabilityCheckData.length === 0) {
            this.setState({
                dselectedDays: [],
                from: null,
                to: null,
                enteredTo: null,
            })
        } else {
            if ("reservedDays" in nextProps.availabilityCheckData) {
                let pushReservedDay = [];
                nextProps.availabilityCheckData.reservedDays.length > 0 && nextProps.availabilityCheckData.reservedDays.map(el => {
                    pushReservedDay.push(new Date(el));
                })
                let previousDates = this.getPreviousTodayDates()
                previousDates.map(val => {
                    pushReservedDay.push(val)
                })
                this.setState({
                    dselectedDays: pushReservedDay,
                })
            }

            if ("bkApplicationNumber" in nextProps.availabilityCheckData) {
                if (nextProps.availabilityCheckData.bkFromDate !== null && nextProps.availabilityCheckData.bkToDate !== null) {
                    this.setState({
                        from: new Date(nextProps.availabilityCheckData.bkFromDate),
                        to: new Date(nextProps.availabilityCheckData.bkToDate),
                        enteredTo: new Date(nextProps.availabilityCheckData.bkToDate)
                    })
                } else if (nextProps.availabilityCheckData.bkFromDate !== null && nextProps.availabilityCheckData.bkToDate === null) {
                    this.setState({
                        from: new Date(nextProps.availabilityCheckData.bkFromDate),
                        to: null,
                        enteredTo: null
                    })

                } else {

                    this.setState(this.getInitialState());
                }


            }
        }



        // const applicationNumber = getQueryArg(
        //     window.location.href,
        //     "applicationNumber"
        // );
        // console.log(applicationNumber, "applicationNumberNew");
        // let reservedDays = nextProps.reservedDays;
        // let pushReservedDay = [];
        // for (let i = 0; i < reservedDays.length; i++) {
        //     pushReservedDay.push(new Date(reservedDays[i]));
        // }
        // this.setState({ dselectedDays: pushReservedDay });

        // if(this.props.reservedDays.length > 0) {

        //     this.setState({
        //         from: new Date(this.props.availabilityCheckData.bkFromDate),
        //         // to: new Date(this.props.availabilityCheckData.bkToDate),
        //         enteredTo: new Date(this.props.availabilityCheckData.bkToDate),
        //     });
        // }
        // if(applicationNumber !== null || applicationNumber !== undefined){
        //     alert("in it")
        //     this.setState({
        //         from: new Date(localStorageGet("fromDateCG")),
        //         // to: new Date(this.props.availabilityCheckData.bkToDate),
        //         enteredTo: new Date(localStorageGet("toDateCG")),
        //     });
        // }
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
        const { availabilityCheckData } = this.props;
        if ("reservedDays" in availabilityCheckData) {
            const { from, to } = this.state;
            if (from && to && day >= from && day <= to) {
                this.handleResetClick();
                return;
            }
            if (this.isSelectingFirstDay(from, to, day)) {

                if (day >= new Date()) {
                    this.props.prepareFinalObject(
                        "availabilityCheckData.bkFromDate",
                        day
                    );

                    this.setState({
                        from: day,
                        to: null,
                        enteredTo: null,
                    });
                } else {

                    this.handleResetClick()

                }
            } else {
                this.setState({
                    to: day,
                    enteredTo: day,
                });
                this.props.prepareFinalObject(
                    "availabilityCheckData.bkToDate",
                    day
                );
                this.checkRangeValidity();
            }




        } else {
            this.handleResetClick();
            this.props.showError2();
            return;
        }
        // let val = availabilityCheckData
        // if (val === "false" || val === undefined) {
        //     this.handleResetClick();
        //     this.props.showError2();
        //     return;
        // } else {
        //     console.log(modifiers.disabled, "Modifiers");
        //     const { from, to } = this.state;
        //     if (from && to && day >= from && day <= to) {
        //         this.handleResetClick();
        //         return;
        //     }
        //     if (this.isSelectingFirstDay(from, to, day)) {
        //         this.props.prepareFinalObject(
        //             "availabilityCheckData.bkFromDate",
        //             day
        //         );

        //         this.setState({
        //             from: day,
        //             to: null,
        //             enteredTo: null,
        //         });
        //     } else {
        //         this.setState({
        //             to: day,
        //             enteredTo: day,
        //         });
        //         this.props.prepareFinalObject(
        //             "availabilityCheckData.bkToDate",
        //             day
        //         );
        //         this.checkRangeValidity();
        //     }
        // }
    };

    handleDayMouseEnter = (day) => {
        const { from, to } = this.state;
        if (!this.isSelectingFirstDay(from, to, day)) {
            this.setState({
                enteredTo: day,
            });
        }
    };

    handleResetClick = () => {
        this.setState(this.getInitialState());
        this.props.prepareFinalObject("availabilityCheckData.bkToDate", null);
        this.props.prepareFinalObject("availabilityCheckData.bkFromDate", null);

    };

    // setFromDateHandle = (date) => {
    //     this.setState({ filterfromDate: date });
    //     // this.props.prepareFinalObject("Booking", this.state)
    //     // this.props.prepareFinalObject("newBooking", { name: "sumit" })
    //     // console.log(this.props.Booking, "new state")
    // };

    // setToDateHandle = (date) => {
    //     this.setState({ filtertoDate: date });
    // };

    checkRangeValidity() {
        let Range = {
            from: this.state.from,
            to: this.state.enteredTo,
        };

        for (let i = 0; i < this.state.dselectedDays.length; i++) {
            let bookedDate = this.state.dselectedDays[i];

            if (DateUtils.isDayInRange(bookedDate, Range)) {
                this.props.showError();

                this.handleResetClick();
            } else {
                //  this.props.showBookButton()
            }
        }
    }


    getPreviousTodayDates() {
        let date = new Date()
        var d = date.getDate()
        let m = date.getMonth()
        let y = date.getFullYear()
        var defaultDisabledDate = []
        while (d > 1) {
            d = d - 1
            let nd = new Date(y, m, d)

            defaultDisabledDate.push(nd)
        }
        return defaultDisabledDate
    }
    // areaChangeHandle = (e) => {
    //     let area = e.target.value;
    //     this.setState({ area: area });
    // };

    // selectChangeHandle = (e) => {
    //     const selectedSelectBox = e.target.dataset.name;
    //     let value = e.target.value;
    //     if (selectedSelectBox == "property") {
    //         this.setState({ prop: value });
    //     } else {
    //         this.setState({ area: value });
    //     }
    // };

    render() {
        const { from, to, enteredTo } = this.state;
        const modifiers = { start: from, end: enteredTo };
        const disabledDays = { before: this.state.from };
        const selectedDays = [from, { from, to: enteredTo }];
        const WEEK_DAY_LONG=['Sun','Mon', 'Tue' ,'Wed' ,'Thu', 'Fri' ,'Sat' ]
        const DATAE = this.getPreviousTodayDates()
        const past = {

            value: DATAE.map(val => {

                return new Date(val)
            })
        }

        console.log(this.state.dselectedDays);
        let data = new Date();
        //hello
        let newData = new Date(data.setMonth(data.getMonth() + 5));
        // alert(from)
        // let initialMonth = (from !== null && from !== undefined && from !== "" && from !== 0) ? from.getMonth() : new Date().getMonth()
        // alert(initialMonth)
        // let initialYear = (from !== null && from !== undefined && from !== "" && from !== 0) ? from.getFullYear() : data.getFullYear()
        // alert(initialYear)

        return (
            <div className="calender-wrapper" >
                <div className="calendar-section" style={{ width: "100%" }}>
                    <DayPicker
                        className="Range"
                        numberOfMonths={1}
                        initialMonth={new Date()}
                        // disabledDays={this.state.dselectedDays, {
                        //     before: new Date()
                        //   }} 
                        disabledDays={this.state.dselectedDays}
                        fromMonth={new Date()}
                        toMonth={newData}
                        modifiers={modifiers}
                        weekdaysShort={WEEK_DAY_LONG}

                        modifiers={past}
                        // .DayPicker-Day--past

                        selectedDays={selectedDays}
                        onDayClick={this.handleDayClick}
                        onDayMouseEnter={this.handleDayMouseEnter}
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between",marginTop : "10px" }}>
                    <span style={{color: "#fe7a51" , fontWeight: "600"}}>
                        {this.props.dselectedDays!==[] && !from && !to && "Please select the first day."}
                        {from && !to && "Please select the last day."}
                        {from &&
                            to &&
                            `Selected Date from ${from.toLocaleDateString()} to
                ${to.toLocaleDateString()}`}{" "}
                        {from && to && (
                            <button
                                className="link"
                               
                                onClick={this.handleResetClick}
                            >
                                Reset
                            </button>

                        )}</span>
                    {from && !to && <span style={{color: "#fe7a51" , fontWeight: "600"}}>** Please click same day for booking single Date.</span>}
                </div>
                <Helmet>
                    <style>{`
    .DayPicker{
        width : 100%
    }
                    // .Range{width: 100%}
        //   .Range .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
        //   background-color: #fe7a51 !important;
        outline: none;
        //   color: ##fe7a51;
        //   }
        .DayPicker:not(.DayPicker--interactionDisabled) .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover{
            background-color: none;
            background-color : #fe7a51;
        }

        .DayPicker-Day {
            outline: none;
            font-weight: 500;
            color: #000000d4;
            border-radius: 0 ;
          }
          .DayPicker-Caption{
            margin-bottom: 0;
            padding: 0 ;
            display: table-caption;
            text-align: center;
          }
        
        .DayPicker-Weekday {
            background-color: #dcdcdc6e;
            display: table-cell;
            padding: 1.2em;
            color: #fe7a51;
            text-align: center;
            font-size: 1em;
            font-weight: 500;
        }
        

    .DayPicker-Caption > div {

        font-weight: 500;
        height: 80px;
        justify-content: center;
        align-items: center;
        display: flex;
        font-size: 1.75em;
        color: white;
        box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);







      

    background-color: #fe7a51;
}
 
.DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside) {
    position: relative;
 
    background-color: #fe7a51;
 
    color: #F0F8FF;
}
          .DayPicker-Month{width:100%; height:400px;margin:auto;outline: 1px solid #fe7a51;}
          .fl{float:left;}
          .filter-section{width:100%;display:block;margin-bottom:20px;margin-top:40px;}
          .calendar-section{width:100%;display:block;}
          .ml-20{margin-left: 20px;}
          .mb-10{margin-bottom: 10px;}
          .mt-10{margin-top: 10px;}
          .DayPicker-Day {
           
            
            
            border: 2px solid #f0f0f0;
          }
          .DayPicker-wrapper {
            outline: none;}
          .DayPicker-Day.DayPicker-Day--disabled{color: gainsboro;}
          .DayPicker-Day.DayPicker-Day--value{     color: #ccc;
            background-image: none;}
          .DayPicker-Day.DayPicker-Day--outside{ background-image:none;background-color: white;}
          .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside):hover {
            background-color: #fe7a51;
        }
  `}</style>
                </Helmet>
            </div >
        );
    }
}
// const mapStateToProps = (state) => {
//     return {
//         availabilityCheckData:
//             state.screenConfiguration.preparedFinalObject.availabilityCheckData,
//     };
// };

const mapDispatchToProps = (dispatch) => {
    const actionDefination = [
        {
            path: "components.bookButton",
            property: "visible",
            value: true,
        },
    ];

    return {
        prepareFinalObject: (jsonPath, value) =>
            dispatch(prepareFinalObject(jsonPath, value)),
        changeRoute: (path) => dispatch(setRoute(path)),
        showError: () =>
            dispatch(
                toggleSnackbar(
                    true,
                    {
                        labelName:
                            "Selected Range Should Not Contain Reserved Date",
                        labelKey: "",
                    },
                    "warning"
                )
            ),
        showError2: () =>
            dispatch(
                toggleSnackbar(
                    true,
                    {
                        labelName:
                            "First Check Availability By Filling Above Form",
                        labelKey: "",
                    },
                    "warning"
                )
            ),
        showError3: () =>
            dispatch(
                toggleSnackbar(
                    true,
                    {
                        labelName:
                            "Please select date greater then today",
                        labelKey: "",
                    },
                    "warning"
                )
            ),

        //showBookButton: () => dispatchMultipleFieldChangeAction("checkavailability", actionDefination, dispatch)
    };
};

export default connect(null, mapDispatchToProps)(BookingCalendar);