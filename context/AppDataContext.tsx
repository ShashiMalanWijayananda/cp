import React, {createContext, ReactNode, useContext, useReducer} from "react";
import {initialState, seatReducer, SeatState} from "../src/Pages/SeatMap/seat-map.reducer";
import {SeatActions} from "../src/Pages/SeatMap/seat-map.actions";


interface SeatContextType {
    state: SeatState;
    dispatch: React.Dispatch<SeatActions>;
}

const AppContext = createContext<SeatContextType | undefined>(undefined);

export const SeatContextProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [state, dispatch] = useReducer(seatReducer, initialState);

    return (
        <AppContext.Provider value={{state, dispatch}}>
            {children}
        </AppContext.Provider>
    );
};

export const useSeatContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useSeatContext must be used within an AppContextProvider");
    }
    return context;
};
