import { fromJS } from 'immutable';

const initialState = fromJS({
  'records': [],
  'isRefreshing': false,
  'isFetching': true,
  'isFetchingError': false
});

export default function(state = initialState, action) {
  switch(action.type) {
    case 'FETCH_USER_ALL_LIST_INIT':
      const isRefreshing = action.params.noCache ? true : false;
      const isFetching = action.params.noCache ? false : true;
      return state.merge({
        'isFetchingError': false,
        isFetching,
        isRefreshing
      });

    case 'FETCH_USER_ALL_LIST_SUCCESS':
      // Destructuring assignment after variables have already been declared
      // needs the statement to be enclosed in a parentheses:
      // Source: http://stackoverflow.com/a/34836155
      const records = action.data.data;
      return state.merge({
        'isRefreshing': false,
        'isFetching': false,
        'isFetchingError': false,
        'records': records
      });

    case 'FETCH_USER_ALL_LIST_ERROR':
      const isLoggedOut = action.response && action.response.code === 1;
      return state.merge({
        'isRefreshing': false,
        'isFetching': false,
        'isFetchingError': true,
        isLoggedOut
      });

    case 'FAVORITE_LIST_INIT':
      newRecords = state.get('records').map((list) => {
        if (list.get('list_id') === action.params.list.list_id) {
          return list.merge({
            'is_favorited': true
          });
        }
        return list;
      });

      return state.merge({
        'records': newRecords
      });

    case 'FAVORITE_LIST_ERROR':
      newRecords = state.get('records').map((list) => {
        if (list.get('list_id') === action.params.list.list_id) {
          return list.merge({
            'is_favorited': false
          });
        }
        return list;
      });

      return state.merge({
        'records': newRecords
      });

    case 'UNFAVORITE_LIST_INIT':
      newRecords = state.get('records').map((list) => {
        if (list.get('list_id') === action.params.list.list_id) {
          return list.merge({
            'is_favorited': false
          });
        }
        return list;
      });

      return state.merge({
        'records': newRecords
      });

    case 'UNFAVORITE_LIST_ERROR':
      newRecords = state.get('records').map((list) => {
        if (list.get('list_id') === action.params.list.list_id) {
          return list.merge({
            'is_favorited': true
          });
        }
        return list;
      });

      return state.merge({
        'records': newRecords
      });
  }

  return state;
}
