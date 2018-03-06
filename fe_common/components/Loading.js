'use strict'

import 'common/styles/loading.css'

import React from 'react';
import ClassNames from 'classnames';
import loadingImg from 'common/images/loading.gif';

import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        loading: state.app.loading.loading,
    }
}

// Get Loading State From Store
// And Control Loading State Use LoadingActions

class Loading extends React.Component {
    render () {
        let cname = ClassNames('loading', {
            'show': this.props.loading
        });
        return (
            <div className={cname}>
                <img src={loadingImg} />
            </div>
        );
    }
};

export default connect(mapStateToProps)(Loading);
