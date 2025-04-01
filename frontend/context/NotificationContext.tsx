import React, { createContext, useState, ReactNode } from "react";

interface NotificationData {
    message: string;
    status: string;
}

interface ContextType {
    notification: NotificationData | null;
    showNotification: (notificationData: NotificationData) => void;
    hideNotification: () => void;
}

const initialContext: ContextType = {
    notification: null,
    showNotification: () => {},
    hideNotification: () => {}
};

const NotificationContext = createContext<ContextType>(initialContext);

export default NotificationContext;

interface NotificationProviderProps {
    children: ReactNode;
}

export function NotificationContextProvider(props: NotificationProviderProps) {
    const [activeNotification, setActiveNotification] = useState<NotificationData | null>(null);
    function showNotificationHandler(notificationData: NotificationData) {
        setActiveNotification(notificationData);
    }
    function hideNotificationHandler() {
        setActiveNotification(null);
    }
    const context: ContextType = {
        notification: activeNotification,
        showNotification: showNotificationHandler,
        hideNotification: hideNotificationHandler
    };
    return (
        <NotificationContext.Provider value={context}>
            {props.children}
        </NotificationContext.Provider>
    );
}
