import { Tab, tabs } from "@/types/timesheet";

type NavBarProps = {
  activeTab: Tab;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
};

export default function NavBar({ activeTab, setActiveTab }: NavBarProps) {
  return (
    <div className="border-secondary/20 bg-background sticky top-0 z-10 flex w-full border-b pt-6 text-sm font-medium md:pt-8">
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
