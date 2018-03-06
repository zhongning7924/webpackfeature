'use strict'

import React from 'react';
import {connect} from 'react-redux';
import {hidePrompt} from 'common/actions/PromptAction.js';
import { Modal,Alert } from 'antd';


const mapStateToProps = (state) => {

    return state.app.prompt
}

const mapDispathToProps = (dispatch) => {
    return {
        onCancel: () => {
            dispatch(hidePrompt());
        }
    }
}
class AlertInfo extends React.Component {
    constructor(props) {
        super(props);
        this.onCancel = this.onCancel.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

    }
    onCancel() {
        if (this.props.promise && this.props.promise.reject) {
            this.props.promise.reject();
        }
        this.props.onCancel();
    }
    onSubmit() {
        if (this.props.promise) {
            if (this.props.promise.resolve) {
                this.props.promise.resolve();
            } else if ( typeof this.props.promise === 'function') {
                // promise 是一个callback
                this.props.promise()
            }
        }
        this.props.onCancel();
    }
    render() {
        let {show, type, msg} = this.props;

        return (
            <div className="prompt-content">
                <Modal
                  styl={{zIndex:999999}}
                  title="提示"
                  visible={show}
                  onOk={this.onSubmit}
                  onCancel={this.onCancel}
                   >
                   <Alert message={msg}
                   type={type}
                   showIcon
                   />
                </Modal>
            </div>
        );
    }
};

export default connect(mapStateToProps,mapDispathToProps)(AlertInfo);