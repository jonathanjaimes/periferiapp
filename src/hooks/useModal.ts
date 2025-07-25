import { useState, useCallback } from "react";

export function useModal(initialVisible: boolean = false) {
    const [visible, setVisible] = useState(initialVisible);

    const openModal = useCallback(() => setVisible(true), []);
    const closeModal = useCallback(() => setVisible(false), []);

    return { visible, openModal, closeModal };
}