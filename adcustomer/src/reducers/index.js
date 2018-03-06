
import {combineReducers} from 'redux';
import loading from  'common/reducers/LoadingReducer';
import prompt from 'common/reducers/PromptReducer';
// import prompt from 'public/reducers/PromptReducer.js';
import user from 'common/reducers/UserReducer.js';
import { customerlist,adpositionlist,rechargelist,addatelist } from 'reducers/customerInfoReducer.js'
import 'styles/common.css'
const app = combineReducers({
 
    loading,
    prompt,
    user,
    customerlist,
    adpositionlist,
    rechargelist,
    addatelist,
    
});
export default app;