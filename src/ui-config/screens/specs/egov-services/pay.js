import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getCommonTitle,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import set from "lodash/set";
import { getCurrentFinancialYear, generateBill, showHideAdhocPopup } from "../utils";
import { paymentGatewaySelectionPopup } from "./payResource/adhocPopup";
import capturePaymentDetails from "./payResource/capture-payment-details";
import estimateDetails from "./payResource/estimate-details";
import { footer, callPGService } from "./payResource/footer";
import g8Details from "./payResource/g8-details";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, getPaymentGateways, getSearchResultsView } from "../../../../ui-utils/commons";
import { httpRequest } from "../../../../ui-utils";

import { getUserInfo, getTenantId, getapplicationType, localStorageGet, lSRemoveItem, lSRemoveItemlocal } from "egov-ui-kit/utils/localStorageUtils";
const header = getCommonContainer({
  header: getCommonHeader({
    //labelName: `Application for ${getapplicationType()} - (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    //labelKey: "NOC_COMMON_APPLY_NOC"
    // labelName: `Application for ${getapplicationType().substring(0,getapplicationType().length -3)} NOC - (${getCurrentFinancialYear()})` //later use getFinancialYearDates
    labelName: `Application for ${getapplicationType()}` //later use getFinancialYearDates
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-services",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber")
    }
  }
});


const setSearchResponse = async (
  state,
  action,
  dispatch,
  applicationNumber,
  tenantId
) => {
  const response = await getSearchResultsView([
      { key: "tenantId", value: tenantId },
      { key: "applicationNumber", value: applicationNumber },
  ]);
  let recData = get(response, "bookingsModelList", []);
  dispatch(
      prepareFinalObject("Booking", recData.length > 0 ? recData[0] : {})
  );
  dispatch(
      prepareFinalObject("BookingDocument", get(response, "documentMap", {}))
  );

  await generateBill(state, dispatch, applicationNumber, tenantId, recData[0].bkBookingType);
};


const setPaymentMethods = async (action, state, dispatch) => {
  const response = await getPaymentGateways();
  if(!!response.length) {
    const paymentMethods = response.map(item => ({
      label: { labelName: item,
      labelKey: item},
      link: () => callPGService(state, dispatch, item)
    }))
    set(action, "screenConfig.components.div.children.footer.children.makePayment.props.data.menu", paymentMethods)
  }
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "pay",
  beforeInitScreen: (action, state, dispatch) => {
    let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    let tenantId = getQueryArg(window.location.href, "tenantId");
    setPaymentMethods(action, state, dispatch)
    setSearchResponse(state, action, dispatch, applicationNumber, tenantId);

    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "pay"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...header
            }
          }
        },
        formwizardFirstStep: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          children: {
            paymentDetails: getCommonCard({
              header: getCommonTitle({
                labelName: "Payment Collection Details",
                labelKey: "NOC_PAYMENT_HEAD"
              }),
              // paragraph: getCommonParagraph({
              //   labelName: ""
              // }),
              estimateDetails,
              // addPenaltyRebateButton: {
              //   componentPath: "Button",
              //   props: {
              //     color: "primary",
              //     style: {}
              //   },
              //   // children: {
              //   //   previousButtonLabel: getLabel({
              //   //     labelName: "ADD REBATE/PENALTY",
              //   //     labelKey: "NOC_PAYMENT_ADD_RBT_PEN"
              //   //   })
              //   // },
              //   onClickDefination: {
              //     action: "condition",
              //     callBack: (state, dispatch) => showHideAdhocPopup(state, dispatch, "pay")
              //   }
              // },
              // viewBreakupButton: getDialogButton(
              //   "VIEW BREAKUP",
              //   "PM_PAYMENT_VIEW_BREAKUP",
              //   "pay"
              // ),
             // capturePaymentDetails,
            //  g8Details
            })
          }
        },
        footer
      }
    }
  }
};

export default screenConfig;
