import { fromJS } from 'immutable';

const initialState = fromJS({
  'records': [],
  'nextPageId': null,
  'isFetching': true,
  'isFetchingError': false,
  'isNextPageFetching': false,
  'isNextPageFetchingError': false
});

export default function(state = initialState, action) {
  switch(action.type) {
    case 'FETCH_USER_LIST_INIT':
      return state.merge({
        'isFetching': true,
        'isFetchingError': false
      });

    case 'FETCH_USER_LIST_SUCCESS':
      // Destructuring assignment after variables have already been declared
      // needs the statement to be enclosed in a parentheses:
      // Source: http://stackoverflow.com/a/34836155
      const records = action.data.data;
      const nextPageId = action.data.next_max_id;
      return state.merge({
        'isFetching': false,
        'isFetchingError': false,
        'records': records,
        nextPageId
      });

    case 'FETCH_USER_LIST_ERROR':
      return state.merge({
        'isFetching': false,
        'isFetchingError': true
      });
  }

  return state;
}
