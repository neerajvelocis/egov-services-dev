import React, { Component } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import get from "lodash/get";
import {
    prepareFinalObject,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";


class CustomTimeSlots extends Component {
    constructor() {
        super();
        //     this.state = {
        //         reservedTimeSlotsDate: '',
        //     }
        //     //console.log(this.props, "Hello Construct");
        //     let timeSlotArray = [];
        //     let bookedSlotArray = [];
        //     var date = new Date();
        //     var date1 = new Date();
        //     for (let i = 0; i < 10; i++) {
        //         let month = ('0' + (date1.getMonth() + 1)).slice(-2);
        //         let day = ('0' + date1.getDate()).slice(-2);
        //         let year = date1.getFullYear();
        //         bookedSlotArray.push(
        //             {
        //                 date: `${day}-${month}-${year}`,
        //                 timeSlots: ["2PM-6PM", "6PM-10PM"]
        //             }
        //         );
        //         date1.setDate(date1.getDate() + 1);
        //     }

        //    // console.log(bookedSlotArray, "booked TimeSlots");
        //     for (let i = 0; i < 180; i++) {
        //         let month = ('0' + (date.getMonth() + 1)).slice(-2);
        //         let day = ('0' + date.getDate()).slice(-2);
        //         let year = date.getFullYear();
        //         timeSlotArray.push(
        //             {
        //                 date: `${day}-${month}-${year}`,
        //                 timeSlots: ["10AM-2PM", "2PM-6PM", "6PM-10PM"]
        //             }
        //         );
        //         date.setDate(date.getDate() + 1);
        //     }

        //     let finalBookedTimeSlots = [];
        //     for (let j = 0; j < timeSlotArray.length; j++) {
        //         let tempObj = {}
        //         tempObj.date = timeSlotArray[j].date;
        //         tempObj.timeSlots = timeSlotArray[j].timeSlots;
        //         for (let k = 0; k < bookedSlotArray.length; k++) {
        //             if (timeSlotArray[j].date === bookedSlotArray[k].date) {

        //                 for (let l = 0; l < timeSlotArray[j].timeSlots.length; l++) {
        //                     if ((bookedSlotArray[k].timeSlots).includes(timeSlotArray[j].timeSlots[l])) {
        //                         timeSlotArray[j].timeSlots.splice(l, 1, `${timeSlotArray[j].timeSlots[l]}:booked`);
        //                     }
        //                 }

        //             }
        //         }

        //         finalBookedTimeSlots.push(tempObj);
        //     }

        //     //console.log(finalBookedTimeSlots, "slot jkArray");

        //     this.state = {
        //         rows: finalBookedTimeSlots,
        //         currentDate: new Date()
        //     }
    }


    selectTimeSlot = (e) => {
        //alert(e.target.getAttribute('data-date')+'---'+e.target.getAttribute('data-timeslot'));
        var cbarray = document.getElementsByName("time-slot");

        for (var i = 0; i < cbarray.length; i++) {

            cbarray[i].checked = false;
        }

        document.getElementById(e.target.getAttribute('data-date') + ':' + e.target.getAttribute('data-timeslot')).checked = true;
        console.log(e.target.getAttribute('data-date') + '---' + e.target.getAttribute('data-timeslot'));
        var [from, to] = e.target.getAttribute('data-timeslot').split('-')
        var [apiDay, apiMonth, apiYear] = e.target.getAttribute('data-date').split("-");
        let apiDate = `${apiYear}-${apiMonth}-${apiDay}`;
        this.props.prepareFinalObject("Booking.bkToDate", apiDate);
        this.props.prepareFinalObject("Booking.bkFromDate", apiDate);
        this.props.prepareFinalObject("Booking.bkFromTime", from);
        this.props.prepareFinalObject("Booking.bkToTime", to);


        this.props.prepareFinalObject("availabilityCheckData.bkToDate", apiDate);
        this.props.prepareFinalObject("availabilityCheckData.bkFromDate", apiDate);
        this.props.prepareFinalObject("availabilityCheckData.bkFromTime", from);
        this.props.prepareFinalObject("availabilityCheckData.bkToTime", to);
        var selectedTimeSlots = [];
        //this.setState({ selectedTimeSlots: { slot: `${from}-${to}` } },
        selectedTimeSlots.push({ slot: `${from}-${to}` })
        this.props.prepareFinalObject("Booking.timeslots", selectedTimeSlots);
        this.props.prepareFinalObject("availabilityCheckData.timeslots", selectedTimeSlots)
        this.props.prepareFinalObject("DisplayPacc.bkDisplayFromDateTime", e.target.getAttribute('data-date') + ", " + from);
        this.props.prepareFinalObject("DisplayPacc.bkDisplayToDateTime", e.target.getAttribute('data-date') + ", " + to);
        //)

    }
    render() {

        const classes = withStyles();
        let { rows, currentDate } = this.props;


        const arrowStyles = {
            position: 'absolute',
            zIndex: 2,
            top: '16px',
            width: 30,
            height: 30,
            cursor: 'pointer',
        };



        return (
            <Carousel
                renderArrowPrev={(onClickHandler, hasPrev, label) =>
                    hasPrev && (
                        <button type="button" onClick={onClickHandler} title={label} style={{ ...arrowStyles, left: 15 }}>
                            {"<"}
                        </button>
                    )
                }
                renderArrowNext={(onClickHandler, hasNext, label) =>
                    hasNext && (
                        <button type="button" onClick={onClickHandler} title={label} style={{ ...arrowStyles, right: 15 }}>
                            {">"}
                        </button>
                    )
                }
            >

                {rows && rows.map((item) => {
                    return <div>
                        <Paper className={classes.root}>
                            <Table className={classes.table}>
                                <TableHead className={`timeslot-table-head ${classes.head}`}>

                                    <TableRow >

                                        <TableCell className={"header-date"} colSpan={3} align={"center"}>
                                            {item.date}
                                        </TableCell>

                                    </TableRow>

                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        {item.timeSlots.map((item1, id) => {
                                            let availabilityClass = '';
                                            let timeSlotExpired = ''
                                            if (item1.indexOf(":booked") !== -1) {
                                                item1 = item1.split(":")[0];
                                                availabilityClass = "booked-time-slot"
                                            } else {
                                                availabilityClass = "available-time-slot"
                                            }

                                            //let currentDate = this.state.currentDate;
                                            let currentTime = parseFloat(`${currentDate.getHours()}.${currentDate.getMinutes()}`);

                                            let currentMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
                                            let currentDay = ('0' + currentDate.getDate()).slice(-2);
                                            let currentYear = currentDate.getFullYear();
                                            let compareDate = `${currentDay}-${currentMonth}-${currentYear}`

                                            let slot = '';
                                            if (item.date === compareDate) {
                                                if (item1.includes("AM")) {
                                                    slot = item1.substring(0, 2);


                                                } else {

                                                    let singleTimeDigit = item1.substring(0, 1);

                                                    if (singleTimeDigit === '2') {
                                                        slot = 14;
                                                    } else if (singleTimeDigit === '6') {
                                                        slot = 18;
                                                    }
                                                }
                                                if (currentTime > parseFloat(slot)) {
                                                    timeSlotExpired = "expired-time-slot"
                                                }
                                            }
                                            //item1 = item1.split(":")[0];


                                            if (timeSlotExpired === "expired-time-slot") {
                                                return (
                                                    <TableCell className={`date-timeslot ${timeSlotExpired}`} data-date={item.date} data-timeslot={item1} align={"center"}>
                                                        {item1}
                                                    </TableCell>
                                                )
                                            } else if (availabilityClass === "booked-time-slot") {
                                                return (
                                                    <TableCell className={`date-timeslot ${timeSlotExpired} ${availabilityClass}`} data-date={item.date} data-timeslot={item1} align={"center"} >
                                                        {item1}
                                                    </TableCell>
                                                )
                                            } else {
                                                return (
                                                    <TableCell className={`date-timeslot ${timeSlotExpired} ${availabilityClass}`} data-date={item.date} data-timeslot={item1} align={"center"} onClick={this.selectTimeSlot}>
                                                        {item1}
                                                        <input className="book-timeslot" name="time-slot" type="checkbox" id={item.date + ':' + item1} data-date={item.date} data-timeslot={item1} onClick={this.selectTimeSlot} />
                                                    </TableCell>
                                                )
                                            }



                                        })}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Paper>
                    </div>
                })
                }

                <style>{

                    `
                    .header-date{font-weight: bold;font-size:18px;}
                    .date-timeslot{border-right: 1px solid white;color:white;font-weight:bold;text-align:center;}
                    p.carousel-status, .control-dots{display:none;}
                    .available-time-slot{background-color:green;}
                    .booked-time-slot{background-color:red}
                    .available-time-slot:hover {opacity: 0.5;}
                    .date-timeslot.expired-time-slot{background-color: gray;}
                    .book-timeslot{position: absolute;top: 65px;width: 21px;height: 21px;margin-left:9px !important;}
                    thead.timeslot-table-head{border: 1px solid gray;}
                    thead.timeslot-table-head tr th{text-align: center;}
                    .carousel.carousel-slider ul li.slide{border: none !important;}
                    `
                }

                </style>
            </Carousel >

        );
    }
}
const mapDispatchToProps = (dispatch) => {

    return {
        prepareFinalObject: (jsonPath, value) =>
            dispatch(prepareFinalObject(jsonPath, value)),
    };

}

const mapStateToProps = (state) => {

    const reservedTimeSlotsData = get(
        state,
        "screenConfiguration.preparedFinalObject.availabilityCheckData.reservedTimeSlotsData"
    );
    let timeSlotArray = [];
    let bookedSlotArray = [];
    var date = new Date();
    if (reservedTimeSlotsData && reservedTimeSlotsData.length > 0) {
        for (let i = 0; i < reservedTimeSlotsData.length; i++) {

            const [year, month, day] = reservedTimeSlotsData[i].fromDate.split("-");
            let date = `${day}-${month}-${year}`
            if (reservedTimeSlotsData[i].timeslots && reservedTimeSlotsData[i].timeslots.length > 0) {
                for (let j = 0; j < reservedTimeSlotsData[i].timeslots.length; j++) {
                    bookedSlotArray.push(
                        {
                            date: date,
                            timeSlots: [reservedTimeSlotsData[i].timeslots[j].slot]
                        }
                    );
                }
            }


        }
    }


    for (let i = 0; i < 180; i++) {
        let month = ('0' + (date.getMonth() + 1)).slice(-2);
        let day = ('0' + date.getDate()).slice(-2);
        let year = date.getFullYear();
        timeSlotArray.push(
            {
                date: `${day}-${month}-${year}`,
                timeSlots: ["10AM-2PM", "2PM-6PM", "6PM-10PM"]
            }
        );
        date.setDate(date.getDate() + 1);
    }

    let finalBookedTimeSlots = [];
    for (let j = 0; j < timeSlotArray.length; j++) {
        let tempObj = {}
        tempObj.date = timeSlotArray[j].date;
        tempObj.timeSlots = timeSlotArray[j].timeSlots;
        if (bookedSlotArray && bookedSlotArray.length > 0) {
            for (let k = 0; k < bookedSlotArray.length; k++) {
                if (timeSlotArray[j].date === bookedSlotArray[k].date) {

                    for (let l = 0; l < timeSlotArray[j].timeSlots.length; l++) {
                        if ((bookedSlotArray[k].timeSlots).includes(timeSlotArray[j].timeSlots[l])) {
                            timeSlotArray[j].timeSlots.splice(l, 1, `${timeSlotArray[j].timeSlots[l]}:booked`);
                        }
                    }

                }
            }
        }
        finalBookedTimeSlots.push(tempObj);
    }

    return {
        rows: finalBookedTimeSlots,
        currentDate: new Date()
    }

}


export default connect(mapStateToProps, mapDispatchToProps)(CustomTimeSlots);

