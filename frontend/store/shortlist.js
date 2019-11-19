export const state = () => ({
  items: [],
  addedIDs: {}, // Allows us to quickly check if a place is in the list
  lastSearch: '' // Keeps track of the last zipcode user searched for
})

export const mutations = {
  ADD(state, item) {
    // Only add an item to the shortlist if it hasn't already been added
    if (!state.addedIDs[item.id.toString()]) {
      // Adde the object's id to the map
      const newObj = Object.assign({}, state.addedIDs)
      newObj[item.id.toString()] = true
      state.addedIDs = newObj

      state.items = state.items.concat([item])
    }
  },
  REMOVE(state, item) {
    const newObj = Object.assign({}, state.addedIDs)
    delete newObj[item.id.toString()]
    state.addedIDs = newObj

    state.items = state.items.filter(obj => obj.id !== item.id)
  },
  SET_LAST_SEARCH(state, zip) {
    state.lastSearch = zip
  }
}

export const actions = {
  add({ commit }, item) {
    commit('ADD', item)
  },
  remove({ commit }, item) {
    commit('REMOVE', item)
  },
  setLastSearch({ commit }, zip) {
    commit('SET_LAST_SEARCH', zip)
  }
}
