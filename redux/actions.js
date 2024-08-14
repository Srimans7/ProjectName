export const SET_DATA = 'SET_DATA';

export const SET_TEST_FUNCTION = 'SET_TEST_FUNCTION';

export const setDb = data => dispatch => {
    dispatch({
        type: SET_DATA,
        payload: data,
    });
};

export const setTestFunction = (testFunction) => ({
  type: SET_TEST_FUNCTION,
  payload: testFunction,
});


