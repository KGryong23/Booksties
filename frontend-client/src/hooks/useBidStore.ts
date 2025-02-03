import { create } from "zustand"

type State = {
    bids: IBid[]
}

type Actions = {
    setBids: (bids: IBid[]) => void
    addBid: (bid: IBid) => void
}

export const useBidStore = create<State & Actions>((set) => ({
    bids: [],

    setBids: (bids: IBid[]) => {
        set(() => ({
            bids
        }))
    },

    addBid: (bid: IBid) => {
        set(state => ({
            bids: !state.bids.find(x => x.id === bid.id) ? [bid, ...state.bids] : [...state.bids]
        }))
    },

}))