export const testReducer = (state = {name: 'Just A Test!'}, action) => {
  if (action?.type === 'TEST') return action.payload;
  return state;
};
