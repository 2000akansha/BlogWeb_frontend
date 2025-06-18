import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import styles for the date picker

const CustomDatePicker = ({
  selectedDate,
  onChangeDate,
  placeholder,
  errors,
}) => {
  const handleInputChange = (date) => {
    let error = "";

    if (date) {
      const today = new Date().toISOString().split("T")[0];
      const selectedDate = date.toISOString().split("T")[0]; // Convert selected date to yyyy-mm-dd format

      if (selectedDate > today) {
        error = "Date cannot be in the future";
      }
    }

    onChangeDate(date, error);
  };

  const handleInputChangeRaw = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <DatePicker
        selected={selectedDate}
        onChange={handleInputChange}
        onChangeRaw={handleInputChangeRaw}
        placeholderText={placeholder}
        dateFormat="dd-MM-yyyy"
        className="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        maxDate={new Date()}
        popperPlacement="bottom"
        popperModifiers={{
          offset: {
            enabled: true,
            offset: "0, 10",
          },
        }}
        calendarClassName="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
        dayClassName={(date) =>
          date.getDay() === 0 || date.getDay() === 6
            ? "text-red-500 font-semibold"
            : "text-gray-800"
        }
        monthClassName="text-blue-700"
        yearClassName="text-blue-700"
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
          changeYear,
          changeMonth,
        }) => (
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className="text-lg text-gray-700 font-bold hover:text-blue-600 disabled:opacity-50"
            >
              {"<"}
            </button>
            <div className="flex items-center">
              <select
                value={
                  date instanceof Date && !isNaN(date)
                    ? date.getMonth()
                    : new Date().getMonth()
                }
                onChange={({ target: { value } }) =>
                  changeMonth(parseInt(value, 10))
                }
                className="mr-2 text-gray-700 bg-white border border-gray-300 rounded px-2 py-1 shadow-md"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i} value={i}>
                    {new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>

              <select
                value={
                  date instanceof Date && !isNaN(date)
                    ? date.getFullYear()
                    : new Date().getFullYear()
                }
                onChange={({ target: { value } }) =>
                  changeYear(parseInt(value, 10))
                }
                className="text-gray-700 bg-white border border-gray-300 rounded px-2 py-1 shadow-md"
              >
                {Array.from({ length: 100 }).map((_, i) => (
                  <option key={i} value={new Date().getFullYear() - 50 + i}>
                    {new Date().getFullYear() - 50 + i}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className="text-lg text-gray-700 font-bold hover:text-blue-600 disabled:opacity-50"
            >
              {">"}
            </button>
          </div>
        )}
      />
      {errors && <p className="text-red-500 text-xs italic">{errors}</p>}
    </>
  );
};

export default CustomDatePicker;
