import {Text} from "@/components/ui/Text";
import {View} from "react-native";

export function ErrorDisplay(props: { message: string } ) {

    return (
        <View className="flex-1 justify-center items-center">
            <Text>Sorry, an error occurred... {props.message}</Text>
        </View>
    )
}