import { Info } from "lucide-react";
import React, { useEffect } from "react";

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
    
  }, [onClose]);

  return (
    <div className="toast toast-top toast-end">
      <div className="alert p-2 text-sm shadow-lg">
        <span className="flex items-center">
          <Info className="w-4 font-bold text-accent mr-2" />
          {message}
        </span>
      </div>
    </div>
  );
};

export default Notification;
