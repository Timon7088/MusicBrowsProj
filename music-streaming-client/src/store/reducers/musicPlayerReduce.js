export const initialState = {
  queue: [],
  originalQueue: [],
  currentIndex: -1,
  currentSong: null,
  isPlaying: false,
  isShuffled: false,
};
  
  export function reducer(state, action) {
    switch (action.type) {
      case "SET_QUEUE":
        return {
          ...state,
          queue: action.payload,
          originalQueue: action.payload,
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
          const newIndex = nextIndex >= state.queue.length ? 0 : nextIndex;
        
          return {
            ...state,
            currentIndex: newIndex,
            currentSong: { ...state.queue[newIndex] },
            isPlaying: true,
          };
        }
  
        case "PREVIOUS_SONG": {
          const prevIndex = state.currentIndex - 1;
          const newIndex = prevIndex < 0 ? state.queue.length - 1 : prevIndex;
        
          return {
            ...state,
            currentIndex: newIndex,
            currentSong: { ...state.queue[newIndex] },
            isPlaying: true,
          };
        }

        case "SONG_ENDED": {
          const nextIndex = state.currentIndex + 1;
          const newIndex = nextIndex >= state.queue.length ? 0 : nextIndex;

          return{
            ...state,
            currentIndex: newIndex,
            currentSong: { ...state.queue[newIndex] },
            isPlaying: true,
          };
        }

        case "TOGGLE_SHUFFLE": {
          if (!state.currentSong) return state; 
        
          if (!state.isShuffled) {
            const shuffled = [...state.queue];
            for (let i = shuffled.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
        
            const newIndex = shuffled.findIndex(song => song._id === state.currentSong._id);
        
            return {
              ...state,
              isShuffled: true,
              queue: shuffled,
              currentIndex: newIndex,
            };
          } else {
            // חזרה לתור המקורי
            const newIndex = state.originalQueue.findIndex(song => song._id === state.currentSong._id);
        
            return {
              ...state,
              isShuffled: false,
              queue: [...state.originalQueue],
              currentIndex: newIndex,
            };
          }
        }
        

      default:
        return state;
    }
  }
  