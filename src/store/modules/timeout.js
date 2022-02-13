const DELAY = 300;

export default {
    state: {
        timeout: null,
        firstFetchCall: true
    },
    mutations: {
        setLocalTimeout(state, callback) {
            if (state.firstFetchCall) {
                callback();
                state.firstFetchCall = false;
                state.timeout = setTimeout(() => {
                    state.firstFetchCall = true;
                    this.commit('clearLocalTimeout');
                }, DELAY);
                return;
            }

            state.timeout = setTimeout(() => {
                callback();
                state.firstFetchCall = true;
                this.commit('clearLocalTimeout');
            }, DELAY);
        },
        clearLocalTimeout(state) {
            clearTimeout(state.timeout);
        }
    } 
};