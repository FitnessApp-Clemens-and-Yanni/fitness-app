import {ActivityIndicator, View} from "react-native";

export function LoadingDisplay() {

    return (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator/>
        </View>
    )

}