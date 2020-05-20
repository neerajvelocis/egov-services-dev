"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _commons = require("../../../../ui-utils/commons");
var _commons2 = _interopRequireDefault(_commons);

var _utils = require("egov-ui-framework/ui-config/screens/specs/utils");

var _FireNocIcon = require("../../../../ui-atoms-local/Icons/FireNocIcon");

var _FireNocIcon2 = _interopRequireDefault(_FireNocIcon);

var _MyApplicationIcon = require("../../../../ui-atoms-local/Icons/MyApplicationIcon");

var _MyApplicationIcon2 = _interopRequireDefault(_MyApplicationIcon);

var _utils2 = require("../utils");

var _get = require("lodash/get");

var _get2 = _interopRequireDefault(_get);

var _set = require("lodash/set");

var _set2 = _interopRequireDefault(_set);

var _reqDocs = require("./requiredDocuments/reqDocs");

var _crypto = require("crypto");


var _getOPMSCards = require("../../../../ui-utils/commons");

var beforeInitScreen = require("../../../../ui-redux/screen-configuration/middlewares/beforeInitScreen");
var _beforeInitScreen = _interopRequireDefault(beforeInitScreen);
//alert(JSON.stringify(beforeInitScreen))
//alert('Hi')

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var header = (0, _utils.getCommonHeader)({
  labelName: "Fire Noc",
  labelKey: "ACTION_TEST_FIRE_NOC"
}, {
  classes: {
    root: "common-header-cont"
  }
});


const landingcards = async () => {
	const response =  _getOPMSCards
};

//var landingcards = (0, _commons2.getOPMSCards)();

console.log("OPMS cards")
console.log(landingcards)

var cardItems = [{
  label: {
    labelKey: "NOC_APPLY",
    labelName: "Apply for Fire Noc"
  },
  icon: _react2.default.createElement(_FireNocIcon2.default, null),
  route: {
    screenKey: "landing",
    jsonPath: "components.adhocDialog"
  }
}, {
  label: {
    labelKey: "NOC_MY_APPLICATIONS",
    labelName: "My Applications"
  },
  icon: _react2.default.createElement(_MyApplicationIcon2.default, null),
  route: "opms-landing"
}];

var tradeLicenseSearchAndResult = {
  uiFramework: "material-ui",
  name: "landing",
  beforeInitScreen: function _beforeInitScreen(action, state, dispatch) {
    (0, _utils2.getRequiredDocData)(action, state, dispatch).then(function () {
      var documents = (0, _get2.default)(state, "screenConfiguration.preparedFinalObject.searchScreenMdmsData.FireNoc.Documents", []);
      (0, _set2.default)(action, "screenConfig.components.adhocDialog.children.popup", (0, _reqDocs.getRequiredDocuments)(documents));
    });
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        applyCard: {
          uiFramework: "custom-molecules",
          componentPath: "LandingPage",
          props: {
            items: cardItems,
            history: {}
          }
        },
        listCard: {
          uiFramework: "custom-molecules-local",
          moduleName: "egov-noc",
          componentPath: "HowItWorks"
        }
      }
    },
    // cityPickerDialog: {
    //   componentPath: "Dialog",
    //   props: {
    //     open: false,
    //     maxWidth: "md"
    //   },
    //   children: {
    //     dialogContent: {
    //       componentPath: "DialogContent",
    //       props: {
    //         style: { minHeight: "180px", minWidth: "365px" }
    //       },
    //       children: {
    //         popup: cityPicker
    //       }
    //     }
    //   }
    // }
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-noc",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "landing"
      },
      children: {
        popup: {}
      }
    }
  }
};

exports.default = tradeLicenseSearchAndResult;