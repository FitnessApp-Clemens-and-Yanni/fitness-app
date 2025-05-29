import { TouchableOpacity, View } from "react-native";
import { Input } from "@ui/input";
import { ScanBarcode, Search } from "lucide-react-native";

export function ApiSearchBar(props: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchFood: () => void;
}) {
  return (
    <View className="flex flex-col">
      <View className="flex flex-row items-center gap-1 mb-2">
        <View className="flex flex-row items-center justify-between flex-1 bg-stone-300 border border-stone-500 rounded-md">
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
            <Search size={20} color="#78716c" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <ScanBarcode size={40} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
