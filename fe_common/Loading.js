'use strict'

import '../styles/loading.css'

import React from 'react';
import ClassNames from 'classnames';
import loadingImg from '../images/loading.gif';

import { connect } from 'react-redux';
import { userLogin } from '../actions/UserActions.js';

const mapStateToProps = (state) => {
    return {
        loading: state.loading.loading,
    }
}

// Get Loading State From Store
// And Control Loading State Use LoadingActions

class Loading extends React.Component {
    render: function () {
        let cname = ClassNames('loading', {
            'show': this.props.loading
        });
        return (
            <div className={cname}>
                <img src={loadingImg} />
            </div>
        );
    }
});

export default connect(mapStateToProps)(loading);
