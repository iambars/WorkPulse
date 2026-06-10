"use client";

import { useState } from "react";
import {
  NavBar,
  ScheduleTable,
  TimesheetTable,
} from "@/components/ui/timesheet";
import { Tab } from "@/types/timesheet";

export default function TimesheetPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Attendance");
  const tabContent: Record<Tab, React.ReactNode> = {
    Attendance: <TimesheetTable />,
    Schedule: <ScheduleTable />,
    Adjustments: <div>Adjustments</div>,
    Summary: <div>Summary</div>,
    Preferences: <div>Preferences</div>,
  };

  return (
    <div className="w-full">
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="pt-12">{tabContent[activeTab]}</div>
    </div>
  );
}
