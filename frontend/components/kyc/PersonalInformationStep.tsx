"use client";

import React, { useState } from "react";
// import { Calendar } from "lucide-react"
import type { KYCFormData } from "@/app/admin/profile/kyc/page";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import dayjs, { Dayjs } from "dayjs";
import { CustomDatePicker } from "../common/CustomDatePicker";
import Select from "react-select"; // or your select library
import { FormControl, FormHelperText } from "@mui/material";

type IDTypeOption = {
  value: string;
  label: string;
};

interface PersonalInformationStepProps {
  formData: KYCFormData;
  updateFormData: (data: Partial<KYCFormData>) => void;
  onNext: () => void;
}

export default function PersonalInformationStep({
  formData,
  updateFormData,
  onNext,
}: PersonalInformationStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const idTypeOptions: IDTypeOption[] = [
    { value: "passport", label: "Passport" },
    { value: "nationalId", label: "National ID" },
    { value: "driverLicense", label: "Driver License" },
    { value: "bpp", label: "BPP" },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    if (!formData.idType) {
      newErrors.idType = "ID type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onNext();
    }
  };

  // const handleDateChange = (date: Dayjs | null) => {
  //   updateFormData({ dateOfBirth: date?.format("YYYY-MM-DD") || "" });
  // };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-6">Personal Information</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium mb-1"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="Enter Your First Name"
              value={formData.firstName}
              onChange={(e) => updateFormData({ firstName: e.target.value })}
              className={`w-full px-3 py-2 border ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium mb-1"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Enter Your Last Name"
              value={formData.lastName}
              onChange={(e) => updateFormData({ lastName: e.target.value })}
              className={`w-full px-3 py-2 border ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium mb-1"
            >
              Date of Birth
            </label>
            <CustomDatePicker
              value={formData.dateOfBirth}
              onChange={(date) => updateFormData({ dateOfBirth: date })}
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>
            )}
          </div>

          {/* ID Type */}
          <div>
            <label htmlFor="idType" className="block text-sm font-medium mb-1">
              Select the type of government issued file
            </label>
            {/* ID Type - Updated Version */}
            <FormControl fullWidth error={!!errors.idType}>
              <Select<IDTypeOption>
                options={idTypeOptions}
                onChange={(selected) =>
                  updateFormData({
                    idType: selected?.value || "",
                  })
                }
                isClearable
                placeholder="Select the type of government issued file"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    height: "42px", // Matching your date picker height
                    minHeight: "42px",

                    backgroundColor: "transparent", // Remove background
                    "&:hover": {
                      borderColor: errors.idType ? "#ef4444" : "#3b82f6",
                    },
                  }),
                  valueContainer: (provided) => ({
                    ...provided,
                    height: "42px",
                    padding: "0 8px",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999,
                  }),
                }}
              />
              {errors.idType && (
                <FormHelperText className="text-red-500 text-xs mt-1">
                  {errors.idType}
                </FormHelperText>
              )}
            </FormControl>
          </div>

          {/* Next Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </LocalizationProvider>
  );
}
