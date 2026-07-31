import React, { useContext, useState } from "react";
import { TaskPriority, TaskStatus } from "./lib/Task";
import { separateByCamelCase } from "./lib/util";
import { UnifiedStaticData } from "./lib/unifiedStaticData";
import { produce } from "immer";
import type { TaskData } from "./lib/networking/sendTask";
import sendTask from "./lib/networking/sendTask";
import { FirestoreError, Timestamp } from "firebase/firestore";
import { fullUpdateTask } from "./lib/networking/updateTask";

const statusOptions = Object.keys(TaskStatus).map((v) => separateByCamelCase(v));
const priorityOptions = Object.keys(TaskPriority).map((v) => separateByCamelCase(v));

type FormData = {
  status: number;
  name: string;
  subteam: number;
  priority: number;
  part: string;
  qty: string;
  due: string;
  fscn: string;
};

type ValidationErrors = Partial<Record<keyof FormData, string>>;

const initialForm: FormData = {
  status: -1,
  name: "",
  subteam: -1,
  priority: 0,
  part: "",
  qty: "",
  due: "",
  fscn: ""
};

export default function TaskAdder() {
  const unifiedStaticState = useContext(UnifiedStaticData);

  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>();
  const [eligibleForAdd, setEligibleForAdd] = useState<boolean>(false);

  function updateField<K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) {
    setForm(produce((draft) => {
      draft[key] = value;
    }));
    if (key == "part" || key == "fscn") {
      setEligibleForAdd(false);
    }
  }

  function validate(values: FormData): ValidationErrors {
    const issues: ValidationErrors = {};

    if (values.status < 0)
      issues.status = "Please select a status.";

    if (!values.fscn.trim())
      issues.fscn = "Please select a machine.";

    if (!values.name.trim())
      issues.name = "Field cannot be empty.";

    if (values.subteam < 0)
      issues.subteam = "Please select a subteam.";

    if (values.priority < 0)
      issues.priority = "Please select a priority.";

    if (!values.part.trim())
      issues.part = "Field cannot be empty.";
    else if (Number(values.part) <= 0 || isNaN(Number(values.part)))
      issues.part = "Must be a positive number.";

    if (!values.qty.trim())
      issues.qty = "Field cannot be empty.";
    else if (Number(values.qty) <= 0 || isNaN(Number(values.qty)))
      issues.qty = "Must be greater than zero.";

    if (!values.due)
      issues.due = "Please choose a due date.";

    return issues;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    setErr(null);
    const validation = validate(form);
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      return;
    }

    const data: TaskData = {
      status: form.status,
      name: form.name.trim(),
      subteam: form.subteam,
      priority: form.priority,
      pid: Number(form.part),
      quantity: Number(form.qty),
      due: Timestamp.fromDate(new Date(form.due))
    };

    setLoading(true);

    try {
      if (eligibleForAdd) {
        await sendTask(form.fscn.trim(), data);
        setForm(initialForm);
      } else {
        await fullUpdateTask(form.fscn.trim(), data);
      }
    } catch (e: any) {
      if ((e as FirestoreError).code == "not-found") {
        setErr("That part number does not exist for the selected manufacturer")
        setEligibleForAdd(true);
      } else {
        setErr((e as FirestoreError).code);
      }
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  }

  const inputStyle =
    "bg-gray-900 px-3 py-2 border rounded border-gray-800 placeholder-gray-500 outline-none focus:border-blue-500 w-full";
  const labelStyle =
    "mb-1 block font-medium";

  const errorText = (field: keyof FormData) =>
    errors[field] && (
      <p className="mt-1 text-red-500 font-medium text-sm">{errors[field]}</p>
    );

  return (
    <div className="flex-1 p-5">
      <h2 className="mb-6 text-3xl font-bold tracking-wide">
        Update Task (Extended)
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        <div>
          <label className={labelStyle}>
            Name
          </label>
          <input
            className={inputStyle}
            value={form.name}
            onChange={(e) =>
              updateField("name", e.target.value)
            }
          />
          {errorText("name")}
        </div>

        <div>
          <label className={labelStyle}>
            Part
          </label>
          <input
            type="number"
            className={inputStyle}
            value={form.part}
            onChange={(e) =>
              updateField("part", e.target.value)
            }
          />
          {errorText("part")}
        </div>

        <div>
          <label className={labelStyle}>
            Qty
          </label>
          <input
            type="number"
            className={inputStyle}
            value={form.qty}
            onChange={(e) =>
              updateField("qty", e.target.value)
            }
          />
          {errorText("qty")}
        </div>

        <div>
          <label className={labelStyle}>
            Manufacturer
          </label>
          <select
            className={inputStyle}
            value={form.fscn}
            onChange={(e) =>
              updateField("fscn", e.target.value)
            }
          >
            <option value={""}>Select...</option>

            {Object.entries(unifiedStaticState.fscnMapping).map((option) => (
              <option key={option[0]} value={option[0]}>
                {option[1]}
              </option>
            ))}
          </select>
          {errorText("fscn")}
        </div>

        <div>
          <label className={labelStyle}>
            Subteam
          </label>
          <select
            className={inputStyle}
            value={form.subteam}
            onChange={(e) =>
              updateField("subteam", Number(e.target.value))
            }
          >
            <option value={-1}>Select...</option>

            {Object.entries(unifiedStaticState.subteamMapping).map((option) => (
              <option key={option[0]} value={option[0]}>
                {option[1]}
              </option>
            ))}
          </select>
          {errorText("subteam")}
        </div>

        <div>
          <label className={labelStyle}>
            Status
          </label>
          <select
            className={inputStyle}
            value={form.status}
            onChange={(e) =>
              updateField("status", Number(e.target.value))
            }
          >
            {statusOptions.map((option, index) => (
              <option key={option} value={index}>
                {option}
              </option>
            ))}
          </select>
          {errorText("status")}
        </div>

        <div>
          <label className={labelStyle}>
            Priority
          </label>
          <select
            className={inputStyle}
            value={form.priority}
            onChange={(e) =>
              updateField("priority", Number(e.target.value))
            }
          >
            {priorityOptions.map((option, index) => (
              <option key={option} value={index}>
                {option}
              </option>
            ))}
          </select>
          {errorText("priority")}
        </div>

        <div>
          <label className={labelStyle}>
            Due
          </label>
          <input
            type="datetime-local"
            className={inputStyle}
            value={form.due}
            onChange={(e) =>
              updateField("due", e.target.value)
            }
          />
          {errorText("due")}
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {eligibleForAdd ? "Add Instead" : "Update"}

            {loading && (
              <svg
                className="ml-3 h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-20"
                />
                <path
                  fill="currentColor"
                  d="M22 12a10 10 0 00-10-10v4a6 6 0 016 6h4z"
                />
              </svg>
            )}
          </button>
          {err && <p className="mt-1 text-red-500 font-medium text-sm">{err}</p>}
        </div>
      </form>
    </div>
  );
}