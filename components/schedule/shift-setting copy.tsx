"use client";

import { useEffect } from "react";
import { SHIFT_COLORS } from "@/constants/shifts";
import { saveShifts } from "@/actions/shift";
import { useRouter } from "next/navigation";

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
  usedShiftIds: Set<string>;
};

export default function ShiftSetting({
  shifts,
  open,
  setShifts,
  usedShiftIds,
}: ShiftSettingProps) {
  const router = useRouter();

  // Initialize only at the start thus []
  useEffect(() => {
    setShifts(shifts ?? []);
  }, []);

  const updateShift = (
    identifier: string | number,
    field: keyof Shift,
    value: string,
  ) => {
    setShifts((prev) =>
      prev.map((shift, i) => {
        const match =
          typeof identifier === "string"
            ? shift.id === identifier
            : i === identifier;

        return match ? { ...shift, [field]: value } : shift;
      }),
    );
  };

  const addShift = () => {
    setShifts((prev) => [
      ...prev,
      {
        id: shifts?.id,
        name: "New Shift",
        startTime: "08:00",
        endTime: "17:00",
        color: "bg-blue-100 text-blue-800 border-blue-300",
      },
    ]);
  };

  const deleteShift = (identifier: string | number) => {
    setShifts((prev) =>
      prev.filter((shift, i) => {
        return typeof identifier === "string"
          ? shift.id !== identifier
          : i !== identifier;
      }),
    );
  };

  const handleSave = async () => {
    try {
      const result = await saveShifts(shifts);

      if (!result.ok) {
        alert(result.message);
        return;
      }
      alert("Shifts saved successfully");
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
          className="border-secondary/50 text-secondary tansition rounded-2xl border px-3 py-1 text-sm duration-300 hover:scale-105 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700 hover:shadow"
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
            className="border-secondary/20 hover:border-secondary/80 hover:text-primary rounded-xl border px-4 py-2 text-sm transition duration-500 ease-in-out hover:scale-105"
          >
            Create your first shift
          </button>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Start</th>
              <th className="p-2 text-left">End</th>
              <th className="p-2 text-left">Color</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {shifts.map((shift, index) => {
              const isUsed = usedShiftIds.has(shift.id);

              return (
                <tr key={shift.id ?? index}>
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
                        updateShift(
                          shift.id ?? index,
                          "startTime",
                          e.target.value,
                        )
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
                        updateShift(
                          shift.id ?? index,
                          "endTime",
                          e.target.value,
                        )
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
                            updateShift(shift.id ?? index, "color", color.value)
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
                      onClick={() => deleteShift(shift.id ?? index)}
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
          className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
