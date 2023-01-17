import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Screen } from "./Screen";

const ItemSeparatorComponent = () => (
  <View
    style={{ marginVertical: 8, borderColor: "#eee", borderBottomWidth: 1 }}
  />
);
interface TokenList {
  name: string;
  tokenName: string;
  image: string;
}
const data: any[] = [
  {
    id: 1,
    name: "BlazeStake Staked SOL",
    tokenName: "bSOL",
    image: "/assets/bsol.jpg",
  },
  {
    id: 2,
    name: "Marinade staked SOL (mSOL)",
    tokenName: "mSOL",
    image: "/assets/mSOL.webp",
  },
];
const Token = () => {
  return (
    <Screen>
      <FlatList
        style={{ flex: 1 }}
        data={data}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ItemSeparatorComponent}
        renderItem={({ item }) => {
          return (
            <>
              <Pressable>
                <View>
                  <Text>dhru</Text>
                </View>
              </Pressable>
            </>
          );
        }}
      />
    </Screen>
  );
};

export default Token;
