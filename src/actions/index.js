import api from '../api/core';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

const Handlers = {
  'fetchStatusForList': {
    build(data, params) {
      return {
        'type': 'FETCH_STATUS_FOR_LIST_BUILD_SCHEMA',
        data,
        params
      };
    },

    init(params) {
      return {
        'type': 'FETCH_STATUS_FOR_LIST_INIT',
        params
      };
    },

    success(data, params) {
      return {
        'type': 'FETCH_STATUS_FOR_LIST_SUCCESS',
        data,
        params
      };
    },

    error(params) {
      return {
        'type': 'FETCH_STATUS_FOR_LIST_ERROR',
        params
      };
    }
  },
  'fetchUserLists': {
    init(params) {
      return {
        'type': 'FETCH_STATUS_FOR_USER_LIST_INIT',
        params
      };
    },

    success(data, params) {
      return {
        'type': 'FETCH_STATUS_FOR_USER_LIST_SUCCESS',
        data,
        params
      };
    },

    error(params) {
      return {
        'type': 'FETCH_STATUS_FOR_USER_LIST_ERROR',
        params
      };
    }
  },
  'doAction': {
    init(params) {
      return {
        'type': 'DO_ACTION_INIT',
        params
      };
    },

    success(data, params) {
      return {
        'type': 'DO_ACTION_SUCCESS',
        data,
        params
      };
    },

    error(params) {
      return {
        'type': 'DO_ACTION_ERROR',
        params
      };
    }
  }
};


const Actions = {
  fetchStatusForList(params) {
    return (dispatch) => {
      dispatch(Handlers.fetchStatusForList.init(params));
      return api.fetchStatusForList(params.listId)
        .then(checkStatus)
        .then(parseJSON)
        .then((json) => {
          dispatch(Handlers.fetchStatusForList.success(json, params));
        })
        .catch((error) => {
          const onComplete = function onComplete() {
            dispatch(Handlers.fetchStatusForList.error(params));
          };

          if (error && error.response && error.response.json) {
            error.response.json().then(onComplete);
          } else {
            onComplete();
          }
        });
    };
  },
  fetchUserLists(params) {
    return (dispatch) => {
      dispatch(Handlers.fetchUserLists.init(params));
      return api.fetchUserLists(params.listId)
        .then(checkStatus)
        .then(parseJSON)
        .then((json) => {
          dispatch(Handlers.fetchUserLists.success(json, params));
          dispatch(Handlers.fetchStatusForList.build(json, params));
        })
        .catch((error) => {
          const onComplete = function onComplete() {
            dispatch(Handlers.fetchUserLists.error(params));
          };

          if (error && error.response && error.response.json) {
            error.response.json().then(onComplete);
          } else {
            onComplete();
          }
        });
    };
  },
  doAction(params) {
    return (dispatch) => {
      dispatch(Handlers.doAction.init(params));
      return api.doAction(params)
        .then(checkStatus)
        .then(parseJSON)
        .then((json) => {
          dispatch(Handlers.doAction.success(json, params));
        })
        .catch((error) => {
          const onComplete = function onComplete() {
            dispatch(Handlers.doAction.error(params));
          };

          if (error && error.response && error.response.json) {
            error.response.json().then(onComplete);
          } else {
            onComplete();
          }
        });
    };
  }
};

export default Actions;
