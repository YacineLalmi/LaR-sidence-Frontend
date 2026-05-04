"use client";

import { MoreHorizontal, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import getNotificationAction from "@/actions/dashboard/get-notifications.action";
import { Notification } from "@/schemas/notifications/notification.schema";

export function NotificationsCard() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[] | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getNotificationAction()
      .then((data) => setNotifications(data))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, []);
  if (isLoading) {
    return (
      <Card className="rounded-[40px] border-none bg-white p-8 shadow-sm">
        <div className="flex justify-between items-center px-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-[30px]" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-[40px] border-none bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center px-2">
        <h2 className="text-xl font-bold text-black">Alertes & Notifications</h2>
        <button className="flex items-center text-[#C9AF72] font-medium hover:opacity-80 transition-opacity">
          Voir tout <ChevronRight size={18} />
        </button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {notifications &&
          notifications.map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-3 rounded-[30px] border border-gray-100 bg-white">
              {/* Icon Circle */}
              <div
                className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                  item.type === "info" ? "border-[#86D3B3] text-[#86D3B3]" : "border-[#FF6B6B] text-[#FF6B6B]"
                }`}
              >
                {item.type === "info" ? <Clock size={20} /> : <AlertCircle size={20} />}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{item.title}</span>
                  <span className="text-sm text-gray-400">{item.created_at}</span>
                </div>
                <p className="text-sm text-gray-500 leading-snug">{item.message}</p>
              </div>

              {/* Options */}
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>
          ))}
      </div>
    </Card>
  );
}
