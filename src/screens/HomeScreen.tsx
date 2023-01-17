import { Text, FlatList, View, Button, Animated } from "react-native";
import {
  Marinade,
  MarinadeConfig,
  Wallet,
  Provider,
} from "@marinade.finance/marinade-ts-sdk";
import { BN } from "bn.js";
import { Screen } from "../components/Screen";
import { usePublicKeys, useSolanaConnection } from "../hooks/xnft-hooks";
import { Connection, SystemProgram, Transaction } from "@solana/web3.js";
import { iWallet } from "../utils/wallet";
import { depositSol } from "@solana/spl-stake-pool";
import { BLAZESTAKE_POOL, RPC_URL, SOLPAY_API_ACTIVATION } from "../constants";
import {
  createStackNavigator,
  StackCardStyleInterpolator,
} from "@react-navigation/stack";
import Token from "../components/Token";

export function HomeScreen() {
  const connection = useSolanaConnection();
  const Stack = createStackNavigator();
  const { signTransaction, publicKey } = iWallet(window.xnft.solana.publicKey);

  const handleDepositmSol = async () => {
    console.log(connection, "-cone");
    const con = new Connection(RPC_URL);
    // const con = window.xnft.solana.connection;
    // console.log(con);
    console.log(window.xnft.solana.publicKey, "--");
    const config = new MarinadeConfig({
      connection: con,
      publicKey: window.xnft.solana.publicKey,
    });
    const marinade = new Marinade(config);
    console.log(con, "--c");
    console.log(window.xnft.solana.publicKey, "-pb");

    const { associatedMSolTokenAccountAddress, transaction } =
      await marinade.deposit(new BN(10000000));
    console.log(associatedMSolTokenAccountAddress.toBase58());
    const { blockhash } = await con.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;

    const signTx = await window.xnft.solana.signTransaction(transaction);
    const serTx = signTx.serialize();
    const tx = await con.sendRawTransaction(serTx);
    console.log(tx);
  };
  const handleDepositBsol = async () => {
    const pubKey = window.xnft.solana.publicKey;
    console.log("wo");

    const connection = new Connection(RPC_URL);
    let transaction = new Transaction();
    let depositTx = await depositSol(
      connection,
      BLAZESTAKE_POOL,
      pubKey,
      10000000
    );
    console.log("wo", pubKey);
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: pubKey,
        toPubkey: SOLPAY_API_ACTIVATION,
        lamports: 5000,
      })
    );
    transaction.add(...depositTx.instructions);
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = pubKey;
    console.log("wo");
    const signTx = await window.xnft.solana.signTransaction(transaction);
    let signers = depositTx.signers;
    if (signers.length > 0) {
      signTx.partialSign(...signers);
    }
    const serTx = signTx.serialize();
    const tx = await connection.sendRawTransaction(serTx);
    console.log(tx);
  };
  return (
    <>
      <Screen>
        {/* <Stack.Navigator
          screenOptions={{
            animationEnabled: true,
            cardStyleInterpolator: forSlide,
          }}
        >
          <Stack.Screen
            name="List"
            component={Token}
            options={{ title: "Token List" }}
          />
          <Stack.Screen
            name="Detail"
            component={Token}
            options={{ title: "Token Detail" }}
          />
        </Stack.Navigator> */}
        <Token />
      </Screen>
    </>
  );
}
const forSlide: StackCardStyleInterpolator = ({
  current,
  next,
  inverted,
  layouts: { screen },
}) => {
  const progress = Animated.add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: "clamp",
        })
      : 0
  );

  return {
    cardStyle: {
      transform: [
        {
          translateX: Animated.multiply(
            progress.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [
                screen.width, // Focused, but offscreen in the beginning
                0, // Fully focused
                screen.width * -0.3, // Fully unfocused
              ],
              extrapolate: "clamp",
            }),
            inverted
          ),
        },
      ],
    },
  };
};
