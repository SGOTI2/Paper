import React, { useContext, useEffect, useState } from "react";
import { TaskStatus } from "./lib/Task";
import { separateByCamelCase } from "./lib/util";
import { UnifiedStaticData } from "./lib/unifiedStaticData";
import { produce } from "immer";
import { FirestoreError } from "firebase/firestore";
import { quickUpdateTask, type QuickTaskData } from "./lib/networking/updateTask";
import { Link, useSearchParams } from "react-router";

const statusOptions = Object.keys(TaskStatus).map((v) => separateByCamelCase(v));

type FormData = {
  status: number;
  part: string;
  fscn: string;
};

type ValidationErrors = Partial<Record<keyof FormData, string>>;

const initialForm: FormData = {
  status: -1,
  part: "",
  fscn: ""
};

export default function QuickUpdate() {
  const [searchParams] = useSearchParams({ p: "", f: "" });
  const unifiedStaticState = useContext(UnifiedStaticData);

  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>();

  function updateField<K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) {
    setForm(produce((draft) => {
      draft[key] = value;
    }));
  }

  function validate(values: FormData): ValidationErrors {
    const issues: ValidationErrors = {};

    if (values.status < 0)
      issues.status = "Please select a status.";

    if (!values.fscn.trim())
      issues.fscn = "Please select a machine.";

    if (!values.part.trim())
      issues.part = "Field cannot be empty.";
    else if (Number(values.part) <= 0 || isNaN(Number(values.part)))
      issues.part = "Must be a positive number.";

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

    const data: QuickTaskData = {
      status: form.status,
      pid: Number(form.part),
    };

    setLoading(true);

    try {
      await quickUpdateTask(form.fscn.trim(), data);
    } catch (e: any) {
      if ((e as FirestoreError).code == "not-found") {
        setErr("That part number does not exist for the selected manufacturer")
      } else {
        setErr((e as FirestoreError).code);
      }
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }

    setForm(initialForm);
  }

  useEffect(() => {
    updateField("part", searchParams.get("p") ?? "");
    const supposedFSCN = searchParams.get("f") ?? "";
    if (unifiedStaticState.fscn.find((k) => k == supposedFSCN)) {
      updateField("fscn", supposedFSCN);
    }
  }, [searchParams, unifiedStaticState.fscn]);

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
        Quick Part Status Updater
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
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

        <div className="md:col-span-2">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Update

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
            <Link
              to="/fullUpdate"
              role="button"
              className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              More Options
            </Link>
          </div>
          {err && <p className="mt-1 text-red-500 font-medium text-sm">{err}</p>}
        </div>
      </form>
    </div>
  );
}