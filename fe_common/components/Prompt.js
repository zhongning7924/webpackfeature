'use strict'


import React from 'react';
import ClassNames from 'classnames';

import {connect} from 'react-redux';
import {hidePrompt} from 'common/actions/PromptAction.js';


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

const types = ['info', 'success', 'warning', 'error'];

// Get State From Store
// And Control State Use PromptActions

class prompt extends React.Component {
    constructor(props) {
        super(props);
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
        if (types.indexOf(type) < 0) {
            type = types[0];
        }
        return (
            <div className={ClassNames('prompt-modal-wrapper', {'hide': !show})}>
                <div className={ClassNames('modal-backdrop fade', {'in': show})}></div>
                <div className={ClassNames('modal fade show', {'in': show})} role='dialog'>
                    <div className='modal-dialog modal-sm'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h4 className='modal-title'>提示</h4>
                            </div>
                            <div className='modal-body'>
                                <p className={'alert-msg alert-msg-' + type}>
                                    {msg}
                                </p>
                            </div>
                            <div className='modal-footer'>
                                <button type='button' 
                                    className={ClassNames('btn btn-default', {'hide': type !== 'warning'})}
                                    onClick={this.onCancel}>取消</button>
                                <button type='button' 
                                    className='btn btn-primary'
                                    onClick={this.onSubmit}>确定</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default connect(mapStateToProps,mapDispathToProps)(prompt);