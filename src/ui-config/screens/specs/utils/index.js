import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import {
    getUserInfo,
    getTenantId,
    getapplicationType,
    localStorageGet,
    lSRemoveItem,
    setOPMSTenantId,
    lSRemoveItemlocal,
    getapplicationNumber,
} from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import {
    getQueryArg,
    getTransformedLocalStorgaeLabels,
    getLocaleLabels,
    getFileUrlFromAPI,
} from "egov-ui-framework/ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../ui-utils/api";
import isUndefined from "lodash/isUndefined";
import {
    getCommonCard,
    getCommonValue,
    getCommonCaption,
    getPattern,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import axios from "axios";
import { sampleGetBill } from "../../../../ui-utils/sampleResponses";

export const getCommonApplyFooter = (children) => {
    return {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
            className: "apply-wizard-footer",
        },
        children,
    };
};

export const transformById = (payload, id) => {
    return (
        payload &&
        payload.reduce((result, item) => {
            result[item[id]] = {
                ...item,
            };

            return result;
        }, {})
    );
};

export const getTranslatedLabel = (labelKey, localizationLabels) => {
    let translatedLabel = null;
    if (localizationLabels && localizationLabels.hasOwnProperty(labelKey)) {
        translatedLabel = localizationLabels[labelKey];
        if (
            translatedLabel &&
            typeof translatedLabel === "object" &&
            translatedLabel.hasOwnProperty("message")
        )
            translatedLabel = translatedLabel.message;
    }
    return translatedLabel || labelKey;
};

export const validateFields = (objectJsonPath, state, dispatch, screen) => {
    const fields = get(
        state.screenConfiguration.screenConfig[screen],
        objectJsonPath,
        {}
    );
    let isFormValid = true;
    for (var variable in fields) {
        if (fields.hasOwnProperty(variable)) {
            if (
                fields[variable] &&
                fields[variable].props &&
                (fields[variable].props.disabled === undefined ||
                    !fields[variable].props.disabled) &&
                !validate(
                    screen,
                    {
                        ...fields[variable],
                        value: get(
                            state.screenConfiguration.preparedFinalObject,
                            fields[variable].jsonPath
                        ),
                    },
                    dispatch,
                    true
                )
            ) {
                isFormValid = false;
            }
        }
    }
    return isFormValid;
};

export const convertDateToEpoch = (dateString, dayStartOrEnd = "dayend") => {
    //example input format : "2018-10-02"
    try {
        const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
        const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
        DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
        if (dayStartOrEnd === "dayend") {
            DateObj.setHours(DateObj.getHours() + 24);
            DateObj.setSeconds(DateObj.getSeconds() - 1);
        }
        return DateObj.getTime();
    } catch (e) {
        return dateString;
    }
};

export const getEpochForDate = (date) => {
    const dateSplit = date.split("/");
    return new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]).getTime();
};

export const sortByEpoch = (data, order) => {
    if (order) {
        return data.sort((a, b) => {
            return a[a.length - 1] - b[b.length - 1];
        });
    } else {
        return data.sort((a, b) => {
            return b[b.length - 1] - a[a.length - 1];
        });
    }
};

export const ifUserRoleExists = (role) => {
    let userInfo = JSON.parse(getUserInfo());
    const roles = get(userInfo, "roles");
    const roleCodes = roles ? roles.map((role) => role.code) : [];
    if (roleCodes.indexOf(role) > -1) {
        return true;
    } else return false;
};

export const convertEpochToDate = (dateEpoch) => {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
};

export const getCurrentFinancialYear = () => {
    var today = new Date();
    var curMonth = today.getMonth();
    var fiscalYr = "";
    if (curMonth > 3) {
        var nextYr1 = (today.getFullYear() + 1).toString();
        fiscalYr = today.getFullYear().toString() + "-" + nextYr1;
    } else {
        var nextYr2 = today.getFullYear().toString();
        fiscalYr = (today.getFullYear() - 1).toString() + "-" + nextYr2;
    }
    return fiscalYr;
};

export const getFinancialYearDates = (format, et) => {
    /** Return the starting date and ending date (1st April to 31st March)
     *  of the financial year of the given date in ET. If no ET given then
     *  return the dates for the current financial year */
    var date = !et ? new Date() : new Date(et);
    var curMonth = date.getMonth();
    var financialDates = { startDate: "NA", endDate: "NA" };
    if (curMonth > 3) {
        switch (format) {
            case "dd/mm/yyyy":
                financialDates.startDate = `01/04/${date
                    .getFullYear()
                    .toString()}`;
                financialDates.endDate = `31/03/${(
                    date.getFullYear() + 1
                ).toString()}`;
                break;
            case "yyyy-mm-dd":
                financialDates.startDate = `${date
                    .getFullYear()
                    .toString()}-04-01`;
                financialDates.endDate = `${(
                    date.getFullYear() + 1
                ).toString()}-03-31`;
                break;
        }
    } else {
        switch (format) {
            case "dd/mm/yyyy":
                financialDates.startDate = `01/04/${(
                    date.getFullYear() - 1
                ).toString()}`;
                financialDates.endDate = `31/03/${date
                    .getFullYear()
                    .toString()}`;
                break;
            case "yyyy-mm-dd":
                financialDates.startDate = `${(
                    date.getFullYear() - 1
                ).toString()}-04-01`;
                financialDates.endDate = `${date
                    .getFullYear()
                    .toString()}-03-31`;
                break;
        }
    }
    return financialDates;
};

export const showCityPicker = (state, dispatch) => {
    let toggle = get(
        state.screenConfiguration.screenConfig["home"],
        "components.cityPickerDialog.props.open",
        false
    );
    dispatch(
        handleField(
            "home",
            "components.cityPickerDialog",
            "props.open",
            !toggle
        )
    );
};

export const OPMSTenantId = (state, dispatch) => {
    const tenantId = get(
        state.screenConfiguration.preparedFinalObject,
        "citiesByModule.citizenTenantId"
    );
    setOPMSTenantId(tenantId);
    window.location.href =
        process.env.NODE_ENV === "production"
            ? `/egov-services/home?tenantId=${tenantId}`
            : `/egov-services/home?tenantId=${tenantId}`;
};

export const gotoApplyWithStep = (state, dispatch, step) => {
    const applicationNumber = getQueryArg(
        window.location.href,
        "applicationNumber"
    );
    const applicationNumberQueryString = applicationNumber
        ? `&applicationNumber=${applicationNumber}`
        : ``;
    const tetantQueryString = applicationNumber
        ? `&tenantId=${getTenantId()}`
        : ``;
    const applicationType = getapplicationType();
    let applyUrl = "";

    applyUrl =
        process.env.REACT_APP_SELF_RUNNING === "true"
            ? `/egov-ui-framework/egov-services/applyopenspace?step=${step}`
            : applicationType === "Booking"
                ? `/egov-services/applyopenspace?step=${step}${tetantQueryString}`
                : ``;

    console.log(applyUrl, "applyUrl");

    dispatch(setRoute(applyUrl));
};
export const showHideAdhocPopups = (state, dispatch, screenKey) => {
    //alert(JSON.stringify( state.screenConfiguration.screenConfig[screenKey]))

    let toggle = get(
        state.screenConfiguration.screenConfig[screenKey],
        "components.undertakingdialog.props.open",
        false
    );
    dispatch(
        handleField(
            screenKey,
            "components.undertakingdialog",
            "props.open",
            !toggle
        )
    );
};

export const showHideAdhocPopup = (state, dispatch, screenKey) => {
    let toggle = get(
        state.screenConfiguration.screenConfig[screenKey],
        "components.adhocDialog.props.open",
        false
    );
    dispatch(
        handleField(screenKey, "components.adhocDialog", "props.open", !toggle)
    );
};

export const showHideAdhocPopupopms = (state, dispatch, screenKey, type) => {
    localStorage.setItem("updateNocType", type);
    // //alert(  localStorage.getItem('updateNocType')+type)
    // set(
    //   state,
    //   "screenConfig.components.adhocDialog.children.popup",
    //   adhocPopup2
    // );
    ////alert(JSON.stringify( state.screenConfiguration.screenConfig[screenKey]))

    setTimeout(function () {
        let toggle = get(
            state.screenConfiguration.screenConfig[screenKey],
            "components.adhocDialog.props.open",
            false
        );
        dispatch(
            handleField(
                screenKey,
                "components.adhocDialog",
                "props.open",
                !toggle
            )
        );
    }, 500);

    /*
  
  export const showHideAdhocPopupopmsReject = (state, dispatch, screenKey, type) => {
  
    setTimeout(function () {
      let toggle = get(
        state.screenConfiguration.screenConfig[screenKey],
        "components.adhocDialog3.props.open",
        false
      );
      dispatch(
        handleField(screenKey, "components.adhocDialog3", "props.open", !toggle)
      );
  
      }, 500);
    
   };
   */
};
export const showHideAdhocPopupopmsReassign = (
    state,
    dispatch,
    screenKey,
    type
) => {
    setTimeout(function () {
        let toggle = get(
            state.screenConfiguration.screenConfig[screenKey],
            "components.adhocDialog2.props.open",
            false
        );
        dispatch(
            handleField(
                screenKey,
                "components.adhocDialog2",
                "props.open",
                !toggle
            )
        );
    }, 500);
};
/* export const showHideAdhocPopupopmsApprove = (state, dispatch, screenKey,type) => {
     
     setTimeout(function(){ 
      let toggle = get(
        state.screenConfiguration.screenConfig[screenKey],
        "components.adhocDialog1.props.open",
        false
      );
      dispatch(
        handleField(screenKey, "components.adhocDialog1", "props.open", !toggle)
      ); 
  
      }, 500);
    
   }; */
export const getCommonGrayCard = (children) => {
    return {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        children: {
            body: {
                uiFramework: "custom-atoms",
                componentPath: "Div",
                children: {
                    ch1: getCommonCard(children, {
                        style: {
                            backgroundColor: "rgb(242, 242, 242)",
                            boxShadow: "none",
                            borderRadius: 0,
                            overflow: "visible",
                        },
                    }),
                },
                gridDefination: {
                    xs: 12,
                },
            },
        },
        gridDefination: {
            xs: 12,
        },
    };
};

export const getLabelOnlyValue = (value, props = {}) => {
    return {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
            xs: 6,
            sm: 4,
        },
        props: {
            style: {
                marginBottom: "16px",
            },
            ...props,
        },
        children: {
            value: getCommonCaption(value),
        },
    };
};

export const convertDateTimeToEpoch = (dateTimeString) => {
    //example input format : "26-07-2018 17:43:21"
    try {
        const parts = dateTimeString.match(
            /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/
        );
        return Date.UTC(
            +parts[3],
            parts[2] - 1,
            +parts[1],
            +parts[4],
            +parts[5]
        );
    } catch (e) {
        return dateTimeString;
    }
};

export const getReceiptData = async (queryObject) => {
    try {
        const response = await httpRequest(
            "post",
            "collection-services/payments/_search",
            "",
            queryObject
        );
        return response;
    } catch (error) {
        console.log(error);
        return {};
    }
};

export const getMdmsData = async (queryObject) => {
    try {
        const response = await httpRequest(
            "post",
            "egov-mdms-service/v1/_get",
            "",
            queryObject
        );
        return response;
    } catch (error) {
        console.log(error);
        return {};
    }
};

export const getBill = async (queryObject) => {
    try {
        const response = await httpRequest(
            "post",
            "/billing-service/bill/v2/_fetchbill",
            "",
            queryObject
        );
        return response;
    } catch (error) {
        console.log(error, "errornew");
    }
};
export const getWaterTankerBill = async (requestBody) => {
    try {
        const response = await httpRequest(
            "post",
            "/bookings/osbm/fee/_search",
            "",
            [],
            requestBody
        );
        return response;
    } catch (error) {
        console.log(error, "errornew");
    }
};

export const searchBill = async (dispatch, applicationNumber, tenantId) => {
    try {
        let queryObject = [
            { key: "tenantId", value: tenantId },
            { key: "consumerCodes", value: applicationNumber },
        ];

        // Get Receipt
        let payload = await httpRequest(
            "post",
            "/collection-services/payments/_search",
            "",
            queryObject
        );

        // Get Bill
        const response = await getBill([
            { key: "tenantId", value: tenantId },
            { key: "consumerCode", value: applicationNumber },
            { key: "businessService", value: "OPMS" },
        ]);

        // If pending payment then get bill else get receipt
        let billData = get(payload, "Receipt[0].Bill") || get(response, "Bill");
        if (billData) {
            dispatch(prepareFinalObject("ReceiptTemp[0].Bill", billData));
            const estimateData = createEstimateData(billData[0]);
            estimateData &&
                estimateData.length &&
                dispatch(
                    prepareFinalObject(
                        "applyScreenMdmsData.estimateCardData",
                        estimateData
                    )
                );
        }
    } catch (e) {
        console.log(e);
    }
};

export const createDemandForRoadCutNOC = async (
    state,
    ispatch,
    applicationNumber,
    tenantId
) => {
    try {
        let amount = get(
            state.screenConfiguration.preparedFinalObject,
            "nocApplicationDetail.[0].amount"
        );
        let performancebankguaranteecharges = get(
            state.screenConfiguration.preparedFinalObject,
            "nocApplicationDetail.[0].performancebankguaranteecharges"
        );
        let gstamount = get(
            state.screenConfiguration.preparedFinalObject,
            "nocApplicationDetail.[0].gstamount"
        );
        let userInfo = JSON.parse(getUserInfo());
        userInfo.pwdExpiryDate = 0;
        userInfo.createdDate = 0;
        userInfo.lastModifiedDate = 0;
        userInfo.dob = 0;
        let currentFinancialYr = getCurrentFinancialYear();
        //Changing the format of FY
        let fY1 = currentFinancialYr.split("-")[1];
        fY1 = fY1.substring(2, 4);
        currentFinancialYr = currentFinancialYr.split("-")[0] + "-" + fY1;

        let queryObject = [
            { key: "tenantId", value: tenantId },
            { key: "consumerCodes", value: applicationNumber },
        ];
        let querydemand = {
            CalulationCriteria: [
                {
                    opmsDetail: {
                        financialYear: currentFinancialYr,
                        applicationNumber: applicationNumber,
                        applicationType: getapplicationType(), // "ROADCUTNOC",
                        amountRoadCut: amount,
                        bankPerformanceRoadCut: performancebankguaranteecharges,
                        gstRoadCut: gstamount,
                        owners: [userInfo],
                        tenantId: getTenantId(),
                    },
                    applicationNumber: applicationNumber,
                    tenantId: getTenantId(),
                },
            ],
        };

        // Get Receipt
        let payload = await httpRequest(
            "post",
            "/pm-calculator/v1/_calculate",
            "",
            queryObject,
            querydemand
        );
    } catch (e) {
        console.log(e);
    }
};

export const searchdemand = async (dispatch, applicationNumber, tenantId) => {
    try {
        let currentFinancialYr = getCurrentFinancialYear();
        //Changing the format of FY
        let fY1 = currentFinancialYr.split("-")[1];
        fY1 = fY1.substring(2, 4);
        currentFinancialYr = currentFinancialYr.split("-")[0] + "-" + fY1;
        let userInfo = JSON.parse(getUserInfo());

        console.log("userInfo", userInfo);
        userInfo.pwdExpiryDate = 0;
        userInfo.createdDate = 0;
        userInfo.lastModifiedDate = 0;
        userInfo.dob = 0;

        let queryObject = [
            { key: "tenantId", value: tenantId },
            { key: "consumerCodes", value: applicationNumber },
        ];
        let querydemand = {
            CalulationCriteria: [
                {
                    opmsDetail: {
                        financialYear: currentFinancialYr, // "2019-20",
                        applicationNumber: applicationNumber,
                        applicationType: getapplicationType(), //"PETNOC",
                        owners: [userInfo],
                        tenantId: getTenantId(),
                    },
                    applicationNumber: applicationNumber,
                    tenantId: getTenantId(),
                },
            ],
        };

        // Get Receipt
        let payload = await httpRequest(
            "post",
            "/pm-calculator/v1/_calculate",
            "",
            queryObject,
            querydemand
        );

        // Get Bill
        // const response = await getBill([
        // {
        // key: "tenantId",
        // value: tenantId
        // },
        // {
        // key: "applicationNumber",
        // value: applicationNumber
        // }
        // ]);

        // If pending payment then get bill else get receipt
        // let billData = get(payload, "Receipt[0].Bill") || get(response, "Bill");

        // if (billData) {
        // dispatch(prepareFinalObject("ReceiptTemp[0].Bill", billData));
        // const estimateData = createEstimateData(billData[0]);
        // estimateData &&
        // estimateData.length &&
        // dispatch(
        // prepareFinalObject(
        // "applyScreenMdmsData.estimateCardData",
        // estimateData
        // )
        // );
        // }
    } catch (e) {
        console.log(e);
    }
};

export const createEstimateData = (billObject) => {
    const billDetails = billObject;
    let fees =
        billDetails &&
        billDetails[0].billAccountDetails &&
        billDetails[0].billAccountDetails.map((item) => {
            return {
                name: {
                    labelName: item.taxHeadCode,
                    labelKey: item.taxHeadCode,
                },
                value: item.amount,
                order: item.order,
                info: {
                    labelName: item.taxHeadCode,
                    labelKey: item.taxHeadCode,
                },
            };
        });
    // fees.sort(function (x, y) {
    //     return x.order - y.order;
    // });
    return fees;
};

export const generateBill = async (
    state,
    dispatch,
    applicationNumber,
    tenantId,
    bookingType
) => {
    try {
        if (applicationNumber && tenantId && bookingType) {
            let queryObject = [
                { key: "tenantId", value: tenantId },
                { key: "consumerCode", value: applicationNumber },
                { key: "businessService", value: bookingType },
            ];
            console.log(queryObject, "applicationNumberNew");
            const payload = await getBill(queryObject);
            if (payload) {
                dispatch(
                    prepareFinalObject("ReceiptTemp[0].Bill", payload.Bill)
                );
                console.log("payload.Bill", payload.Bill);
                const estimateData = createEstimateData(payload.Bill);
                estimateData &&
                    estimateData.length &&
                    dispatch(
                        prepareFinalObject(
                            "applyScreenMdmsData.estimateCardData",
                            estimateData
                        )
                    );
            }
        }
    } catch (e) {
        console.log(e);
    }
};

export const generageBillCollection = async (
    state,
    dispatch,
    applicationNumber,
    tenantId
) => {
    try {
        if (applicationNumber && tenantId) {
            let queryObject = [
                { key: "tenantId", value: tenantId },
                { key: "consumerCodes", value: applicationNumber },
            ];
            const payload = await httpRequest(
                "post",
                "/collection-services/payments/_search",
                "",
                queryObject
            );
            if (payload) {
                dispatch(
                    prepareFinalObject("ReceiptTemp[0].Bill", [
                        payload.Payments[0].paymentDetails[0].bill,
                    ])
                );
                const estimateData = createEstimateData(
                    payload.Payments[0].paymentDetails[0].bill.billDetails
                );
                estimateData &&
                    estimateData.length &&
                    dispatch(
                        prepareFinalObject(
                            "applyScreenMdmsData.estimateCardData",
                            estimateData
                        )
                    );
            }
        }
    } catch (error) {
        console.log(error);
    }
};

export const resetFields = (state, dispatch) => {
    dispatch(
        handleField(
            "search",
            "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.NOCNo",
            "props.value",
            ""
        )
    );
    dispatch(
        handleField(
            "search",
            "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.applicationNo",
            "props.value",
            ""
        )
    );
    dispatch(
        handleField(
            "search",
            "components.div.children.NOCApplication.children.cardContent.children.appNOCAndMobNumContainer.children.ownerMobNo",
            "props.value",
            ""
        )
    );
    dispatch(
        handleField(
            "search",
            "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.applicationNo",
            "props.value",
            ""
        )
    );
    dispatch(
        handleField(
            "search",
            "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.fromDate",
            "props.value",
            ""
        )
    );
    dispatch(
        handleField(
            "search",
            "components.div.children.NOCApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.toDate",
            "props.value",
            ""
        )
    );
};

export const getTextToLocalMapping = (label) => {
    const localisationLabels = getTransformedLocalStorgaeLabels();
    switch (label) {
        case "Application No":
            return getLocaleLabels(
                "Application No",
                "applicationId",
                localisationLabels
            );
        case "Application Status":
            return getLocaleLabels(
                "Application Status",
                "applicationStatus",
                localisationLabels
            );
        case "Applicant Name":
            return getLocaleLabels(
                "Applicant Name",
                "applicantName",
                localisationLabels
            );
        case "NOC No":
            return getLocaleLabels(
                "NOC No",
                "NOC_COMMON_TABLE_COL_NOC_NO_LABEL",
                localisationLabels
            );

        case "NOC Type":
            return getLocaleLabels(
                "NOC Type",
                "NOC_TYPE_LABEL",
                localisationLabels
            );
        case "Owner Name":
            return getLocaleLabels(
                "Owner Name",
                "NOC_COMMON_TABLE_COL_OWN_NAME_LABEL",
                localisationLabels
            );

        case "Application Date":
            return getLocaleLabels(
                "Application Date",
                "NOC_COMMON_TABLE_COL_APP_DATE_LABEL",
                localisationLabels
            );

        case "Status":
            return getLocaleLabels(
                "Status",
                "NOC_COMMON_TABLE_COL_STATUS_LABEL",
                localisationLabels
            );

        //master
        case "Price Book Id":
            return getLocaleLabels(
                "Price Book Id",
                "priceBookId",
                localisationLabels
            );

        case "categoryId":
            return getLocaleLabels(
                "categoryId",
                "categoryId",
                localisationLabels
            );
        case "subCategoryId":
            return getLocaleLabels(
                "subCategoryId",
                "subCategoryId",
                localisationLabels
            );
        case "perDayPrice":
            return getLocaleLabels(
                "perDayPrice",
                "perDayPrice",
                localisationLabels
            );
        case "perWeekPrice":
            return getLocaleLabels(
                "perWeekPrice",
                "perWeekPrice",
                localisationLabels
            );
        case "perMonthPrice":
            return getLocaleLabels(
                "perMonthPrice",
                "perMonthPrice",
                localisationLabels
            );
        case "annualPrice":
            return getLocaleLabels(
                "annualPrice",
                "annualPrice",
                localisationLabels
            );
        case "effectiveFromDate":
            return getLocaleLabels(
                "effectiveFromDate",
                "effectiveFromDate",
                localisationLabels
            );
        case "effectiveToDate":
            return getLocaleLabels(
                "effectiveToDate",
                "effectiveToDate",
                localisationLabels
            );
        //reprt1

        case "Application Date":
            return getLocaleLabels(
                "Application Date",
                "NOC_COMMON_TABLE_COL_APP_DATE_LABEL",
                localisationLabels
            );

        case "Status":
            return getLocaleLabels(
                "Status",
                "NOC_COMMON_TABLE_COL_STATUS_LABEL",
                localisationLabels
            );

        //master
        case "applcationType":
            return getLocaleLabels(
                "applcationType",
                "applcationType",
                localisationLabels
            );

        case "totalNoOfApplicationReceived":
            return getLocaleLabels(
                "totalNoOfApplicationReceived",
                "totalNoOfApplicationReceived",
                localisationLabels
            );
        case "noOfApplicationProcessed":
            return getLocaleLabels(
                "noOfApplicationProcessed",
                "noOfApplicationProcessed",
                localisationLabels
            );
        case "noOfApplicationPending":
            return getLocaleLabels(
                "noOfApplicationPending",
                "noOfApplicationPending",
                localisationLabels
            );
        case "noOfApplicationRejected":
            return getLocaleLabels(
                "noOfApplicationRejected",
                "noOfApplicationRejected",
                localisationLabels
            );

        case "totalNoOfApplicationApproved":
            return getLocaleLabels(
                "totalNoOfApplicationApproved",
                "totalNoOfApplicationApproved",
                localisationLabels
            );
        case "revenueCollected":
            return getLocaleLabels(
                "revenueCollected",
                "revenueCollected",
                localisationLabels
            );
        case "totalNoApplicationApprovedWithNilCharges":
            return getLocaleLabels(
                "totalNoApplicationApprovedWithNilCharges",
                "totalNoApplicationApprovedWithNilCharges",
                localisationLabels
            );

        case "avgTimeTakenToProcessRequest":
            return getLocaleLabels(
                "avgTimeTakenToProcessRequest",
                "avgTimeTakenToProcessRequest",
                localisationLabels
            );

        case "pendingMoreThan10AndLessThan30Days":
            return getLocaleLabels(
                "pendingMoreThan10AndLessThan30Days",
                "pendingMoreThan10AndLessThan30Days",
                localisationLabels
            );
        case "sector":
            return getLocaleLabels("sector", "sector", localisationLabels);
        case "pendingMoreThan30Days":
            return getLocaleLabels(
                "pendingMoreThan30Days",
                "pendingMoreThan30Days",
                localisationLabels
            );

        case "YearMonth":
            return getLocaleLabels(
                "YearMonth",
                "YearMonth",
                localisationLabels
            );

        case "approve":
            return getLocaleLabels("approve", "approve", localisationLabels);
        case "rev":
            return getLocaleLabels("rev", "rev", localisationLabels);

        case "exempted":
            return getLocaleLabels("exempted", "exempted", localisationLabels);

        case "INITIATED":
            return getLocaleLabels(
                "Initiated,",
                "NOC_INITIATED",
                localisationLabels
            );
        case "APPLIED":
            getLocaleLabels("Applied", "NOC_APPLIED", localisationLabels);
        case "PAID":
            getLocaleLabels(
                "Paid",
                "WF_NEWPM_PENDINGAPPROVAL",
                localisationLabels
            );

        case "APPROVED":
            return getLocaleLabels(
                "Approved",
                "NOC_APPROVED",
                localisationLabels
            );
        case "REJECTED":
            return getLocaleLabels(
                "Rejected",
                "NOC_REJECTED",
                localisationLabels
            );
        case "CANCELLED":
            return getLocaleLabels(
                "Cancelled",
                "NOC_CANCELLED",
                localisationLabels
            );
    }
};

export const showHideAdhocPopupopmsReject = (
    state,
    dispatch,
    screenKey,
    type
) => {
    setTimeout(function () {
        let toggle = get(
            state.screenConfiguration.screenConfig[screenKey],
            "components.adhocDialog3.props.open",
            false
        );
        dispatch(
            handleField(
                screenKey,
                "components.adhocDialog3",
                "props.open",
                !toggle
            )
        );
    }, 500);
};
/*
export const showHideAdhocPopupopmsReassign = (state, dispatch, screenKey,type) => {
    
    setTimeout(function(){ 
     let toggle = get(
       state.screenConfiguration.screenConfig[screenKey],
       "components.adhocDialog2.props.open",
       false
     );
     dispatch(
       handleField(screenKey, "components.adhocDialog2", "props.open", !toggle)
     ); 
 
     }, 500);
   
  };
  */

export const showHideAdhocPopupopmsApprove = (
    state,
    dispatch,
    screenKey,
    type
) => {
    setTimeout(function () {
        let toggle = get(
            state.screenConfiguration.screenConfig[screenKey],
            "components.adhocDialog1.props.open",
            false
        );
        dispatch(
            handleField(
                screenKey,
                "components.adhocDialog1",
                "props.open",
                !toggle
            )
        );
    }, 500);
};
export const showHideAdhocPopupopmsForward = (
    state,
    dispatch,
    screenKey,
    type
) => {
    setTimeout(function () {
        let toggle = get(
            state.screenConfiguration.screenConfig[screenKey],
            "components.adhocDialogForward.props.open",
            false
        );
        dispatch(
            handleField(
                screenKey,
                "components.adhocDialogForward",
                "props.open",
                !toggle
            )
        );
    }, 500);
};

export const getOPMSPattern = (type) => {
    switch (type) {
        case "cin":
            return /^([L|U]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/i;
    }
};

export const createDemandForAdvNOC = async (state, ispatch) => {
    try {
        let advdetails = get(
            state.screenConfiguration.preparedFinalObject,
            "ADVTCALCULATENOC"
        );

        let durationAdvertisement = advdetails.duration; // JSON.parse(advdetails).duration;
        let fromDateAdvertisement = advdetails.fromDateToDisplay;
        let toDateAdvertisement = advdetails.toDateToDisplay;
        let squareFeetAdvertisement = advdetails.space;
        let exemptedCategory = advdetails.exemptedCategory;
        let userInfo = JSON.parse(getUserInfo());
        userInfo.pwdExpiryDate = 0;
        userInfo.createdDate = 0;
        userInfo.lastModifiedDate = 0;
        userInfo.dob = 0;
        let currentFinancialYr = getCurrentFinancialYear();
        //Changing the format of FY
        let fY1 = currentFinancialYr.split("-")[1];
        fY1 = fY1.substring(2, 4);
        currentFinancialYr = currentFinancialYr.split("-")[0] + "-" + fY1;

        let queryObject = [
            { key: "tenantId", value: getTenantId() },
            { key: "consumerCodes", value: getapplicationNumber() },
        ];
        let querydemand = {
            CalulationCriteria: [
                {
                    opmsDetail: {
                        financialYear: currentFinancialYr,
                        applicationNumber: getapplicationNumber(),
                        applicationType: getapplicationType(), //"ADVERTISEMENTNOC",
                        isExamptedAdvertisement: exemptedCategory,
                        categoryIdAdvertisement: localStorageGet("this_adv_id"),
                        subCategotyIdAdvertisement: localStorageGet(
                            "this_sub_adv_id"
                        ),
                        durationAdvertisement: durationAdvertisement,
                        fromDateAdvertisement: fromDateAdvertisement,
                        toDateAdvertisement: toDateAdvertisement,
                        squareFeetAdvertisement: squareFeetAdvertisement,
                        owners: [userInfo],
                        tenantId: getTenantId(),
                    },
                    applicationNumber: getapplicationNumber(),
                    tenantId: getTenantId(),
                },
            ],
        };

        // Get Receipt
        let payload = await httpRequest(
            "post",
            "/pm-calculator/v1/_calculate",
            "",
            queryObject,
            querydemand
        );
        return payload;
    } catch (e) {
        console.log(e);
    }
};

export const clearlocalstorageAppDetails = (state) => {
    set(state, "screenConfiguration.preparedFinalObject", {});
    lSRemoveItemlocal("applicationType");
    lSRemoveItemlocal("applicationNumber");
    lSRemoveItemlocal("applicationStatus");
    lSRemoveItemlocal("footerApplicationStatus");
    lSRemoveItemlocal("app_noc_status");
    lSRemoveItemlocal("this_adv_code");
    lSRemoveItemlocal("this_adv_id");
    lSRemoveItemlocal("ApplicationNumber");
    lSRemoveItemlocal("gstAmount");
    lSRemoveItemlocal("amount");
    lSRemoveItemlocal("performanceBankGuaranteeCharges");
    lSRemoveItemlocal("applicationMode");
    lSRemoveItemlocal("undertakig");
    lSRemoveItemlocal("this_sub_adv_id");
    lSRemoveItemlocal("this_sub_adv_code");
    lSRemoveItemlocal("undertaking");

    lSRemoveItem("ApplicationNumber");
    lSRemoveItem("applicationType");
    lSRemoveItem("applicationNumber");
    lSRemoveItem("applicationStatus");
    lSRemoveItem("footerApplicationStatus");
    lSRemoveItem("app_noc_status");
    lSRemoveItem("this_adv_code");
    lSRemoveItem("this_adv_id");
    lSRemoveItem("gstAmount");
    lSRemoveItem("amount");
    lSRemoveItem("performanceBankGuaranteeCharges");
    lSRemoveItem("applicationMode");
    lSRemoveItem("undertakig");
    lSRemoveItem("this_sub_adv_code");
    lSRemoveItem("this_sub_adv_id");
    lSRemoveItem("undertaking");
};

// export const validateFields = (
//     objectJsonPath,
//     state,
//     dispatch,
//     screen = "apply"
//   ) => {
//     const fields = get(
//       state.screenConfiguration.screenConfig[screen],
//       objectJsonPath,
//       {}
//     );
//     let isFormValid = true;
//     for (var variable in fields) {
//       if (fields.hasOwnProperty(variable)) {
//         if (
//           fields[variable] &&
//           fields[variable].props &&
//           (fields[variable].props.disabled === undefined ||
//             !fields[variable].props.disabled) &&
//           !validate(
//             screen,
//             {
//               ...fields[variable],
//               value: get(
//                 state.screenConfiguration.preparedFinalObject,
//                 fields[variable].jsonPath
//               )
//             },
//             dispatch,
//             true
//           )
//         ) {
//           isFormValid = false;
//         }
//       }
//     }
//     return isFormValid;
//   };

export const convertDateInDMY = (inputDate) => {
    if (inputDate) {
        var datePart = inputDate.split("-");
        let year = datePart[0],
            month = datePart[1],
            day = datePart[2];
        return day + "/" + month + "/" + year;
    } else {
        return "";
    }
};

export const getTodaysDateInYMD = () => {
    let date = new Date();
    let month =
        date.getMonth() + 1 < 10
            ? `0${date.getMonth() + 1}`
            : date.getMonth() + 1;
    let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    date = `${date.getFullYear()}-${month}-${day}`;
    return date;
};

export const getNextMonthDateInYMD = () => {
    //For getting date of same day but of next month
    let date = getTodaysDateInYMD();
    date =
        date.substring(0, 5) +
        (parseInt(date.substring(5, 7)) + 1) +
        date.substring(7, 10);
    return date;
};

export const downloadReceiptFromFilestoreID = (fileStoreId, mode, tenantId) => {
    getFileUrlFromAPI(fileStoreId, tenantId).then(async (fileRes) => {
        if (mode === "download") {
            var win = window.open(fileRes[fileStoreId], "_blank");
            if (win) {
                win.focus();
            }
        } else {
            // printJS(fileRes[fileStoreId])
            var response = await axios.get(fileRes[fileStoreId], {
                //responseType: "blob",
                responseType: "arraybuffer",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/pdf",
                },
            });
            console.log("responseData---", response);
            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            var myWindow = window.open(fileURL);
            if (myWindow != undefined) {
                myWindow.addEventListener("load", (event) => {
                    myWindow.focus();
                    myWindow.print();
                });
            }
        }
    });
};

const NumInWords = (number) => {
    const first = [
        "",
        "One ",
        "Two ",
        "Three ",
        "Four ",
        "Five ",
        "Six ",
        "Seven ",
        "Eight ",
        "Nine ",
        "Ten ",
        "Eleven ",
        "Twelve ",
        "Thirteen ",
        "Fourteen ",
        "Fifteen ",
        "Sixteen ",
        "Seventeen ",
        "Eighteen ",
        "Nineteen ",
    ];
    const tens = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
    ];
    const mad = ["", "Thousand", "Million", "Billion", "Trillion"];
    let word = "";

    for (let i = 0; i < mad.length; i++) {
        let tempNumber = number % (100 * Math.pow(1000, i));
        if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
            if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
                word =
                    first[Math.floor(tempNumber / Math.pow(1000, i))] +
                    mad[i] +
                    " " +
                    word;
            } else {
                word =
                    tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] +
                    first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] +
                    mad[i] +
                    " " +
                    word;
            }
        }

        tempNumber = number % Math.pow(1000, i + 1);
        if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0)
            word =
                first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] +
                "Hunderd " +
                word;
    }
    return word + "Rupees Only";
};

export const getDurationDate = (fromDate, toDate) => {
    let monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    let startDate = new Date(fromDate);
    let finalStartDate =
        startDate.getDate() +
        " " +
        monthNames[startDate.getMonth()] +
        " " +
        startDate.getFullYear();

    let endDate = new Date(toDate);
    endDate.setMonth(endDate.getMonth());
    let finalEndDate =
        endDate.getDate() +
        " " +
        monthNames[endDate.getMonth()] +
        " " +
        endDate.getFullYear();
    let finalDate = finalStartDate + " to " + finalEndDate;
    return finalDate;
};
export const downloadReceipt = (
    state,
    applicationNumber,
    tenantId,
    mode = "download"
) => {
    let applicationData = get(
        state.screenConfiguration.preparedFinalObject,
        "Booking"
    );
    const receiptQueryString = [
        { key: "consumerCodes", value: applicationNumber },
        {
            key: "tenantId",
            value: tenantId,
        },
    ];
    const FETCHRECEIPT = {
        GET: {
            URL: "/collection-services/payments/_search",
            ACTION: "_get",
        },
    };
    const DOWNLOADRECEIPT = {
        GET: {
            URL: "/pdf-service/v1/_create",
            // ACTION: "_get",
        },
    };
    try {
        httpRequest(
            "post",
            FETCHRECEIPT.GET.URL,
            FETCHRECEIPT.GET.ACTION,
            receiptQueryString
        ).then((payloadReceiptDetails) => {
            const queryStr = [
                { key: "key", value: "bk-payment-receipt" },
                {
                    key: "tenantId",
                    value: "ch",
                },
            ];
            if (
                payloadReceiptDetails &&
                payloadReceiptDetails.Payments &&
                payloadReceiptDetails.Payments.length == 0
            ) {
                console.log("Could not find any receipts");
                return;
            }
            console.log("payloadReceiptDetails", payloadReceiptDetails);
            let receiptData = [
                {
                    applicantDetail: {
                        name: payloadReceiptDetails.Payments[0].payerName,
                        mobileNumber:
                            payloadReceiptDetails.Payments[0].mobileNumber,
                        houseNo: applicationData.bkHouseNo,
                        permanentAddress: applicationData.bkCompleteAddress,
                        permanentCity:
                            payloadReceiptDetails.Payments[0].tenantId,
                        sector: applicationData.bkSector,
                    },
                    booking: {
                        bkApplicationNumber:
                            payloadReceiptDetails.Payments[0].paymentDetails[0]
                                .bill.consumerCode,
                    },
                    paymentInfo: {
                        paymentDate: convertEpochToDate(
                            payloadReceiptDetails.Payments[0].transactionDate,
                            "dayend"
                        ),
                        transactionId:
                            payloadReceiptDetails.Payments[0].transactionNumber,
                        bookingPeriod:


                            payloadReceiptDetails.Payments[0].paymentDetails[0]
                                .bill.businessService === "OSBM"
                                ? getDurationDate(
                                    applicationData.bkFromDate,
                                    applicationData.bkToDate
                                )
                                : `${applicationData.bkDate} , ${applicationData.bkTime} `,
                        bookingItem: `Online Payment Against Booking of ${
                            payloadReceiptDetails.Payments[0].paymentDetails[0]
                                .bill.businessService === "OSBM"
                                ? "Open Space for Building Material"
                                : "Water Tanker"
                            }`,
                        amount: payloadReceiptDetails.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
                            (el) => !el.taxHeadCode.includes("TAX")
                        )[0].amount,
                        tax: payloadReceiptDetails.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
                            (el) => el.taxHeadCode.includes("TAX")
                        )[0].amount,
                        grandTotal:
                            payloadReceiptDetails.Payments[0].totalAmountPaid,
                        amountInWords: NumInWords(
                            payloadReceiptDetails.Payments[0].totalAmountPaid
                        ),
                        paymentItemExtraColumnLabel:


                            payloadReceiptDetails.Payments[0].paymentDetails[0]
                                .bill.businessService === "OSBM"
                                ? "Booking Period"
                                : "Date & Time",
                        paymentMode:
                            payloadReceiptDetails.Payments[0].paymentMode,
                        receiptNo:
                            payloadReceiptDetails.Payments[0].paymentDetails[0]
                                .receiptNumber,
                    },
                    payerInfo: {
                        payerName: payloadReceiptDetails.Payments[0].payerName,
                        payerMobile:
                            payloadReceiptDetails.Payments[0].mobileNumber,
                    },
                    generatedBy: {
                        generatedBy: JSON.parse(getUserInfo()).name,
                    },
                },
            ];

            httpRequest(
                "post",
                DOWNLOADRECEIPT.GET.URL,
                "",
                queryStr,
                { BookingInfo: receiptData },
                { Accept: "application/json" },
                { responseType: "arraybuffer" }
            ).then((res) => {
                res.filestoreIds[0];
                if (res && res.filestoreIds && res.filestoreIds.length > 0) {
                    res.filestoreIds.map((fileStoreId) => {
                        downloadReceiptFromFilestoreID(fileStoreId, mode);
                    });
                } else {
                    console.log("Error In Receipt Download");
                }
            });
        });
    } catch (exception) {
        alert("Some Error Occured while downloading Receipt!");
    }
};

export const downloadCertificate = (
    state,
    applicationNumber,
    tenantId,
    mode = "download"
) => {
    let applicationData = get(
        state.screenConfiguration.preparedFinalObject,
        "Booking"
    );

    const DOWNLOADCERTIFICATE = {
        GET: {
            URL: "/pdf-service/v1/_create",
            // ACTION: "_get",
        },
    };
    try {
        let queryStr = [
            { key: "key", value: "bk-osbm-pl" },
            { key: "tenantId", value: "ch" },
        ];

        applicationData.businessService == "OSBM"
            ? queryStr = [
                { key: "key", value: "bk-osbm-pl" },
                { key: "tenantId", value: "ch" },
            ]
            : queryStr = [
                { key: "key", value: "bk-cg-pl" },
                { key: "tenantId", value: "ch" },
            ]


        let certificateData = [
            {
                applicantDetail: {
                    name: applicationData.bkApplicantName,
                    mobileNumber: applicationData.bkMobileNumber,
                    houseNo: applicationData.bkSector,
                    permanentAddress: applicationData.bkCompleteAddress,
                    permanentCity: tenantId,
                    sector: applicationData.bkHouseNo,
                },
                bookingDetail: {
                    applicationNumber: applicationNumber,
                    applicationDate: convertDateInDMY(
                        applicationData.bkDateCreated
                    ),
                    villageOrCity: applicationData.bkVillCity,
                    residentialOrCommercial: applicationData.bkType,
                    areaRequired: applicationData.bkAreaRequired,
                    category: applicationData.bkCategory,
                    typeOfConstruction: applicationData.bkConstructionType,
                    permissionPeriod: getDurationDate(
                        applicationData.bkFromDate,
                        applicationData.bkToDate
                    ),
                    duration:
                        applicationData.bkDuration == "1"
                            ? `${applicationData.bkDuration} Month`
                            : `${applicationData.bkDuration} Months`,
                    categoryImage: "",
                    // categoryImage: "http://3.6.65.87:3000/static/media/cat-a.4e1bc5ec.jpeg"
                },
                generatedBy: {
                    generatedBy: JSON.parse(getUserInfo()).name,
                },
            },
        ];

        httpRequest(
            "post",
            DOWNLOADCERTIFICATE.GET.URL,
            "",
            queryStr,
            { BookingInfo: certificateData },
            { Accept: "application/json" },
            { responseType: "arraybuffer" }
        ).then((res) => {
            res.filestoreIds[0];
            if (res && res.filestoreIds && res.filestoreIds.length > 0) {
                res.filestoreIds.map((fileStoreId) => {
                    downloadReceiptFromFilestoreID(fileStoreId, mode);
                });
            } else {
                console.log("Error In Permission Letter Download");
            }
        });
        //   })
    } catch (exception) {
        alert("Some Error Occured while downloading Permission Letter!");
    }
};

export const downloadApplication = (
    state,
    applicationNumber,
    tenantId,
    mode = "download"
) => {
    let applicationData = get(
        state.screenConfiguration.preparedFinalObject,
        "Booking"
    );
    let paymentData = get(
        state.screenConfiguration.preparedFinalObject,
        "ReceiptTemp[0].Bill[0]"
    );

    const DOWNLOADAPPLICATION = {
        GET: {
            URL: "/pdf-service/v1/_create",
            // ACTION: "_get",
        },
    };
    try {
        const queryStr = [
            {
                key: "key",
                value:
                    applicationData.businessService == "OSBM"
                        ? "bk-osbm-app-form"
                        : applicationData.bkStatus.includes("Paid")
                            ? "bk-wt-app-form"
                            : "bk-wt-unpaid-app-form",
            },
            { key: "tenantId", value: "ch" },
        ];

        let bookingDataOsbm = {
            applicationNumber: applicationNumber,
            houseNo: applicationData.bkHouseNo,
            locality: applicationData.bkSector,
            completeAddress: applicationData.bkCompleteAddress,
            applicationDate: applicationData.bkDateCreated,
            villageOrCity: applicationData.bkVillCity,
            propertyType: applicationData.bkType,
            storageAreaRequired: applicationData.bkAreaRequired,
            category: applicationData.bkCategory,
            typeOfConstruction: applicationData.bkConstructionType,
            // permissionPeriod: "From 18-03-2020 To 17-04-2020",
            duration:
                applicationData.bkDuration == "1"
                    ? `${applicationData.bkDuration} Month`
                    : `${applicationData.bkDuration} Months`,
            categoryImage: "",
            // categoryImage: applicationData.bkCategory === "Cat-A" ? "http://3.6.65.87:3000/static/media/cat-a.4e1bc5ec.jpeg" : applicationData.bkCategory === "Cat-B" ? "" : "http://3.6.65.87:3000/static/media/cat-c.4e1bc5ec.jpeg"
        };
        let bookingDataWt = {
            applicationNumber: applicationNumber,
            name: applicationData.bkApplicantName,
            mobileNumber: applicationData.bkMobileNumber,
            email: applicationData.bkEmail,
            houseNo: applicationData.bkHouseNo,
            locality: applicationData.bkSector,
            completeAddress: applicationData.bkCompleteAddress,
            applicationDate: applicationData.bkDateCreated,
            propertyType: applicationData.bkType,
            date: convertDateInDMY(applicationData.bkDate),
            time: applicationData.bkTime,
            applicationStatus: applicationData.bkApplicationStatus,
            applicationType: applicationData.bkStatus,
        };

        let appData = [
            {
                applicantDetail: {
                    name: applicationData.bkApplicantName,
                    mobileNumber: applicationData.bkMobileNumber,
                    houseNo: applicationData.bkHouseNo,
                    permanentAddress: applicationData.bkCompleteAddress,
                    permanentCity: tenantId,
                    sector: applicationData.bkSector,
                    email: applicationData.bkEmail,
                },
                bookingDetail:
                    applicationData.businessService === "OSBM"
                        ? bookingDataOsbm
                        : bookingDataWt,
                feeDetail: {
                    baseCharge:
                        paymentData === undefined
                            ? null
                            : paymentData.billDetails[0].billAccountDetails.filter(
                                (el) => !el.taxHeadCode.includes("TAX")
                            )[0].amount,
                    taxes:
                        paymentData === undefined
                            ? null
                            : paymentData.billDetails[0].billAccountDetails.filter(
                                (el) => el.taxHeadCode.includes("TAX")
                            )[0].amount,
                    totalAmount:
                        paymentData === undefined
                            ? null
                            : paymentData.totalAmount,
                },
                generatedBy: {
                    generatedBy: JSON.parse(getUserInfo()).name,
                },
            },
        ];
        httpRequest(
            "post",
            DOWNLOADAPPLICATION.GET.URL,
            "",
            queryStr,
            { BookingInfo: appData },
            { Accept: "application/json" },
            { responseType: "arraybuffer" }
        ).then((res) => {
            res.filestoreIds[0];
            if (res && res.filestoreIds && res.filestoreIds.length > 0) {
                res.filestoreIds.map((fileStoreId) => {
                    downloadReceiptFromFilestoreID(fileStoreId, mode);
                });
            } else {
                console.log("Error In Application Download");
            }
        });
        //   })
    } catch (exception) {
        alert("Some Error Occured while downloading Application!");
    }
};
