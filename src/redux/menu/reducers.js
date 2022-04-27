import actions from './actions'

const initialState = {
  menuLeftData: [],
  menuTopData: [],
}

export default function menuReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
