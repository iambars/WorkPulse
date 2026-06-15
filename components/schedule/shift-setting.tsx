"use client";

import { useEffect, useState } from "react";
import { SHIFT_COLORS } from "@/constants/shifts";
import { saveShifts } from "@/actions/shift";

type Shift = {
  name: string;
  startTime: string;
  endTime: string;
  color: string;
};

type ShiftSettingProps = {
  shifts: Shift[];
};

export default function ShiftSetting({ shifts }: ShiftSettingProps) {
  const [localShifts, setLocalShifts] = useState<Shift[]>([]);

  useEffect(() => {
    setLocalShifts(shifts ?? []);
  }, [shifts]);

  const updateShift = (index: number, field: keyof Shift, value: string) => {
    setLocalShifts((prev) =>
      prev.map((shift, i) =>
        i === index ? { ...shift, [field]: value } : shift,
      ),
    );
  };

  const addShift = () => {
    setLocalShifts((prev) => [
      ...prev,
      {
        name: "New Shift",
        startTime: "08:00",
        endTime: "17:00",
        color: "bg-blue-100 text-blue-800 border-blue-300",
      },
    ]);
  };

  const deleteShift = (index: number) => {
    setLocalShifts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      await saveShifts(localShifts);
      alert("Shifts saved successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to save shifts");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Shift Settings</h2>

        <button
          onClick={addShift}
          className="border-secondary/50 text-secondary rounded-2xl border px-3 py-1 text-sm hover:scale-105 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700 hover:shadow"
        >
          + Add Shift
        </button>
      </div>

      {/* Empty state */}
      {localShifts.length === 0 ? (
        <div className="rounded border p-6 text-center text-gray-500">
          <p className="mb-3">No shifts yet</p>
          <button
            onClick={addShift}
            className="rounded border px-4 py-2 text-sm"
          >
            Create your first shift
          </button>
        </div>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Start</th>
              <th className="border p-2 text-left">End</th>
              <th className="border p-2 text-left">Color</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {localShifts.map((shift, index) => (
              <tr key={index}>
                {/* Name */}
                <td className="border p-2">
                  <input
                    value={shift.name}
                    onChange={(e) => updateShift(index, "name", e.target.value)}
                    className={`w-full rounded border px-2 py-1 ${shift.color}`}
                  />
                </td>

                {/* Start */}
                <td className="border p-2">
                  <input
                    type="time"
                    value={shift.startTime}
                    onChange={(e) =>
                      updateShift(index, "startTime", e.target.value)
                    }
                    className="rounded border px-2 py-1"
                  />
                </td>

                {/* End */}
                <td className="border p-2">
                  <input
                    type="time"
                    value={shift.endTime}
                    onChange={(e) =>
                      updateShift(index, "endTime", e.target.value)
                    }
                    className="rounded border px-2 py-1"
                  />
                </td>

                {/* Color */}
                <td className="border p-2">
                  <div className="flex gap-2">
                    {SHIFT_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => updateShift(index, "color", color.value)}
                        className={`h-6 w-6 rounded-full border ${color.preview} ${
                          shift.color === color.value
                            ? "ring-2 ring-black ring-offset-2"
                            : ""
                        }`}
                      />
                    ))}
                  </div>
                </td>

                {/* Actions */}
                <td className="border p-2">
                  <button
                    onClick={() => deleteShift(index)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Save */}
      {localShifts.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="rounded border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
