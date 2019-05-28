const state = {
  uploading: false,
  progress:0
}

const mutations = {
  change_upload_state (state,st) {
    state.uploading = st
  },
  update_progress (state,progress) {
    state.progress = progress
  }
}

const actions = {
  uplaodState ({ commit },st) {
    commit('change_upload_state',st)
  },
  uploadProgress({commit},progress){
    commit('update_progress',progress)
  }
}

export default {
  state,
  mutations,
  actions
}
