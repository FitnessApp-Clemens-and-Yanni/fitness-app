import { TouchableOpacity, View, Text } from "react-native";
import { useState } from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react-native";

const MILLISECONDS_DAY_FACTOR = 1000 * 60 * 60 * 24;

export function DateDisplay(props: {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}) {
  const today = new Date();

  const [weekStartDate, setWeekStartDate] = useState(
    getMondayOfWeek(props.selectedDate.valueOf() / MILLISECONDS_DAY_FACTOR),
  );

  function getMondayOfWeek(dateInDays: number) {
    const day = new Date(dateInDays * MILLISECONDS_DAY_FACTOR).getDay();
    const diff = day === 0 ? -6 : 1 - day;
    return new Date((dateInDays + diff) * MILLISECONDS_DAY_FACTOR);
  }

  function goToPreviousWeek() {
    const newStartDate = new Date(weekStartDate);
    newStartDate.setDate(weekStartDate.getDate() - 7);
    setWeekStartDate(newStartDate);
  }

  function goToNextWeek() {
    const newStartDate = new Date(weekStartDate);
    newStartDate.setDate(weekStartDate.getDate() + 7);
    setWeekStartDate(newStartDate);
  }

  function goToToday() {
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;

    const monday = new Date();
    monday.setDate(today.getDate() + diff);
    setWeekStartDate(monday);
    props.setSelectedDate(today);
  }

  function getWeekDates() {
    return new Array(7)
      .fill(null)
      .map(
        (_, index) =>
          new Date(weekStartDate.valueOf() + index * MILLISECONDS_DAY_FACTOR),
      );
  }

  const WEEK_DAYS_ABBREVIATIONS = [
    "Mo",
    "Tue",
    "Wed",
    "Thr",
    "Fr",
    "Sa",
    "Su",
  ] as const;

  const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ] as const;

  const month = MONTH_NAMES[weekStartDate.getMonth()];
  const year = weekStartDate.getFullYear();

  function changeDay(date: Date): void {
    props.setSelectedDate(date);
  }

  return (
    <View>
      <View className="flex flex-row justify-between p-2">
        <Text className="text-lg">
          {month} {year}
        </Text>

        <TouchableOpacity onPress={goToToday}>
          <Text className="text-lg">Today</Text>
        </TouchableOpacity>
      </View>

      <View className="flex flex-row justify-between">
        <TouchableOpacity className="justify-center" onPress={goToPreviousWeek}>
          <ChevronLeftIcon />
        </TouchableOpacity>

        {getWeekDates().map((date, index) => (
          <TouchableOpacity key={index} onPress={() => changeDay(date)}>
            <View
              className={`items-center p-1 ${
                date.toDateString() === props.selectedDate.toDateString()
                  ? "bg-pink-400 rounded px-2 py-1 [&_div]:text-white"
                  : ""
              }`}
            >
              <Text>{WEEK_DAYS_ABBREVIATIONS[index]}</Text>

              <Text>{date.getDate()}.</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity className=" justify-center" onPress={goToNextWeek}>
          <ChevronRightIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
}
