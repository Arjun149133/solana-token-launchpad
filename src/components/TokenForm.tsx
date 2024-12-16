import { Input } from "./ui/input";
import { Button } from "./ui/button";
import React, { useState } from "react";
import { Label } from "./ui/label";
import ImageUpload from "./ImageUpload";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  ExtensionType,
  getAssociatedTokenAddressSync,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";

export type FormData = {
  name: string;
  symbol: string;
  initial_supply: number;
  decimal: number;
  description: string;
};

const TokenForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    symbol: "",
    initial_supply: 0,
    decimal: 9,
    description: "",
  });
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);

  const { connection } = useConnection();
  const wallet = useWallet();

  async function createToken(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!wallet.publicKey) return;

    try {
      const mintKeypair = Keypair.generate();
      const metadata = {
        mint: mintKeypair.publicKey,
        name: formData.name,
        symbol: formData.symbol,
        uri: "https://cdn.100xdevs.com/metadata.json",
        additionalMetadata: [],
      };

      const mintLen = getMintLen([ExtensionType.MetadataPointer]);
      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

      const lamports = await connection.getMinimumBalanceForRentExemption(
        mintLen + metadataLen
      );

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: mintLen,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMetadataPointerInstruction(
          mintKeypair.publicKey,
          wallet.publicKey,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          formData.decimal,
          wallet.publicKey,
          null,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          mint: mintKeypair.publicKey,
          metadata: mintKeypair.publicKey,
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
          mintAuthority: wallet.publicKey,
          updateAuthority: wallet.publicKey,
        })
      );

      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
      transaction.partialSign(mintKeypair);

      await wallet.sendTransaction(transaction, connection);
      console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);

      const ata = getAssociatedTokenAddressSync(
        mintKeypair.publicKey,
        wallet.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      console.log(ata.toBase58());

      const transaction2 = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          ata,
          wallet.publicKey,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        )
      );

      await wallet.sendTransaction(transaction2, connection);

      const transaction3 = new Transaction().add(
        createMintToInstruction(
          mintKeypair.publicKey,
          ata,
          wallet.publicKey,
          formData.initial_supply * Math.pow(10, formData.decimal),
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );

      await wallet.sendTransaction(transaction3, connection);

      console.log("Minted!");
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form className=" grid grid-cols-2 gap-5 w-full ">
      <div>
        <Label>Name</Label>
        <Input
          value={formData.name}
          placeholder="Name"
          onChange={onInputChange}
          name="name"
        />
      </div>
      <div>
        <Label>Symbol</Label>
        <Input
          value={formData.symbol}
          placeholder="Symbol"
          onChange={onInputChange}
          name="symbol"
        />
      </div>
      <div>
        <Label>Decimal</Label>
        <Input
          placeholder="Decimal"
          value={formData.decimal}
          onChange={onInputChange}
          name="decimal"
        />
      </div>
      <div>
        <Label>Initial Supply</Label>
        <Input
          value={formData.initial_supply}
          placeholder="Initial Supply"
          onChange={onInputChange}
          name="initial_supply"
        />
      </div>
      <div>
        <Label>Image</Label>
        <ImageUpload image={image} setImage={setImage} />
      </div>
      <div>
        <Label>Description</Label>
        <Input
          className=""
          value={formData.description}
          placeholder="Description"
          onChange={onInputChange}
          name="description"
        />
      </div>
      <div className=" flex col-span-2 justify-center p-2">
        <Button variant="secondary" onClick={createToken}>
          Create a Token
        </Button>
      </div>
    </form>
  );
};

export default TokenForm;
