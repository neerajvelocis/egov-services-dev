import React, { Component } from "react";
import Image from "egov-ui-kit/components/Image";
import { connect } from "react-redux";
import get from "lodash/get";


class ImageList extends Component {
    render() {
        let style = {
            display: "inline-block",
            marginRight: "20px"
        }
        const { data } = this.props;

        return data.length > 0 ? (
            data.map((item, index) => {
                return <div style={style}> <Image size="medium" width={200} height={154} source={item.link} /></div>
            })

        ) : (
                "No Document Available."
            );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { screenConfiguration } = state;

    const data = get(
        screenConfiguration.preparedFinalObject,
        ownProps.sourceJsonPath,
        []
    );
    return { data };
};

export default connect(mapStateToProps, null)(ImageList);
