"use client";

import React, { useContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationContext from "@/context/NotificationContext";

export const Notification = () => {
  const { notification, hideNotification } = useContext(NotificationContext);

  useEffect(() => {
    if (!notification) return;

    const baseStyle = {
      borderRadius: "8px",
      padding: "20px",
      fontFamily: `"Montserrat", Helvetica, Arial, sans-serif`,
      fontWeight: 500,
      maxWidth: "400px",
      width: "calc(100vw - 10px)",
      // marginLeft: "5px",
      // marginRight: "5px",
    };

    if (notification.status === "error") {
      toast.error(notification.message, {
        toastId: "error-toast",
        position: "top-right",
        autoClose: 8000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          ...baseStyle,
          borderLeft: "8px solid #dc3545",
          backgroundColor: "#f8d7da",
          color: "#dc3545",
        },
      });
    } else if (notification.status === "success") {
      toast.success(notification.message, {
        toastId: "success-toast",
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          ...baseStyle,
          borderLeft: "8px solid #28a745",
          backgroundColor: "#e6f4ea",
          color: "#28a745",
        },
      });
    }

    const timer = setTimeout(() => {
      hideNotification();
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification, hideNotification]);

  return (
    <ToastContainer
      style={{
        maxWidth: "400px",
        width: "calc(100vw - 10px)",
        marginLeft: "5px",
        marginRight: "5px",
      }}
    />
  );
};
