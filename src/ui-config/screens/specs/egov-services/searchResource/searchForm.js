import {
    getCommonCard,
    getCommonContainer,
    getCommonTitle,
    getTextField,
    getDateField,
    getSelectField,
    getPattern,
    getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import {
    getTodaysDateInYMD,
} from "../../utils/index";
import { fetchData } from "../searchResource/citizenSearchFunctions";
import {
    handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";

export const callBackForReset = (state, dispatch, action) => {
    const preparedFinalObject = get(
        state,
        "screenConfiguration.preparedFinalObject"
    );
    const { MyBooking } = preparedFinalObject;
    console.log(MyBooking, "MyBooking");
    if (MyBooking.applicationNumber) {
        dispatch(
            handleField(
                "my-applications",
                "components.div.children.applicationSearch.children.searchForm.children.cardContent.children.applicationDetailsConatiner.children.applicationNumber",
                "props.value",
                ""
            )
        );
    }
    if (MyBooking.applicationStatus) {
        dispatch(
            handleField(
                "my-applications",
                "components.div.children.applicationSearch.children.searchForm.children.cardContent.children.applicationDetailsConatiner.children.applicationStatus",
                "props.value",
                ""
            )
        );
    }
    if (MyBooking.bookingType) {
        dispatch(
            handleField(
                "my-applications",
                "components.div.children.applicationSearch.children.searchForm.children.cardContent.children.applicationDetailsConatiner.children.bookingType",
                "props.value",
                ""
            )
        );
    }
    if (MyBooking.mobileNumber) {
        dispatch(
            handleField(
                "my-applications",
                "components.div.children.applicationSearch.children.searchForm.children.cardContent.children.applicationDetailsConatiner.children.mobileNumber",
                "props.value",
                ""
            )
        );
    }
    if (MyBooking.fromDate) {
        dispatch(
            handleField(
                "my-applications",
                "components.div.children.applicationSearch.children.searchForm.children.cardContent.children.applicationDetailsConatiner.children.fromDate",
                "props.value",
                ""
            )
        );
    }
    if (MyBooking.toDate) {
        dispatch(
            handleField(
                "my-applications",
                "components.div.children.applicationSearch.children.searchForm.children.cardContent.children.applicationDetailsConatiner.children.toDate",
                "props.value",
                ""
            )
        );
    }
    fetchData(action, state, dispatch);
};
export const callBackForSearch = (state, dispatch, action) => {
    fetchData(action, state, dispatch);
};

export const searchForm = getCommonCard({
    header: getCommonTitle(
        {
            labelName: "Seach Applications",
            labelKey: "MY_BK_SEARCH_HEADER",
        },
        {
            style: {
                marginBottom: 18,
            },
        }
    ),

    applicationDetailsConatiner: getCommonContainer({
        mobileNumber: {
            ...getTextField({
                label: {
                    labelName: "Contact",
                    labelKey: "MY_BK_MOBILE_NO_LABEL",
                },
                placeholder: {
                    labelName: "Contact",
                    labelKey: "MY_BK_MOBILE_NO_PLACEHOLDER",
                },
                // required: true,
                pattern: getPattern("MobileNo"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                jsonPath: "MyBooking.mobileNumber",
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    md: 4,
                },
            }),
        },
        applicationNumber: {
            ...getTextField({
                label: {
                    labelName: "Application No.",
                    labelKey: "MY_BK_APPLICATION_NUMBER_LABEL",
                },
                placeholder: {
                    labelName: "Enter House No",
                    labelKey: "MY_BK_APPLICATION_NUMBER_PLACEHOLDER",
                },
                pattern: getPattern("DoorHouseNo"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                // required: true,
                jsonPath: "MyBooking.applicationNumber",
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    md: 4,
                },
            }),
        },
        bookingType: {
            ...getSelectField({
                label: {
                    labelName: "Application Type",
                    labelKey: "MY_BK_APPLICATION_TYPE_LABEL",
                },
                placeholder: {
                    labelName: "Application Type",
                    labelKey: "MY_BK_APPLICATION_TYPE_PLACEHOLDER",
                },
                // pattern: getPattern("DoorHouseNo"),
                // errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                // required: true,
                sourceJsonPath: "applyScreenMdmsData.Booking.bookingType",
                jsonPath: "MyBooking.bookingType",
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    md: 4,
                },
            }),
        },
        applicationStatus: {
            ...getSelectField({
                label: {
                    labelName: "Application Status",
                    labelKey: "MY_BK_APPLICATION_STATUS_LABEL",
                },
                placeholder: {
                    labelName: "Application Status",
                    labelKey: "MY_BK_APPLICATION_STATUS_PLACEHOLDER",
                },
                // pattern: getPattern("DoorHouseNo"),
                // errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                // required: true,
                sourceJsonPath: "applyScreenMdmsData.Booking.applicationStatus",
                jsonPath: "MyBooking.applicationStatus",
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    md: 4,
                },
            }),
        },
        fromDate: {
            ...getDateField({
                label: {
                    labelName: "From Date",
                    labelKey: "MY_BK_FROM_DATE_LABEL",
                },
                placeholder: {
                    labelName: "From Date",
                    labelName: "MY_BK_FROM_DATE_PLACEHOLDER",
                },
                // required: true,
                pattern: getPattern("Date"),
                jsonPath: "MyBooking.fromDate",
                props: {
                    className: "applicant-details-error",
                    inputProps: {
                        // min: getTodaysDateInYMD(),
                        max: getTodaysDateInYMD(),
                    },
                },
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    md: 4,
                },
            }),
            // beforeFieldChange: (action, state, dispatch) => {

            //     const fromDate = get(
            //         state,
            //         "screenConfiguration.preparedFinalObject.MyBooking.fromDate"
            //     );
            //     console.log("fromDateNew", fromDate);
            //     dispatch(
            //         handleField(
            //             "my-applications",
            //             "components.div.children.applicationSearch.children.searchForm.children.cardContent.children.applicationDetailsConatiner.children.toDate",
            //             "props.inputProps.min",
            //             fromDate
            //         )
            //     );

            // },
            // visible: true,
        },
        toDate: {
            ...getDateField({
                label: {
                    labelName: "To Date",
                    labelKey: "MY_BK_TO_DATE_LABEL",
                },
                placeholder: {
                    labelName: "To Date",
                    labelKey: "MY_BK_TO_DATE_PLACEHOLDER",
                },
                // required: true,
                pattern: getPattern("Date"),
                jsonPath: "MyBooking.toDate",
                props: {
                    inputProps: {
                        // min: getNextMonthDateInYMD(),
                        max: getTodaysDateInYMD(),
                    },
                },
                gridDefination: {
                    xs: 12,
                    sm: 6,
                    md: 4,
                },
            }),
            // beforeFieldChange: (action, state, dispatch) => {

            //     const fromDate = get(
            //         state,
            //         "screenConfiguration.preparedFinalObject.MyBooking.fromDate"
            //     );
            //     console.log("fromDateNewToDate", fromDate);
            //     // dispatch(
            //     //     handleField(
            //     //         "my-applications",
            //     //         "components.div.children.applicationSearch.children.searchForm.children.cardContent.children.applicationDetailsConatiner.children.toDate",
            //     //         "props.inputProps.min",
            //     //         fromDate
            //     //     )
            //     // );

            // },
            // visible: true,
        },
        resetButton: {
            componentPath: "Button",
            props: {
                variant: "outlined",
                color: "primary",
                style: {
                    minWidth: "200px",
                    height: "48px",
                    marginRight: "16px",
                },
            },
            children: {
                // previousButtonIcon: {
                //   uiFramework: "custom-atoms",
                //   componentPath: "Icon",
                //   props: {
                //     iconName: "keyboard_arrow_left"
                //   }
                // },
                resetButtonLabel: getLabel({
                    labelName: "Cancel",
                    labelKey: "MY_BK_BUTTON_RESET",
                }),
            },
            onClickDefination: {
                action: "condition",
                callBack: callBackForReset,
            },
            visible: true,
        },
        payButton: {
            componentPath: "Button",
            props: {
                variant: "contained",
                color: "primary",
                style: {
                    minWidth: "200px",
                    height: "48px",
                    marginRight: "45px",
                },
            },
            children: {
                submitButtonLabel: getLabel({
                    labelName: "Submit",
                    labelKey: "MY_BK_BUTTON_SEARCH",
                }),
                // submitButtonIcon: {
                //   uiFramework: "custom-atoms",
                //   componentPath: "Icon",
                //   props: {
                //     iconName: "keyboard_arrow_right"
                //   }
                // }
            },
            onClickDefination: {
                action: "condition",
                callBack: callBackForSearch,
            },
            visible: true,
        },
    }),
});
