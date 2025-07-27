import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

export function useMapVisibility() {
    const [mapVisible, setMapVisible] = useState<boolean>(true);

    useFocusEffect(
        useCallback(() => {
            setMapVisible(false);
            const timeout = setTimeout(() => setMapVisible(true), 100);
            return () => clearTimeout(timeout);
        }, []),
    );

    return {mapVisible};
}