export const initialState = {
    isPlaying: false,
    currentSong: null,
    queue: [],
    currentIndex: -1,
  };
  
  export function reducer(state, action) {
    switch (action.type) {
      case "SET_QUEUE":
        return {
          ...state,
          queue: action.payload,
          currentIndex: 0,
          currentSong: action.payload[0] || null,
        };
  
      case "SET_SONG": {
        const index = state.queue.findIndex(
          (song) => song._id === action.payload._id
        );
  
        if (index === -1) return state;
  
        return {
          ...state,
          currentIndex: index,
          currentSong: { ...state.queue[index] },
        };
      }
  
      case "PLAY":
        return {
          ...state,
          isPlaying: true,
        };
  
      case "PAUSE":
        return {
          ...state,
          isPlaying: false,
        };
  
      case "NEXT_SONG": {
        const nextIndex = state.currentIndex + 1;
        if (nextIndex >= state.queue.length) return state;
  
        return {
          ...state,
          currentIndex: nextIndex,
          currentSong: { ...state.queue[nextIndex] },
          isPlaying: true,
        };
      }
  
      case "PREVIOUS_SONG": {
        const prevIndex = state.currentIndex - 1;
        if (prevIndex < 0) return state;
  
        return {
          ...state,
          currentIndex: prevIndex,
          currentSong: { ...state.queue[prevIndex] },
          isPlaying: true,
        };
      }
  
      default:
        return state;
    }
  }
  