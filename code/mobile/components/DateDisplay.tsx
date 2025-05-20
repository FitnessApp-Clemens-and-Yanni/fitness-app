import {TouchableOpacity, View, Text} from "react-native";
import {useState} from "react";
import {ChevronRightIcon, ChevronLeftIcon} from "lucide-react-native";

export function DateDisplay() {

    const [currentDate] = useState(new Date());

    const weekDays = [
        [['Monday'], ['Mo']],
        [['Tuesday'], ['Tue']],
        [['Wednesday'], ['Wed']],
        [['Thursday'], ['Thr']],
        [['Friday'], ['Fr']],
        [['Saturday'], ['Sa']],
        [['Sunday'], ['Su']]
    ];

    return (
        <View className="flex flex-row justify-between"
        >

            <TouchableOpacity>
                <ChevronLeftIcon/>
            </TouchableOpacity>


            {weekDays.map((day, index) => (
                <TouchableOpacity
                    key={index}
                >

                    <Text className="">
                        {weekDays[index][1]}
                    </Text>

                    <Text>
                        {currentDate.getDay()}.{currentDate.getMonth() + 1}.
                    </Text>

                </TouchableOpacity>
            ))}


            <TouchableOpacity>
                <ChevronRightIcon/>
            </TouchableOpacity>

        </View>
    )
}