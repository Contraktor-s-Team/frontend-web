import { useState } from "react";
import Button from "../../../components/Button/Button";

const settingsList = [
  {
    title: "Job Updates",
    description:
      "Get notified about changes in your job status — including acceptance, reschedules, or cancellations.",
    default: true,
  },
  {
    title: "New Quotes Received",
    description:
      "Be instantly alerted when an artisan responds to your job post with a quote.",
    default: false,
  },
  {
    title: "Payment Notifications",
    description:
      "Stay updated on payments — from successful transactions to pending balances and wallet funding.",
    default: true,
  },
  {
    title: "Job Progress Alerts",
    description:
      "Track key milestones: when the artisan is en route, task starts, completion, and reviews.",
    default: true,
  },
  {
    title: "Promo & Announcements",
    description:
      "Receive exclusive offers, updates on new features, or special platform announcements.",
    default: true,
  },
  {
    title: "Security Alerts",
    description:
      "Be notified of any login activity, password changes, or suspicious attempts.",
    default: true,
  },
];

const Notifications = () => {
  const [settings, setSettings] = useState(
    settingsList.map((item) => item.default)
  );

  const toggleSetting = (index) => {
    const updated = [...settings];
    updated[index] = !updated[index];
    setSettings(updated);
  };

  return (
    <div className="bg-white p-6 rounded-lg">
            <div className="max-w-2xl">
      {settingsList.map((setting, index) => (
        <div
          key={setting.title}
          className="flex items-start justify-between first:pt-0 py-6 border-b border-neu-light-3 last:border-b-0"
        >
          <div className="max-w-md">
            <h3 className="text-sm font-semibold text-gray-900 mb-5">
              {setting.title}
            </h3>
            <p className="text-sm text-gray-500">{setting.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Toggle */}
            <button
              onClick={() => toggleSetting(index)}
              className={`w-11 h-6 flex items-center ${
                settings[index] ? "bg-success-norm-1" : "bg-neu-norm-1"
              } rounded-full p-1 transition-colors duration-300`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  settings[index] ? "translate-x-5" : "translate-x-0"
                }`}
              ></div>
            </button>

            {/* Status */}
            <span className="text-sm font-medium text-gray-900">
              {settings[index] ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      ))}

      <Button variant='primary' className='capitalize mt-15 px-6 py-3.25'>
        save changes
      </Button>
    </div>
    </div>
  );
};

export default Notifications;
