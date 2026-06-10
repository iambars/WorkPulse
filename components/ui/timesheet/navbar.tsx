import { Tab, tabs } from "@/types/timesheet";

type NavBarProps = {
  activeTab: Tab;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
};

export default function NavBar({ activeTab, setActiveTab }: NavBarProps) {
  return (
    <div className="border-secondary/20 flex border-b text-sm font-medium">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 ${
            activeTab === tab
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
