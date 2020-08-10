
import { NOCApplication, NOCCalendar } from "./checkAvailabilityForm";

import { prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import { getCommonContainer, getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  getFileUrlFromAPI,
  getQueryArg,
  getTransformedLocale,
  setBusinessServiceDataToLocalStorage,
} from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";


// export const callBackForBook = (state, dispatch) => {

//   let from = get(
//     state,
//     "screenConfiguration.preparedFinalObject.Check.fromDate",
//     {}
//   );

//   let to = get(
//     state,
//     "screenConfiguration.preparedFinalObject.Check.toDate",
//     {}
//   );
//   const appendUrl =
//     process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
//   const reviewUrl = `${appendUrl}/egov-services/applycommercialground?from=${from}&to=${to}`;
//   dispatch(setRoute(reviewUrl));

// };

const getMdmsData = async (action, state, dispatch) => {

  try {
    let payload = {};

    payload.sector = [
      { id: 1, code: 'SECTOR-17', tenantId: 'ch.chandigarh', name: 'SECTOR-17', active: true },
      { id: 2, code: 'EG_SECTOR_34', tenantId: 'ch.chandigarh', name: 'EG_SECTOR_34', active: true },
      { id: 2, code: 'MANIMAJRA', tenantId: 'ch.chandigarh', name: 'MANIMAJRA', active: true }
    ]


    console.log(payload.sector, "payload.MdmsRes");

    dispatch(prepareFinalObject("calendarScreenMdmsData", payload));
  } catch (e) {
    console.log(e);
  }
};

export const prepareEditFlow = async (
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
  if (applicationNumber) {
      let response = await getSearchResultsView([
          { key: "tenantId", value: tenantId },
          { key: "applicationNumber", value: applicationNumber },
      ]);
      setapplicationNumber(applicationNumber);
      setApplicationNumberBox(state, dispatch, applicationNumber);

      // let Refurbishresponse = furnishOsbmResponse(response);
      dispatch(prepareFinalObject("Booking", response.bookingsModelList[0]));

      console.log(response, "responseNew");

      let fileStoreIds = Object.keys(response.documentMap);
      let fileStoreIdsValue = Object.values(response.documentMap);
      if (fileStoreIds.length > 0) {
          let fileUrls =
              fileStoreIds.length > 0
                  ? await getFileUrlFromAPI(fileStoreIds)
                  : {};
          dispatch(
              prepareFinalObject("documentsUploadReduxOld.documents", [
                  {
                      fileName: fileStoreIdsValue[0],
                      fileStoreId: fileStoreIds[0],
                      fileUrl: fileUrls[fileStoreIds[0]],
                  },
              ])
          );
      }
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "checkavailability",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
  );
  const tenantId = getQueryArg(window.location.href, "tenantId");
    getMdmsData(action, state, dispatch).then(response => {

    });

    if (applicationNumber !== null) {
      set(
          action.screenConfig,
          "components.div.children.headerDiv.children.header.children.applicationNumber.visible",
          true
      );
      prepareEditFlow(state, dispatch, applicationNumber, tenantId);
  }

    dispatch(prepareFinalObject("bookingCalendar.moduleName", "Calendar"));
    dispatch(prepareFinalObject("bookingCalendar.sector", ""));
    dispatch(prepareFinalObject("bookingCalendar.toDateToDisplay", ""));
    dispatch(prepareFinalObject("bookingCalendar.fromDateToDisplay", ""));
    dispatch(prepareFinalObject("bookingCalendar.allowClick", "false"));
    return action;
  },
  components: {


    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css",
        id: "search"
      },
      children: {
        NOCApplication,
        NOCCalendar
      }
    },
    // body: getCommonCard({
    //   Calendar: getCommonContainer({
    //     bookingClander: {
    //       uiFramework: "custom-atoms-local",
    //       moduleName: "egov-services",
    //       componentPath: "BookingCalendar",
    //       props: {
    //         open: false,
    //         maxWidth: false,
    //         screenKey: "bookingCalendar",
    //         reservedDays: ['2020-07-01', '2020-07-04'],
    //       },
    //       children: {
    //         popup: {},

    //       },
    //     },

    //     bookButton: {
    //       componentPath: "Button",
    //       props: {
    //         variant: "contained",
    //         color: "primary",
    //         style: {
    //           //minWidth: "200px",
    //           height: "48px",
    //           marginLeft: "786px"
    //         }

    //       },
    //       children: {
    //         submitButtonLabel: getLabel({
    //           labelName: "Book",
    //           labelKey: "BK_PCCBH_BOOK_LABEL"
    //         }),

    //       },
    //       onClickDefination: {
    //         action: "condition",
    //         callBack: () => { window.alert("yoyo") }
    //       },
    //       visible: true,
    //     }
    //   })

    // }),
    // bookButton: {
    //   componentPath: "Button",
    //   props: {
    //     variant: "contained",
    //     color: "primary",
    //     style: {
    //       // minWidth: "200px",
    //       height: "48px",
    //       marginRight: "16px"
    //     }
    //   },

    //   children: {
    //     // previousButtonIcon: {
    //     //     uiFramework: "custom-atoms",
    //     //     componentPath: "Icon",
    //     //     props: {
    //     //         iconName: "keyboard_arrow_left"
    //     //     }
    //     // },
    //     submitButtonLabel: getLabel({
    //       labelName: "BOOK ",
    //       labelKey: "BK_CGB_BOOK_LABEL"
    //     })
    //   },
    //   onClickDefination: {
    //     action: "condition",
    //     callBack: callBackForBook
    //   },
    //   visible: false
    // },

  },
};


export default screenConfig;