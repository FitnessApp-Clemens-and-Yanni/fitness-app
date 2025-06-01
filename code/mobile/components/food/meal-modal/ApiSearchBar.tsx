import { TouchableOpacity, View } from "react-native";
import { Input } from "@ui/input";
import { FontAwesomeIcon } from "@/components/font-awesome-icon";
import { AppColors } from "@/lib/app-colors";

export function ApiSearchBar(props: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchFood: () => void;
}) {
  return (
    <View className="flex flex-col px-5">
      <View className="flex flex-row items-center gap-5">
        <View className="flex flex-row items-center justify-between flex-1 bg-primary/30 ring-primary/50 ring-1 rounded-md shadow">
          <Input
            className="bg-transparent border-none"
            placeholder={"Search"}
            value={props.searchTerm}
            onChangeText={props.setSearchTerm}
          />
          <TouchableOpacity
            onPress={() => {
              if (props.searchTerm.length > 0) {
                props.searchFood();
              }
            }}
            className="px-2"
          >
            <FontAwesomeIcon
              name="search"
              color={AppColors.PRIMARY}
              className="scale-[0.8]"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="shadow rounded-full aspect-square p-2">
          <FontAwesomeIcon
            name="camera"
            color={AppColors.PRIMARY}
            className="scale-75"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
