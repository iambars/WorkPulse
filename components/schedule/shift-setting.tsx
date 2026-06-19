"use client";

import { useEffect, useRef, useState } from "react";
import { SHIFT_COLORS } from "@/constants/shifts";
import { saveShifts } from "@/actions/shift";

import { useRouter } from "next/navigation";
import { deleteShiftAction } from "@/actions/delete-shift";

type Shift = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  color: string;
};

type ShiftSettingProps = {
  shifts: Shift[];
  open: boolean;
  setShifts: React.Dispatch<React.SetStateAction<Shift[]>>;
  usedShiftIds: Set<string | null>;
};

export default function ShiftSetting({
  shifts,
  open,
  setShifts,
  usedShiftIds,
}: ShiftSettingProps) {
  const router = useRouter();
  const initialShiftsRef = useRef<Shift[]>([]);

  // Check if there's any changes with the shifts[]
  const hasChanges =
    JSON.stringify(shifts) !== JSON.stringify(initialShiftsRef.current);

  // Take snapshot of the original shifts
  useEffect(() => {
    initialShiftsRef.current = structuredClone(shifts ?? []);
  }, []);

  const updateShift = (
    identifier: string,
    field: keyof Shift,
    value: string,
  ) => {
    setShifts((prev) =>
      prev.map((shift) =>
        shift.id === identifier ? { ...shift, [field]: value } : shift,
      ),
    );
  };

  const addShift = () => {
    setShifts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(), // temporary client ID
        name: "New Shift",
        startTime: "08:00",
        endTime: "17:00",
        color: "bg-blue-100 text-blue-800 border-blue-300",
      },
    ]);
  };

  const deleteShift = async (identifier: string) => {
    const res = await deleteShiftAction(identifier);
    if (!res.ok) {
      alert(res?.message || "Failed to delet the shift");
      return;
    }
    alert("Shift successfully deleted");
    setShifts((prev) => prev.filter((shift) => shift.id !== identifier));
    router.refresh();
  };

  const handleSave = async () => {
    try {
      const result = await saveShifts(shifts);

      if (!result.ok) {
        alert(result.message);
        return;
      }

      alert("Shifts saved successfully");
      initialShiftsRef.current = structuredClone(shifts);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to save shifts");
    }
  };

  if (!open) return null;

  return (
    <div className="flex w-full flex-col gap-4 rounded-3xl bg-white p-6 shadow">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Shift Settings</h2>

        <button
          onClick={addShift}
          className="border-secondary/50 rounded-2xl border px-3 py-1 text-sm transition duration-300 hover:scale-105 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700 hover:shadow"
        >
          + Add Shift
        </button>
      </div>

      {/* Empty state */}
      {shifts.length === 0 ? (
        <div className="border-secondary/50 rounded-xl border p-6 text-center text-gray-500">
          <p className="mb-3">No shifts yet</p>
          <button
            onClick={addShift}
            className="border-secondary/20 hover:border-secondary/80 hover:text-primary rounded-xl border px-4 py-2 text-sm transition duration-500 hover:scale-105"
          >
            Create your first shift
          </button>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Start</th>
              <th className="p-2 text-left">End</th>
              <th className="p-2 text-left">Color</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {shifts.map((shift) => {
              const isUsed = shift.id ? usedShiftIds.has(shift.id) : false;

              return (
                <tr key={shift.id}>
                  {/* Name */}
                  <td className="border p-2">
                    <input
                      value={shift.name}
                      onChange={(e) =>
                        updateShift(shift.id, "name", e.target.value)
                      }
                      className={`w-full rounded border px-2 py-1 ${shift.color}`}
                    />
                  </td>

                  {/* Start */}
                  <td className="border p-2">
                    <input
                      type="time"
                      value={shift.startTime}
                      onChange={(e) =>
                        updateShift(shift.id, "startTime", e.target.value)
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
                        updateShift(shift.id, "endTime", e.target.value)
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
                          onClick={() =>
                            updateShift(shift.id, "color", color.value)
                          }
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
                      onClick={() => deleteShift(shift.id)}
                      disabled={shifts.length <= 1 || isUsed}
                      className={`${
                        shifts.length <= 1 || isUsed
                          ? "cursor-not-allowed text-gray-400"
                          : "text-red-500 hover:underline"
                      }`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
            hasChanges ? "hover:bg-gray-50" : "cursor-not-allowed opacity-50"
          } `}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
