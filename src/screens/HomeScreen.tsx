import { Text, FlatList, View, Button } from "react-native";
import {
  Marinade,
  MarinadeConfig,
  Wallet,
  Provider,
} from "@marinade.finance/marinade-ts-sdk";
import { BN } from "bn.js";
import { Screen } from "../components/Screen";
import { usePublicKeys, useSolanaConnection } from "../hooks/xnft-hooks";
import { Connection } from "@solana/web3.js";
import { iWallet } from "../utils/wallet";

export function HomeScreen() {
  const connection = useSolanaConnection();
  // const pubKey = usePublicKeys();
  const { signTransaction, publicKey } = iWallet(window.xnft.solana.publicKey);

  const handleDeposit = async () => {
    console.log(connection, "-cone");
    const con = new Connection();
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
  return (
    <>
      <Screen>
        <View>
          <Button
            title={`The Future is`}
            color={"rgb(228, 208, 10)"}
            onPress={() => {
              // window.xnft.solana
              //   .signMessage(
              //     Buffer.from(`The time is: ${new Date().toLocaleTimeString()}`)
              //   )
              //   .then((signature: Uint8Array) => {
              //     console.log(Buffer.from(signature).toString("base64"));
              //   })
              //   .catch((e: any) => {
              //     console.log(e);
              //   });
              handleDeposit();
            }}
          />
        </View>
      </Screen>
    </>
  );
}
