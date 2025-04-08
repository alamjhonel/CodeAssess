
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DatePickerFieldProps {
  id: string;
  label: string;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  required?: boolean;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({ id, label, date, setDate, required = false }) => {
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleDateChange = (type: 'year' | 'month' | 'day', value: string) => {
    const currentDate = date || new Date();
    const newDate = new Date(currentDate);
    
    if (type === 'year') {
      newDate.setFullYear(parseInt(value));
    } else if (type === 'month') {
      newDate.setMonth(months.indexOf(value));
    } else if (type === 'day') {
      newDate.setDate(parseInt(value));
    }
    
    setDate(newDate);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="flex flex-row gap-2">
        <div className="w-1/3">
          <Select 
            value={date ? String(date.getDate()) : undefined}
            onValueChange={(value) => handleDateChange('day', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {days.map((day) => (
                <SelectItem key={day} value={String(day)}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-1/3">
          <Select 
            value={date ? months[date.getMonth()] : undefined}
            onValueChange={(value) => handleDateChange('month', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-1/3">
          <Select 
            value={date ? String(date.getFullYear()) : undefined}
            onValueChange={(value) => handleDateChange('year', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DatePickerField;
